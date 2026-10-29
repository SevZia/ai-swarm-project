/**
 * HDD FOOD - Database & State Repository Module
 * Connects to MySQL 8 (hdd_appsheet) with automatic resilient in-memory fallback.
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Initial seed data from migrations/001_hdd_food_schema.sql
const initialProducts = [
  {
    SKU: 'TP-BO-TENDER-MB2',
    ProductName: 'Chilled Tenderloin Angus MB2+',
    Category: 'Thịt Bò Nhập Khẩu',
    CuttingSpec: 'Cắt Steak 200g - 250g',
    Unit: 'Kg',
    cost_price: 850000.00,
    previous_cost_price: 820000.00,
    DesiredMarginPct: 25.00,
    latest_supplier: 'Midfield Meat Australia',
    last_purchase_date: '2026-10-20'
  },
  {
    SKU: 'TP-BO-STRIP-MB3',
    ProductName: 'Chilled Striploin Angus MB3+',
    Category: 'Thịt Bò Nhập Khẩu',
    CuttingSpec: 'Cắt Steak 250g',
    Unit: 'Kg',
    cost_price: 620000.00,
    previous_cost_price: 600000.00,
    DesiredMarginPct: 22.00,
    latest_supplier: 'Stanbroke Australia',
    last_purchase_date: '2026-10-22'
  },
  {
    SKU: 'TP-BO-RIBEYE-MB2',
    ProductName: 'Chilled Ribeye Angus MB2+',
    Category: 'Thịt Bò Nhập Khẩu',
    CuttingSpec: 'Cắt Steak 300g dày 2cm',
    Unit: 'Kg',
    cost_price: 720000.00,
    previous_cost_price: 710000.00,
    DesiredMarginPct: 25.00,
    latest_supplier: 'Teys Australia',
    last_purchase_date: '2026-10-24'
  },
  {
    SKU: 'TP-BO-BRISKET-CA',
    ProductName: 'Ba rọi bò Canada (Short Plate)',
    Category: 'Thịt Bò Nhập Khẩu',
    CuttingSpec: 'Bào cuộn lẩu / nướng 1.5mm',
    Unit: 'Kg',
    cost_price: 185000.00,
    previous_cost_price: 180000.00,
    DesiredMarginPct: 20.00,
    latest_supplier: 'Excel Canada Meat',
    last_purchase_date: '2026-10-25'
  }
];

const initialBatches = [
  {
    BatchID: 1,
    BatchNumber: 'BATCH-202610-01',
    SKU: 'TP-BO-TENDER-MB2',
    StockQuantity: 25.500,
    ManufactureDate: '2026-09-15',
    ExpiryDate: calculateRelativeDate(6),
    WarehouseLocation: 'Kho Lạnh Âm 2 - 4C',
    Status: 'IN_STOCK'
  },
  {
    BatchID: 2,
    BatchNumber: 'BATCH-202610-02',
    SKU: 'TP-BO-STRIP-MB3',
    StockQuantity: 42.000,
    ManufactureDate: '2026-09-20',
    ExpiryDate: calculateRelativeDate(14),
    WarehouseLocation: 'Kho Lạnh Âm 2 - 4C',
    Status: 'IN_STOCK'
  },
  {
    BatchID: 3,
    BatchNumber: 'BATCH-202610-03',
    SKU: 'TP-BO-RIBEYE-MB2',
    StockQuantity: 18.250,
    ManufactureDate: '2026-10-01',
    ExpiryDate: calculateRelativeDate(28),
    WarehouseLocation: 'Kho Lạnh Âm 2 - 4C',
    Status: 'IN_STOCK'
  },
  {
    BatchID: 4,
    BatchNumber: 'BATCH-202610-04',
    SKU: 'TP-BO-BRISKET-CA',
    StockQuantity: 120.000,
    ManufactureDate: '2026-10-10',
    ExpiryDate: calculateRelativeDate(90),
    WarehouseLocation: 'Kho Đông -18C',
    Status: 'IN_STOCK'
  }
];

const initialPriceHistory = [
  {
    HistoryID: 1,
    SKU: 'TP-BO-TENDER-MB2',
    UnitPrice: 820000.00,
    SupplierName: 'Midfield Meat Australia',
    ReceiptRef: 'INV-202609-088',
    EffectiveDate: '2026-09-15',
    SourceType: 'OCR_INVOICE',
    RecordedAt: '2026-09-15 08:30:00'
  },
  {
    HistoryID: 2,
    SKU: 'TP-BO-TENDER-MB2',
    UnitPrice: 850000.00,
    SupplierName: 'Midfield Meat Australia',
    ReceiptRef: 'INV-202610-104',
    EffectiveDate: '2026-10-20',
    SourceType: 'OCR_INVOICE',
    RecordedAt: '2026-10-20 09:15:00'
  },
  {
    HistoryID: 3,
    SKU: 'TP-BO-STRIP-MB3',
    UnitPrice: 600000.00,
    SupplierName: 'Stanbroke Australia',
    ReceiptRef: 'INV-202609-112',
    EffectiveDate: '2026-09-20',
    SourceType: 'OCR_INVOICE',
    RecordedAt: '2026-09-20 10:00:00'
  },
  {
    HistoryID: 4,
    SKU: 'TP-BO-STRIP-MB3',
    UnitPrice: 620000.00,
    SupplierName: 'Stanbroke Australia',
    ReceiptRef: 'INV-202610-155',
    EffectiveDate: '2026-10-22',
    SourceType: 'ZALO_QUOTE',
    RecordedAt: '2026-10-22 14:20:00'
  },
  {
    HistoryID: 5,
    SKU: 'TP-BO-BRISKET-CA',
    UnitPrice: 185000.00,
    SupplierName: 'Excel Canada Meat',
    ReceiptRef: 'INV-CAN-3312',
    EffectiveDate: '2026-10-25',
    SourceType: 'MANUAL_EXCEL',
    RecordedAt: '2026-10-25 11:45:00'
  }
];

const initialOCRLog = [
  {
    OCRID: 'OCR-8f12a9e0-d021-4d92-bb50-4824e4d58011',
    ReceiptID: 'REC-20261020-01',
    SKU: 'TP-BO-TENDER-MB2',
    ProductName: 'Thăn nội bò Úc Tenderloin Chilled MB2+',
    ReceivedQuantity: 25.500,
    UnitPrice: 850000.00,
    RawExtractedText: 'Thăn nội bò Úc Chilled MB2+ - Slg: 25.5kg - Đơn giá: 850.000đ/kg',
    ConfidenceScore: 98.50,
    Status: 'COMMITTED',
    CreatedAt: '2026-10-20 09:10:00'
  }
];

function calculateRelativeDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

class DatabaseRepository {
  constructor() {
    this.useMySQL = false;
    this.pool = null;
    this.mysqlConfig = {
      host: process.env.DB_HOST || '31.220.60.199',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'hdd_user',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hdd_appsheet',
      connectTimeout: 2500
    };

    // In-memory collections (cloned deep copies)
    this.products = JSON.parse(JSON.stringify(initialProducts));
    this.batches = JSON.parse(JSON.stringify(initialBatches));
    this.priceHistory = JSON.parse(JSON.stringify(initialPriceHistory));
    this.ocrLog = JSON.parse(JSON.stringify(initialOCRLog));
    this.nextHistoryId = 6;
  }

  async init() {
    try {
      this.pool = mysql.createPool({
        ...this.mysqlConfig,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
      });

      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      this.useMySQL = true;
      console.log(`[Database] Connected successfully to MySQL ${this.mysqlConfig.host}:${this.mysqlConfig.port}/${this.mysqlConfig.database}`);
    } catch (err) {
      this.useMySQL = false;
      console.warn(`[Database] Remote MySQL (${this.mysqlConfig.host}) unavailable (${err.message}). Using high-fidelity in-memory seed store.`);
    }
  }

  async checkHealth() {
    if (this.useMySQL && this.pool) {
      try {
        const [rows] = await this.pool.query('SELECT 1 AS alive');
        return {
          connected: true,
          mode: 'MySQL 8 (hdd_appsheet)',
          host: this.mysqlConfig.host,
          database: this.mysqlConfig.database,
          ping: 'ok'
        };
      } catch (err) {
        return {
          connected: false,
          mode: 'Memory Fallback (Active)',
          host: this.mysqlConfig.host,
          database: this.mysqlConfig.database,
          error: err.message
        };
      }
    }
    return {
      connected: false,
      mode: 'In-Memory State Store (UASOF Seed Data)',
      host: this.mysqlConfig.host,
      database: this.mysqlConfig.database,
      note: 'Operating in standalone zero-latency mode'
    };
  }

  calculateSuggestedPrice(costPrice, marginPct) {
    const margin = typeof marginPct === 'number' ? marginPct : 20;
    return Math.round(costPrice * (1 + margin / 100));
  }

  async getProducts({ search = '', category = '', margin } = {}) {
    if (this.useMySQL) {
      try {
        let sql = `SELECT * FROM Products WHERE 1=1`;
        const params = [];
        if (category && category !== 'ALL') {
          sql += ` AND (Category = ? OR CuttingSpec LIKE ?)`;
          params.push(category, `%${category}%`);
        }
        if (search) {
          sql += ` AND (SKU LIKE ? OR ProductName LIKE ? OR CuttingSpec LIKE ?)`;
          const term = `%${search}%`;
          params.push(term, term, term);
        }
        sql += ` ORDER BY SKU ASC`;
        const [rows] = await this.pool.query(sql, params);
        return rows.map(p => this.enrichProduct(p, margin));
      } catch (err) {
        console.error('[Database] Query MySQL failed, fallback to memory:', err.message);
      }
    }

    // Memory query
    let filtered = [...this.products];
    if (category && category !== 'ALL') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(p => 
        p.Category.toLowerCase().includes(catLower) || 
        (p.CuttingSpec && p.CuttingSpec.toLowerCase().includes(catLower))
      );
    }
    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.SKU.toLowerCase().includes(q) || 
        p.ProductName.toLowerCase().includes(q) || 
        (p.CuttingSpec && p.CuttingSpec.toLowerCase().includes(q))
      );
    }

    return filtered.map(p => this.enrichProduct(p, margin));
  }

  enrichProduct(product, customMargin) {
    const cost = parseFloat(product.cost_price) || 0;
    const prevCost = parseFloat(product.previous_cost_price) || 0;
    const margin = customMargin !== undefined && !isNaN(customMargin) 
      ? parseFloat(customMargin) 
      : (parseFloat(product.DesiredMarginPct) || 20);

    const suggested = Math.round(cost * (1 + margin / 100));
    const profit = suggested - cost;
    const diffPrice = cost - prevCost;
    const pctChange = prevCost > 0 ? parseFloat(((diffPrice / prevCost) * 100).toFixed(2)) : 0;

    return {
      ...product,
      cost_price: cost,
      previous_cost_price: prevCost,
      DesiredMarginPct: margin,
      suggested_price: suggested,
      profit_per_kg: profit,
      price_diff: diffPrice,
      price_change_pct: pctChange
    };
  }

  async getProductBySku(sku) {
    if (this.useMySQL) {
      try {
        const [rows] = await this.pool.query('SELECT * FROM Products WHERE SKU = ? LIMIT 1', [sku]);
        if (rows.length > 0) return this.enrichProduct(rows[0]);
      } catch (err) {
        console.error('[Database] MySQL getProductBySku failed:', err.message);
      }
    }
    const item = this.products.find(p => p.SKU === sku);
    return item ? this.enrichProduct(item) : null;
  }

  async getExpiringWarnings(alertType = 'ALL') {
    if (this.useMySQL) {
      try {
        const [rows] = await this.pool.query('SELECT * FROM ExpiringProductsWarning');
        return this.filterExpiringList(rows, alertType);
      } catch (err) {
        console.error('[Database] MySQL ExpiringProductsWarning view query failed:', err.message);
      }
    }

    // Memory query: Calculate DaysRemaining dynamically from ExpiryDate
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const warnings = [];
    for (const batch of this.batches) {
      if (batch.StockQuantity <= 0) continue;
      const expiry = new Date(batch.ExpiryDate);
      expiry.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

      if (diffDays <= 30) {
        let alert = 'CẬN HẠN (< 30 NGÀY)';
        if (diffDays < 0) alert = 'ĐÃ HẾT HẠN';
        else if (diffDays <= 7) alert = 'KHẨN CẤP (< 7 NGÀY)';
        else if (diffDays <= 15) alert = 'CẢNH BÁO CAO (< 15 NGÀY)';

        const prod = this.products.find(p => p.SKU === batch.SKU);

        warnings.push({
          SKU: batch.SKU,
          ProductName: prod ? prod.ProductName : batch.SKU,
          BatchNumber: batch.BatchNumber,
          StockQuantity: batch.StockQuantity,
          ExpiryDate: batch.ExpiryDate,
          DaysRemaining: diffDays,
          WarningAlert: alert,
          WarehouseLocation: batch.WarehouseLocation
        });
      }
    }

    warnings.sort((a, b) => a.DaysRemaining - b.DaysRemaining);
    return this.filterExpiringList(warnings, alertType);
  }

  filterExpiringList(list, alertType) {
    if (!alertType || alertType === 'ALL') return list;
    if (alertType === 'KHAN_CAP') return list.filter(b => b.DaysRemaining <= 7);
    if (alertType === 'CAO') return list.filter(b => b.DaysRemaining > 7 && b.DaysRemaining <= 15);
    if (alertType === 'CAN_HAN') return list.filter(b => b.DaysRemaining > 15 && b.DaysRemaining <= 30);
    return list;
  }

  async getPriceHistory(sku = null, limit = 50) {
    if (this.useMySQL) {
      try {
        let sql = 'SELECT * FROM PriceHistory';
        const params = [];
        if (sku) {
          sql += ' WHERE SKU = ?';
          params.push(sku);
        }
        sql += ' ORDER BY RecordedAt DESC LIMIT ?';
        params.push(limit);
        const [rows] = await this.pool.query(sql, params);
        return rows;
      } catch (err) {
        console.error('[Database] MySQL PriceHistory query failed:', err.message);
      }
    }

    let list = [...this.priceHistory];
    if (sku) {
      list = list.filter(h => h.SKU === sku);
    }
    return list.sort((a, b) => new Date(b.RecordedAt || b.EffectiveDate) - new Date(a.RecordedAt || a.EffectiveDate)).slice(0, limit);
  }

  async commitQuote({ items = [], supplierName = 'N/A', receiptRef = 'RECEIPT-AUTO', effectiveDate = null, sourceType = 'OCR_INVOICE' }) {
    const date = effectiveDate || new Date().toISOString().split('T')[0];
    const committedRecords = [];

    for (const item of items) {
      const sku = item.SKU;
      const newPrice = parseFloat(item.newPrice) || 0;
      const qty = parseFloat(item.quantity) || 0;
      const rawText = item.rawProductName || item.rawExtractedText || '';
      const confidence = parseFloat(item.confidence) || 98.0;

      // 1. Update Products
      let existingProd = this.products.find(p => p.SKU === sku);
      if (existingProd) {
        existingProd.previous_cost_price = existingProd.cost_price;
        existingProd.cost_price = newPrice;
        existingProd.latest_supplier = supplierName;
        existingProd.last_purchase_date = date;
      }

      // 2. Insert PriceHistory
      const historyEntry = {
        HistoryID: this.nextHistoryId++,
        SKU: sku,
        UnitPrice: newPrice,
        SupplierName: supplierName,
        ReceiptRef: receiptRef,
        EffectiveDate: date,
        SourceType: sourceType,
        RecordedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      this.priceHistory.unshift(historyEntry);

      // 3. Insert InboundReceiptOCR
      const ocrEntry = {
        OCRID: 'OCR-' + crypto.randomUUID(),
        ReceiptID: receiptRef,
        SKU: sku,
        ProductName: rawText || (existingProd ? existingProd.ProductName : sku),
        ReceivedQuantity: qty,
        UnitPrice: newPrice,
        RawExtractedText: rawText,
        ConfidenceScore: confidence,
        Status: 'COMMITTED',
        CreatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      this.ocrLog.unshift(ocrEntry);

      committedRecords.push({
        sku,
        newPrice,
        previousPrice: existingProd ? existingProd.previous_cost_price : 0,
        historyId: historyEntry.HistoryID,
        ocrId: ocrEntry.OCRID
      });

      // If MySQL is active, execute transactions
      if (this.useMySQL) {
        try {
          // Update Products
          await this.pool.query(
            `UPDATE Products 
             SET previous_cost_price = cost_price, 
                 cost_price = ?, 
                 latest_supplier = ?, 
                 last_purchase_date = ? 
             WHERE SKU = ?`,
            [newPrice, supplierName, date, sku]
          );

          // Insert PriceHistory
          await this.pool.query(
            `INSERT INTO PriceHistory (SKU, UnitPrice, SupplierName, ReceiptRef, EffectiveDate, SourceType)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [sku, newPrice, supplierName, receiptRef, date, sourceType]
          );

          // Insert InboundReceiptOCR
          await this.pool.query(
            `INSERT INTO InboundReceiptOCR (OCRID, ReceiptID, SKU, ProductName, ReceivedQuantity, UnitPrice, RawExtractedText, ConfidenceScore, Status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'COMMITTED')`,
            [ocrEntry.OCRID, receiptRef, sku, ocrEntry.ProductName, qty, newPrice, rawText, confidence]
          );
        } catch (sqlErr) {
          console.error(`[Database] MySQL sync error for SKU ${sku}:`, sqlErr.message);
        }
      }
    }

    return {
      success: true,
      committedCount: committedRecords.length,
      records: committedRecords,
      effectiveDate: date,
      supplierName,
      receiptRef
    };
  }

  getSummaryStats() {
    return {
      totalSkus: this.products.length,
      expiringBatchesCount: this.batches.filter(b => {
        const diff = Math.ceil((new Date(b.ExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return diff <= 30 && b.StockQuantity > 0;
      }).length,
      totalPriceRecords: this.priceHistory.length,
      totalOcrRecords: this.ocrLog.length
    };
  }

  async getBatches() {
    if (this.useMySQL) {
      try {
        const [rows] = await this.pool.query('SELECT * FROM ProductBatches ORDER BY ExpiryDate ASC');
        return rows;
      } catch (err) {
        console.error('[Database] MySQL ProductBatches query failed:', err.message);
      }
    }
    return [...this.batches];
  }

  async getOcrLogs() {
    if (this.useMySQL) {
      try {
        const [rows] = await this.pool.query('SELECT * FROM InboundReceiptOCR ORDER BY CreatedAt DESC');
        return rows;
      } catch (err) {
        console.error('[Database] MySQL InboundReceiptOCR query failed:', err.message);
      }
    }
    return [...this.ocrLog];
  }

  async getAllDatabaseObjects() {
    const products = await this.getProducts();
    const batches = await this.getBatches();
    const priceHistory = await this.getPriceHistory();
    const ocrLogs = await this.getOcrLogs();
    const expiringView = await this.getExpiringWarnings();
    return {
      connected: this.useMySQL,
      database: this.mysqlConfig.database,
      tables: {
        Products: {
          name: 'Products',
          type: 'TABLE',
          description: 'Danh mục sản phẩm, quy cách cắt, giá vốn và biên lợi nhuận mong muốn',
          columns: ['SKU', 'ProductName', 'Category', 'CuttingSpec', 'Unit', 'cost_price', 'previous_cost_price', 'DesiredMarginPct', 'suggested_price', 'latest_supplier', 'last_purchase_date', 'updated_at'],
          primaryKey: 'SKU',
          rowCount: products.length,
          data: products
        },
        ProductBatches: {
          name: 'ProductBatches',
          type: 'TABLE',
          description: 'Quản lý từng lô hàng, số lượng tồn kho và hạn sử dụng (Expiry Date)',
          columns: ['BatchID', 'BatchNumber', 'SKU', 'StockQuantity', 'ManufactureDate', 'ExpiryDate', 'WarehouseLocation', 'Status'],
          primaryKey: 'BatchID',
          rowCount: batches.length,
          data: batches
        },
        PriceHistory: {
          name: 'PriceHistory',
          type: 'TABLE',
          description: 'Nhật ký lịch sử biến động giá nhập qua từng đợt báo giá/hóa đơn',
          columns: ['HistoryID', 'SKU', 'UnitPrice', 'SupplierName', 'ReceiptRef', 'EffectiveDate', 'SourceType', 'RecordedAt'],
          primaryKey: 'HistoryID',
          rowCount: priceHistory.length,
          data: priceHistory
        },
        InboundReceiptOCR: {
          name: 'InboundReceiptOCR',
          type: 'TABLE',
          description: 'Nhật ký bóc tách dữ liệu hóa đơn/Zalo bằng AI và độ tin cậy',
          columns: ['OCRID', 'ReceiptID', 'SKU', 'ProductName', 'ReceivedQuantity', 'UnitPrice', 'RawExtractedText', 'ConfidenceScore', 'Status', 'CreatedAt'],
          primaryKey: 'OCRID',
          rowCount: ocrLogs.length,
          data: ocrLogs
        }
      },
      views: {
        ExpiringProductsWarning: {
          name: 'ExpiringProductsWarning',
          type: 'VIEW',
          description: 'View tự động tính toán thời hạn sử dụng còn lại (DATEDIFF <= 30 ngày) cho Kinh doanh xả hàng',
          columns: ['SKU', 'ProductName', 'BatchNumber', 'StockQuantity', 'ExpiryDate', 'DaysRemaining', 'WarningAlert'],
          underlyingTables: ['ProductBatches', 'Products'],
          rowCount: expiringView.length,
          data: expiringView
        }
      }
    };
  }
}

const db = new DatabaseRepository();
module.exports = db;
