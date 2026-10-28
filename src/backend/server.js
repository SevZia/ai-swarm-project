/**
 * HDD FOOD - Web Application Backend (Express API)
 * Task: TASK-CODE-001
 * Architecture: UASOF v3.2 Enterprise
 * Serves static UI from src/frontend/ and provides real-time pricing & inventory APIs.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./db');
const { parseQuoteText } = require('./parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup upload directory & multer for quotation / invoice files
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// =============================================================================
// API ENDPOINTS
// =============================================================================

/**
 * GET /api/health
 * Checks server health, database connection (MySQL hdd_appsheet), and system metrics.
 */
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await db.checkHealth();
    const stats = db.getSummaryStats();

    res.json({
      status: 'ok',
      service: 'HDD Food Pricing & Expiration Management System',
      version: '3.2.0',
      timestamp: new Date().toISOString(),
      mysql: dbHealth,
      stats: stats
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

/**
 * GET /api/products
 * Returns list of products with current cost price, previous cost, suggested price,
 * margin, profit per kg, search and filter options.
 * Query params: ?search=&category=&margin=
 */
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, margin } = req.query;
    const parsedMargin = margin !== undefined ? parseFloat(margin) : undefined;
    const products = await db.getProducts({
      search: search || '',
      category: category || '',
      margin: parsedMargin
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * GET /api/expiring-warnings
 * Returns list of batches nearing expiration date (DaysRemaining <= 30)
 * Matching view ExpiringProductsWarning in MySQL.
 * Query params: ?alertType=ALL|KHAN_CAP|CAO|CAN_HAN
 */
app.get('/api/expiring-warnings', async (req, res) => {
  try {
    const { alertType } = req.query;
    const warnings = await db.getExpiringWarnings(alertType || 'ALL');

    res.json({
      success: true,
      count: warnings.length,
      data: warnings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * POST /api/extract-quote
 * Smart quote parser from Zalo text or uploaded food pricing file.
 * Handles both JSON payload { rawText, supplierHint } and multipart file upload.
 */
app.post('/api/extract-quote', upload.single('file'), async (req, res) => {
  try {
    let rawText = req.body.rawText || '';
    const supplierHint = req.body.supplierHint || req.body.supplierName || null;

    // If file was uploaded (txt, csv, or json text file)
    if (req.file) {
      const filePath = req.file.path;
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        rawText = rawText ? `${rawText}\n${fileContent}` : fileContent;
      } catch (readErr) {
        console.warn(`[QuoteParser] File read warning: ${readErr.message}`);
      }
    }

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp nội dung báo giá (rawText) hoặc tải lên file hóa đơn / bảng giá'
      });
    }

    const result = await parseQuoteText(rawText, db, supplierHint);
    res.json(result);
  } catch (err) {
    console.error('[QuoteParser] Error parsing quote:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * POST /api/commit-quote
 * Approves and commits parsed quote data into Products, PriceHistory, and InboundReceiptOCR.
 * Body: { items: [...], supplierName, receiptRef, effectiveDate, sourceType }
 */
app.post('/api/commit-quote', async (req, res) => {
  try {
    const { items, supplierName, receiptRef, effectiveDate, sourceType } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách sản phẩm duyệt (items) không được để trống'
      });
    }

    const commitResult = await db.commitQuote({
      items,
      supplierName: supplierName || 'N/A',
      receiptRef: receiptRef || `INV-${Date.now().toString().slice(-6)}`,
      effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
      sourceType: sourceType || 'OCR_INVOICE'
    });

    res.json(commitResult);
  } catch (err) {
    console.error('[CommitQuote] Error committing quote to DB:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * GET /api/price-history
 * Returns historical records of price updates.
 * Query params: ?sku=&limit=
 */
app.get('/api/price-history', async (req, res) => {
  try {
    const { sku, limit } = req.query;
    const history = await db.getPriceHistory(sku || null, parseInt(limit || '50', 10));

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Express server
async function startServer() {
  await db.init();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🥩 HDD FOOD PRICING & INVENTORY MANAGEMENT SYSTEM`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static UI from: ${frontendPath}`);
    console.log(`📡 Ready for AppSheet sync & quotation processing`);
    console.log(`=======================================================`);
  });
}

startServer();

module.exports = app;
