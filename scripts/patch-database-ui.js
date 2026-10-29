const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/frontend/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add Nav Button
const navTarget = `<!-- Tab: Cảnh Báo Cận Date -->`;
const navReplacement = `<!-- Tab: Cảnh Báo Cận Date -->
        <button onclick="switchTab('tab-expiry')" id="btn-tab-expiry" class="nav-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
          <span>4. Giám Sát Cận Hạn</span>
          <span id="badge-expiry-count" class="px-2 py-0.5 text-[10px] rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold pulse-danger">3 Lô Cần Xả</span>
        </button>

        <!-- Tab: Tra Cứu CSDL (Table vs View) -->
        <button onclick="switchTab('tab-database')" id="btn-tab-database" class="nav-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <i class="fa-solid fa-database text-sky-500"></i>
          <span>5. Tra Cứu CSDL (Table vs View)</span>
          <span class="px-2 py-0.5 text-[10px] rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold">Bảng Products & Views</span>
        </button>`;

// Replace nav button (remove the old one + insert both)
const oldNavRegex = /<!-- Tab: Cảnh Báo Cận Date -->[\s\S]*?<\/button>/;
if (oldNavRegex.test(html)) {
  html = html.replace(oldNavRegex, navReplacement);
  console.log('✅ Nav tab button inserted');
} else {
  console.error('❌ Could not find oldNavRegex');
}

// 2. Add Tab 5 HTML Pane before </main>
const tab5Markup = `
    <!-- ============================================================== -->
    <!-- TAB 5: TRA CỨU & KIỂM TRA CSDL (TABLE VS VIEW EXPLORER)        -->
    <!-- ============================================================== -->
    <div id="tab-database" class="tab-pane hidden space-y-6 sm:space-y-8">
      
      <!-- Top Educational & Architecture Banner: TABLE vs VIEW -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Physical Tables Banner -->
        <div class="glass-card rounded-2xl p-5 border-l-4 border-l-sky-500 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center">
              <i class="fa-solid fa-table-cells mr-1.5 text-base"></i> CSDL Vật Lý: TABLE (Bảng Lưu Trữ)
            </span>
            <span class="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-extrabold">InnoDB • Primary Keys</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Lưu trữ dữ liệu thực tế trên ổ đĩa. Quản lý trạng thái bền vững với khóa chính <code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">SKU</code>, <code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">BatchID</code> và khóa ngoại liên kết (Foreign Keys).
          </p>
          <div class="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
            <span class="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-bold">Products (Bảng Sản Phẩm)</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">ProductBatches</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">PriceHistory</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">InboundReceiptOCR</span>
          </div>
        </div>

        <!-- Virtual Views Banner -->
        <div class="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center">
              <i class="fa-solid fa-eye mr-1.5 text-base"></i> Bảng Ảo Động: VIEW (Truy Vấn Thời Gian Thực)
            </span>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-extrabold">Virtual Query • Zero-Disk</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Không tốn thêm dung lượng lưu trữ. Tính toán động trực tiếp mỗi khi truy vấn (Ví dụ đếm ngược hạn dùng <code class="px-1 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">DATEDIFF(ExpiryDate, CURDATE()) &le; 30</code>).
          </p>
          <div class="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
            <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold">ExpiringProductsWarning</span>
          </div>
        </div>
      </div>

      <!-- Main Database Inspector Card -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        
        <!-- Object Switcher & Control Header -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center">
              <i class="fa-solid fa-database text-sky-500 mr-2.5 text-xl"></i>
              Trình Tra Cứu Dữ Liệu Bảng & View CSDL MySQL 8 (<span class="font-mono text-brand-600 dark:text-brand-400">hdd_appsheet</span>)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Xem trực tiếp toàn bộ dòng dữ liệu, thuộc tính cột, quy cách pha lóc và các công thức tự sinh (STORED GENERATED).
            </p>
          </div>

          <!-- Quick Actions (View DDL & Export) -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="showCurrentDdlModal()" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5">
              <i class="fa-solid fa-code text-sky-600"></i>
              <span>Xem DDL SQL</span>
            </button>
            <button onclick="copyDbJson()" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5">
              <i class="fa-regular fa-copy text-brand-600"></i>
              <span>Sao Chép JSON</span>
            </button>
            <button onclick="loadDatabaseOverview(true)" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-colors flex items-center space-x-1.5">
              <i class="fa-solid fa-arrows-rotate"></i>
              <span>Tải Lại CSDL</span>
            </button>
          </div>
        </div>

        <!-- Secondary Object Selector Pills -->
        <div class="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Chọn đối tượng:</span>
          
          <button onclick="switchDbTab('Products')" id="db-pill-Products" class="db-pill px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all bg-sky-600 text-white shadow-sm">
            <i class="fa-solid fa-table-cells"></i>
            <span>TABLE: Products</span>
            <span id="badge-count-Products" class="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">4</span>
          </button>

          <button onclick="switchDbTab('ProductBatches')" id="db-pill-ProductBatches" class="db-pill px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <i class="fa-solid fa-boxes-stacked"></i>
            <span>TABLE: ProductBatches</span>
            <span id="badge-count-ProductBatches" class="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">4</span>
          </button>

          <button onclick="switchDbTab('PriceHistory')" id="db-pill-PriceHistory" class="db-pill px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <i class="fa-solid fa-chart-line"></i>
            <span>TABLE: PriceHistory</span>
            <span id="badge-count-PriceHistory" class="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">5</span>
          </button>

          <button onclick="switchDbTab('InboundReceiptOCR')" id="db-pill-InboundReceiptOCR" class="db-pill px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <i class="fa-solid fa-file-invoice"></i>
            <span>TABLE: InboundReceiptOCR</span>
            <span id="badge-count-InboundReceiptOCR" class="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">1</span>
          </button>

          <button onclick="switchDbTab('ExpiringProductsWarning')" id="db-pill-ExpiringProductsWarning" class="db-pill px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60">
            <i class="fa-solid fa-eye"></i>
            <span>VIEW: ExpiringProductsWarning</span>
            <span id="badge-count-ExpiringProductsWarning" class="px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900 text-[10px]">3</span>
          </button>
        </div>

        <!-- Search Bar and Object Metadata Box -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2 text-xs">
            <span class="font-bold text-slate-800 dark:text-slate-200" id="db-meta-title">Bảng \`Products\`:</span>
            <span class="text-slate-500 dark:text-slate-400" id="db-meta-desc">Khóa chính: <code class="text-sky-600 dark:text-sky-400 font-bold">SKU</code> | Công thức: <code class="text-brand-600 dark:text-brand-400 font-bold">suggested_price = ROUND(cost_price * (1 + Margin%))</code></span>
          </div>
          <div class="relative w-full sm:w-72">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" id="db-search-input" oninput="filterDbData()" placeholder="Lọc theo SKU, tên món, nhà CC..." class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500">
          </div>
        </div>

        <!-- Dynamic Data Table Container -->
        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
          <div id="db-table-container" class="min-w-full">
            <!-- Dynamically populated via renderDbContent() -->
          </div>
        </div>

      </div>

    </div>
  </main>`;

if (html.includes('</main>')) {
  html = html.replace('</main>', tab5Markup);
  console.log('✅ Tab 5 markup inserted');
} else {
  console.error('❌ Could not find </main>');
}

// 3. Add DDL Modal before </body>
const ddlModalMarkup = `
  <!-- DDL SQL Modal -->
  <div id="ddl-modal" class="fixed inset-0 z-50 hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card w-full max-w-3xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center" id="ddl-modal-title">
          <i class="fa-solid fa-code text-sky-500 mr-2"></i>
          Định Nghĩa Cú Pháp SQL DDL (MySQL 8)
        </h3>
        <button onclick="closeDdlModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>
      <div class="overflow-y-auto flex-1">
        <pre id="ddl-modal-code" class="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed"></pre>
      </div>
      <div class="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
        <span class="text-xs text-slate-500">Nguồn: <code class="font-mono text-sky-500">migrations/001_hdd_food_schema.sql</code></span>
        <div class="space-x-2">
          <button onclick="copyDdlCode()" class="px-4 py-2 text-xs font-extrabold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow"><i class="fa-regular fa-copy mr-1"></i> Sao Chép SQL</button>
          <button onclick="closeDdlModal()" class="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">Đóng</button>
        </div>
      </div>
    </div>
  </div>
`;

if (html.includes('</body>')) {
  html = html.replace('</body>', ddlModalMarkup + '\n</body>');
  console.log('✅ DDL Modal inserted');
}

// 4. Add JavaScript for Tab 5 before </script>
const dbScript = `
    // Database Explorer State
    state.dbOverview = null;
    state.selectedDbTab = 'Products';
    state.dbSearchTerm = '';

    const DDL_DEFINITIONS = {
      Products: \`-- ==============================================================
-- BẢNG: Products (Danh mục sản phẩm & Giá vốn hiện hành)
-- Khóa chính: SKU (Tương thích 100% AppSheet)
-- Cột suggested_price: GENERATED ALWAYS AS (STORED)
-- ==============================================================
CREATE TABLE IF NOT EXISTS \\\`Products\\\` (
    \\\`SKU\\\` VARCHAR(100) NOT NULL COMMENT 'Mã hàng chuẩn SKU (AppSheet Key)',
    \\\`ProductName\\\` VARCHAR(255) NOT NULL COMMENT 'Tên thương phẩm chi tiết',
    \\\`Category\\\` VARCHAR(100) NOT NULL DEFAULT 'Thịt Bò Nhập Khẩu' COMMENT 'Phân loại ngành hàng',
    \\\`CuttingSpec\\\` VARCHAR(255) NULL COMMENT 'Quy cách pha lóc / cắt steak',
    \\\`Unit\\\` VARCHAR(50) NOT NULL DEFAULT 'Kg' COMMENT 'Đơn vị tính chuẩn',
    \\\`cost_price\\\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn nhập gần nhất',
    \\\`previous_cost_price\\\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn lần nhập trước đó',
    \\\`DesiredMarginPct\\\` DECIMAL(5, 2) NOT NULL DEFAULT 20.00 COMMENT 'Tỷ lệ lợi nhuận mong muốn (%)',
    \\\`suggested_price\\\` DECIMAL(15, 2) GENERATED ALWAYS AS (ROUND(\\\`cost_price\\\` * (1 + (\\\`DesiredMarginPct\\\` / 100)), 0)) STORED COMMENT 'Giá bán lẻ/sỉ đề xuất tính tự động',
    \\\`latest_supplier\\\` VARCHAR(255) NULL COMMENT 'Nhà cung cấp gần nhất',
    \\\`last_purchase_date\\\` DATE NULL COMMENT 'Ngày nhập hàng gần nhất',
    \\\`updated_at\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\\\`SKU\\\`),
    INDEX \\\`idx_products_category\\\` (\\\`Category\\\`),
    INDEX \\\`idx_products_updated_at\\\` (\\\`updated_at\\\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\`,

      ProductBatches: \`-- ==============================================================
-- BẢNG: ProductBatches (Quản lý lô hàng, tồn kho & hạn dùng)
-- Khóa ngoại: SKU references Products(SKU)
-- ==============================================================
CREATE TABLE IF NOT EXISTS \\\`ProductBatches\\\` (
    \\\`BatchID\\\` BIGINT AUTO_INCREMENT COMMENT 'Khóa chính kỹ thuật',
    \\\`BatchNumber\\\` VARCHAR(100) NOT NULL COMMENT 'Số lô sản xuất của nhà cung cấp',
    \\\`SKU\\\` VARCHAR(100) NOT NULL COMMENT 'Mã SKU liên kết',
    \\\`StockQuantity\\\` DECIMAL(12, 3) NOT NULL DEFAULT 0.000 COMMENT 'Số lượng tồn kho thực tế (Kg/Gói)',
    \\\`ManufactureDate\\\` DATE NULL COMMENT 'Ngày sản xuất / Đóng gói',
    \\\`ExpiryDate\\\` DATE NOT NULL COMMENT 'Hạn sử dụng tốt nhất (Best Before Date)',
    \\\`WarehouseLocation\\\` VARCHAR(100) NOT NULL DEFAULT 'Kho Lạnh Chính' COMMENT 'Vị trí lưu kho lạnh',
    \\\`Status\\\` ENUM('IN_STOCK', 'RESERVED', 'EXPIRED', 'DEPLETED') NOT NULL DEFAULT 'IN_STOCK',
    \\\`created_at\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \\\`updated_at\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\\\`BatchID\\\`),
    UNIQUE KEY \\\`uq_batch_sku_number\\\` (\\\`SKU\\\`, \\\`BatchNumber\\\`),
    INDEX \\\`idx_batches_expiry_stock\\\` (\\\`ExpiryDate\\\`, \\\`StockQuantity\\\`),
    CONSTRAINT \\\`fk_batches_sku\\\` FOREIGN KEY (\\\`SKU\\\`) REFERENCES \\\`Products\\\` (\\\`SKU\\\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\`,

      PriceHistory: \`-- ==============================================================
-- BẢNG: PriceHistory (Lịch sử biến động giá vốn theo thời gian)
-- ==============================================================
CREATE TABLE IF NOT EXISTS \\\`PriceHistory\\\` (
    \\\`HistoryID\\\` BIGINT AUTO_INCREMENT,
    \\\`SKU\\\` VARCHAR(100) NOT NULL,
    \\\`UnitPrice\\\` DECIMAL(15, 2) NOT NULL,
    \\\`SupplierName\\\` VARCHAR(255) NULL,
    \\\`ReceiptRef\\\` VARCHAR(100) NULL,
    \\\`EffectiveDate\\\` DATE NOT NULL,
    \\\`SourceType\\\` ENUM('OCR_INVOICE', 'ZALO_QUOTE', 'MANUAL_EXCEL') NOT NULL DEFAULT 'OCR_INVOICE',
    \\\`RecordedAt\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\\\`HistoryID\\\`),
    INDEX \\\`idx_price_history_sku_date\\\` (\\\`SKU\\\`, \\\`EffectiveDate\\\` DESC),
    CONSTRAINT \\\`fk_price_history_sku\\\` FOREIGN KEY (\\\`SKU\\\`) REFERENCES \\\`Products\\\` (\\\`SKU\\\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\`,

      InboundReceiptOCR: \`-- ==============================================================
-- BẢNG: InboundReceiptOCR (Nhật ký bóc tách chứng từ hóa đơn AI)
-- ==============================================================
CREATE TABLE IF NOT EXISTS \\\`InboundReceiptOCR\\\` (
    \\\`OCRID\\\` VARCHAR(100) NOT NULL,
    \\\`ReceiptID\\\` VARCHAR(100) NOT NULL,
    \\\`SKU\\\` VARCHAR(100) NULL,
    \\\`ProductName\\\` VARCHAR(255) NOT NULL,
    \\\`ReceivedQuantity\\\` DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    \\\`UnitPrice\\\` DECIMAL(15, 2) NOT NULL,
    \\\`RawExtractedText\\\` TEXT NULL,
    \\\`ConfidenceScore\\\` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    \\\`Status\\\` ENUM('PENDING_CONFIRMATION', 'COMMITTED', 'REJECTED') NOT NULL DEFAULT 'COMMITTED',
    \\\`CreatedAt\\\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (\\\`OCRID\\\`),
    INDEX \\\`idx_inbound_ocr_receipt\\\` (\\\`ReceiptID\\\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\`,

      ExpiringProductsWarning: \`-- ==============================================================
-- VIEW: ExpiringProductsWarning (Bảng ảo cảnh báo date <= 30 ngày)
-- Tính toán trực tiếp realtime mà không cần bảng phụ
-- ==============================================================
CREATE OR REPLACE VIEW \\\`ExpiringProductsWarning\\\` AS
SELECT 
    p.\\\`SKU\\\`,
    p.\\\`ProductName\\\`,
    b.\\\`BatchNumber\\\`,
    b.\\\`StockQuantity\\\`,
    b.\\\`ExpiryDate\\\`,
    DATEDIFF(b.\\\`ExpiryDate\\\`, CURDATE()) AS \\\`DaysRemaining\\\`,
    CASE 
        WHEN DATEDIFF(b.\\\`ExpiryDate\\\`, CURDATE()) < 0 THEN 'ĐÃ HẾT HẠN'
        WHEN DATEDIFF(b.\\\`ExpiryDate\\\`, CURDATE()) <= 7 THEN 'KHẨN CẤP (< 7 NGÀY)'
        WHEN DATEDIFF(b.\\\`ExpiryDate\\\`, CURDATE()) <= 15 THEN 'CẢNH BÁO CAO (< 15 NGÀY)'
        ELSE 'CẬN HẠN (< 30 NGÀY)'
    END AS \\\`WarningAlert\\\`
FROM \\\`ProductBatches\\\` b
JOIN \\\`Products\\\` p ON b.\\\`SKU\\\` = p.\\\`SKU\\\`
WHERE b.\\\`StockQuantity\\\` > 0 
  AND DATEDIFF(b.\\\`ExpiryDate\\\`, CURDATE()) <= 30
ORDER BY \\\`DaysRemaining\\\` ASC;\`
    };

    // Load Database Overview
    async function loadDatabaseOverview(isUserAction = false) {
      try {
        const res = await fetch('/api/database/overview').then(r => r.json()).catch(() => null);
        if (res && res.success) {
          state.dbOverview = res;
          updateDbBadgeCounts();
          renderDbContent();
          if (isUserAction) {
            showToast('Đã tải lại toàn bộ bảng & view CSDL thành công!', 'success');
          }
        } else {
          // Construct fallback overview from state.products & state.batches
          state.dbOverview = {
            connected: false,
            database: 'hdd_appsheet',
            tables: {
              Products: {
                name: 'Products',
                type: 'TABLE',
                description: 'Danh mục sản phẩm, quy cách cắt, giá vốn và biên lợi nhuận',
                columns: ['SKU', 'ProductName', 'Category', 'CuttingSpec', 'Unit', 'cost_price', 'previous_cost_price', 'DesiredMarginPct', 'suggested_price', 'latest_supplier', 'last_purchase_date'],
                primaryKey: 'SKU',
                rowCount: state.products.length,
                data: state.products
              },
              ProductBatches: {
                name: 'ProductBatches',
                type: 'TABLE',
                description: 'Quản lý từng lô hàng, số lượng tồn kho và hạn sử dụng',
                columns: ['BatchID', 'BatchNumber', 'SKU', 'StockQuantity', 'ManufactureDate', 'ExpiryDate', 'WarehouseLocation', 'Status'],
                primaryKey: 'BatchID',
                rowCount: state.batches.length,
                data: state.batches
              },
              PriceHistory: {
                name: 'PriceHistory',
                type: 'TABLE',
                description: 'Nhật ký lịch sử biến động giá nhập',
                columns: ['HistoryID', 'SKU', 'UnitPrice', 'SupplierName', 'ReceiptRef', 'EffectiveDate', 'SourceType', 'RecordedAt'],
                primaryKey: 'HistoryID',
                rowCount: 5,
                data: [
                  { HistoryID: 1, SKU: 'TP-BO-TENDER-MB2', UnitPrice: 820000, SupplierName: 'Midfield Meat Australia', ReceiptRef: 'INV-202609-088', EffectiveDate: '2026-09-15', SourceType: 'OCR_INVOICE' },
                  { HistoryID: 2, SKU: 'TP-BO-TENDER-MB2', UnitPrice: 850000, SupplierName: 'Midfield Meat Australia', ReceiptRef: 'INV-202610-104', EffectiveDate: '2026-10-20', SourceType: 'OCR_INVOICE' },
                  { HistoryID: 3, SKU: 'TP-BO-STRIP-MB3', UnitPrice: 600000, SupplierName: 'Stanbroke Australia', ReceiptRef: 'INV-202609-112', EffectiveDate: '2026-09-20', SourceType: 'OCR_INVOICE' },
                  { HistoryID: 4, SKU: 'TP-BO-STRIP-MB3', UnitPrice: 620000, SupplierName: 'Stanbroke Australia', ReceiptRef: 'INV-202610-155', EffectiveDate: '2026-10-22', SourceType: 'ZALO_QUOTE' },
                  { HistoryID: 5, SKU: 'TP-BO-BRISKET-CA', UnitPrice: 185000, SupplierName: 'Excel Canada Meat', ReceiptRef: 'INV-CAN-3312', EffectiveDate: '2026-10-25', SourceType: 'MANUAL_EXCEL' }
                ]
              },
              InboundReceiptOCR: {
                name: 'InboundReceiptOCR',
                type: 'TABLE',
                description: 'Nhật ký bóc tách dữ liệu chứng từ AI',
                columns: ['OCRID', 'ReceiptID', 'SKU', 'ProductName', 'ReceivedQuantity', 'UnitPrice', 'ConfidenceScore', 'Status', 'CreatedAt'],
                primaryKey: 'OCRID',
                rowCount: 1,
                data: [
                  { OCRID: 'OCR-8f12a9e0-d021-4d92-bb50', ReceiptID: 'REC-20261020-01', SKU: 'TP-BO-TENDER-MB2', ProductName: 'Thăn nội bò Úc Chilled MB2+', ReceivedQuantity: 25.5, UnitPrice: 850000, ConfidenceScore: 98.5, Status: 'COMMITTED', CreatedAt: '2026-10-20 09:10:00' }
                ]
              }
            },
            views: {
              ExpiringProductsWarning: {
                name: 'ExpiringProductsWarning',
                type: 'VIEW',
                description: 'View cảnh báo các lô hàng cận hạn (DaysRemaining <= 30)',
                columns: ['SKU', 'ProductName', 'BatchNumber', 'StockQuantity', 'ExpiryDate', 'DaysRemaining', 'WarningAlert'],
                rowCount: state.batches.length,
                data: state.batches
              }
            }
          };
          updateDbBadgeCounts();
          renderDbContent();
        }
      } catch (e) {
        console.warn('loadDatabaseOverview error:', e);
      }
    }

    function updateDbBadgeCounts() {
      if (!state.dbOverview) return;
      const t = state.dbOverview.tables || {};
      const v = state.dbOverview.views || {};
      
      const elP = document.getElementById('badge-count-Products');
      if (elP && t.Products) elP.innerText = t.Products.rowCount;

      const elB = document.getElementById('badge-count-ProductBatches');
      if (elB && t.ProductBatches) elB.innerText = t.ProductBatches.rowCount;

      const elH = document.getElementById('badge-count-PriceHistory');
      if (elH && t.PriceHistory) elH.innerText = t.PriceHistory.rowCount;

      const elO = document.getElementById('badge-count-InboundReceiptOCR');
      if (elO && t.InboundReceiptOCR) elO.innerText = t.InboundReceiptOCR.rowCount;

      const elV = document.getElementById('badge-count-ExpiringProductsWarning');
      if (elV && v.ExpiringProductsWarning) elV.innerText = v.ExpiringProductsWarning.rowCount;
    }

    function switchDbTab(name) {
      state.selectedDbTab = name;
      document.querySelectorAll('.db-pill').forEach(btn => {
        btn.classList.remove('bg-sky-600', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      const activeBtn = document.getElementById('db-pill-' + name);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
        activeBtn.classList.add('bg-sky-600', 'text-white', 'shadow-sm');
      }
      renderDbContent();
    }

    function filterDbData() {
      const input = document.getElementById('db-search-input');
      state.dbSearchTerm = input ? input.value.trim().toLowerCase() : '';
      renderDbContent();
    }

    function renderDbContent() {
      const container = document.getElementById('db-table-container');
      const titleEl = document.getElementById('db-meta-title');
      const descEl = document.getElementById('db-meta-desc');
      if (!container || !state.dbOverview) return;

      const activeName = state.selectedDbTab;
      let obj = (state.dbOverview.tables && state.dbOverview.tables[activeName]) || 
                (state.dbOverview.views && state.dbOverview.views[activeName]);

      if (!obj) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Không tìm thấy dữ liệu đối tượng này</div>';
        return;
      }

      if (titleEl) {
        titleEl.innerHTML = \`<span class="px-2 py-0.5 rounded text-[10px] font-mono font-black \${obj.type === 'VIEW' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'} mr-1.5">\${obj.type}</span> \${obj.name}:\`;
      }
      if (descEl) {
        descEl.innerText = obj.description;
      }

      // Filter rows
      let rows = [...(obj.data || [])];
      if (state.dbSearchTerm) {
        const q = state.dbSearchTerm;
        rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q));
      }

      if (activeName === 'Products') {
        renderDbProductsTable(rows, container);
      } else if (activeName === 'ProductBatches') {
        renderDbBatchesTable(rows, container);
      } else if (activeName === 'PriceHistory') {
        renderDbHistoryTable(rows, container);
      } else if (activeName === 'InboundReceiptOCR') {
        renderDbOcrTable(rows, container);
      } else if (activeName === 'ExpiringProductsWarning') {
        renderDbViewTable(rows, container);
      }
    }

    function renderDbProductsTable(rows, container) {
      if (rows.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Không có dòng dữ liệu nào khớp với từ khóa tìm kiếm.</div>';
        return;
      }

      let html = \`
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800/80 uppercase font-black text-slate-600 dark:text-slate-400 tracking-wider">
            <tr>
              <th class="py-3 px-3.5 rounded-l-lg">Mã SKU (PK)</th>
              <th class="py-3 px-3.5">Tên Sản Phẩm (ProductName)</th>
              <th class="py-3 px-3">Ngành Hàng</th>
              <th class="py-3 px-3">Quy Cách Cắt</th>
              <th class="py-3 px-2 text-center">ĐVT</th>
              <th class="py-3 px-3 text-right">Giá Vốn Cũ</th>
              <th class="py-3 px-3.5 text-right text-brand-700 dark:text-brand-300">Giá Vốn Mới (cost_price)</th>
              <th class="py-3 px-2.5 text-center font-black">% Margin</th>
              <th class="py-3 px-3.5 text-right font-black text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30">Giá Đề Xuất (suggested)</th>
              <th class="py-3 px-3">Nhà Cung Cấp</th>
              <th class="py-3 px-3 text-center rounded-r-lg">Ngày Nhập</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
      \`;

      rows.forEach(p => {
        const cost = parseFloat(p.cost_price) || 0;
        const prev = parseFloat(p.previous_cost_price) || 0;
        const margin = parseFloat(p.DesiredMarginPct) || 20;
        const suggested = p.suggested_price || Math.round(cost * (1 + margin / 100));

        html += \`
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white">
              <span class="px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[11px] font-black">\${p.SKU}</span>
            </td>
            <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              \${p.ProductName}
            </td>
            <td class="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">\${p.Category || 'Thịt Bò Nhập Khẩu'}</td>
            <td class="py-3 px-3 text-slate-600 dark:text-slate-300 text-xs font-mono">\${p.CuttingSpec || 'Tiêu chuẩn'}</td>
            <td class="py-3 px-2 text-center font-bold text-slate-700 dark:text-slate-300">\${p.Unit || 'Kg'}</td>
            <td class="py-3 px-3 text-right font-mono text-slate-500 line-through">\${prev > 0 ? prev.toLocaleString('vi-VN') + ' đ' : '-'}</td>
            <td class="py-3 px-3.5 text-right font-mono font-black text-slate-900 dark:text-white text-sm">\${cost.toLocaleString('vi-VN')} đ</td>
            <td class="py-3 px-2.5 text-center font-mono font-extrabold text-emerald-600 dark:text-emerald-400">\${margin}%</td>
            <td class="py-3 px-3.5 text-right font-mono font-black text-sky-700 dark:text-sky-300 text-sm bg-sky-50/40 dark:bg-sky-950/20">
              \${suggested.toLocaleString('vi-VN')} đ
              <span class="block text-[10px] text-slate-400 font-normal">STORED GENERATED</span>
            </td>
            <td class="py-3 px-3 text-slate-600 dark:text-slate-300 text-xs font-semibold">\${p.latest_supplier || 'N/A'}</td>
            <td class="py-3 px-3 text-center font-mono text-slate-500 text-[11px]">\${p.last_purchase_date || '2026-10-28'}</td>
          </tr>
        \`;
      });

      html += '</tbody></table>';
      container.innerHTML = html;
    }

    function renderDbBatchesTable(rows, container) {
      if (rows.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Không có dòng dữ liệu nào</div>';
        return;
      }
      let html = \`
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800/80 uppercase font-black text-slate-600 dark:text-slate-400 tracking-wider">
            <tr>
              <th class="py-3 px-3.5 rounded-l-lg">BatchID (PK)</th>
              <th class="py-3 px-3.5">Mã Lô (BatchNumber)</th>
              <th class="py-3 px-3.5">Mã SKU</th>
              <th class="py-3 px-3 text-right">Tồn Kho (Kg)</th>
              <th class="py-3 px-3 text-center">Hạn Sử Dụng (EXP)</th>
              <th class="py-3 px-3.5">Vị Trí Kho Lạnh</th>
              <th class="py-3 px-3 text-center rounded-r-lg">Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
      \`;
      rows.forEach(b => {
        html += \`
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-3.5 font-mono text-slate-500">#\${b.BatchID || 1}</td>
            <td class="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white">\${b.BatchNumber}</td>
            <td class="py-3 px-3.5 font-mono text-sky-600 dark:text-sky-400 font-bold">\${b.SKU}</td>
            <td class="py-3 px-3 text-right font-mono font-black text-slate-900 dark:text-white text-sm">\${parseFloat(b.StockQuantity).toFixed(1)} Kg</td>
            <td class="py-3 px-3 text-center font-mono font-bold text-amber-600 dark:text-amber-400">\${b.ExpiryDate}</td>
            <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300">\${b.WarehouseLocation || 'Kho Lạnh Chính'}</td>
            <td class="py-3 px-3 text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black">\${b.Status || 'IN_STOCK'}</span></td>
          </tr>
        \`;
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }

    function renderDbHistoryTable(rows, container) {
      if (rows.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Chưa có lịch sử giá nào</div>';
        return;
      }
      let html = \`
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800/80 uppercase font-black text-slate-600 dark:text-slate-400 tracking-wider">
            <tr>
              <th class="py-3 px-3.5 rounded-l-lg">ID</th>
              <th class="py-3 px-3.5">Mã SKU</th>
              <th class="py-3 px-3.5 text-right">Đơn Giá Nhập (UnitPrice)</th>
              <th class="py-3 px-3.5">Nhà Cung Cấp</th>
              <th class="py-3 px-3.5 font-mono">Mã Hóa Đơn</th>
              <th class="py-3 px-3 text-center">Nguồn Thu Thập</th>
              <th class="py-3 px-3 text-center rounded-r-lg">Ngày Áp Dụng</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
      \`;
      rows.forEach(h => {
        html += \`
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-3.5 font-mono text-slate-500">#\${h.HistoryID}</td>
            <td class="py-3 px-3.5 font-mono text-sky-600 dark:text-sky-400 font-bold">\${h.SKU}</td>
            <td class="py-3 px-3.5 text-right font-mono font-black text-slate-900 dark:text-white">\${(parseFloat(h.UnitPrice)||0).toLocaleString('vi-VN')} đ</td>
            <td class="py-3 px-3.5 text-slate-700 dark:text-slate-200 font-semibold">\${h.SupplierName || 'N/A'}</td>
            <td class="py-3 px-3.5 font-mono text-slate-500 text-[11px]">\${h.ReceiptRef || '-'}</td>
            <td class="py-3 px-3 text-center"><span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold">\${h.SourceType}</span></td>
            <td class="py-3 px-3 text-center font-mono text-slate-500">\${h.EffectiveDate || h.RecordedAt}</td>
          </tr>
        \`;
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }

    function renderDbOcrTable(rows, container) {
      if (rows.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Chưa có nhật ký OCR nào</div>';
        return;
      }
      let html = \`
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800/80 uppercase font-black text-slate-600 dark:text-slate-400 tracking-wider">
            <tr>
              <th class="py-3 px-3.5 rounded-l-lg">Mã OCR</th>
              <th class="py-3 px-3.5">Mã Phiếu</th>
              <th class="py-3 px-3.5">SKU Ánh Xạ</th>
              <th class="py-3 px-3.5">Tên Bóc Tách Được</th>
              <th class="py-3 px-3 text-right">Số Lượng</th>
              <th class="py-3 px-3 text-right">Đơn Giá</th>
              <th class="py-3 px-3 text-center">Độ Tin Cậy AI</th>
              <th class="py-3 px-3 text-center rounded-r-lg">Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
      \`;
      rows.forEach(o => {
        html += \`
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-3.5 font-mono text-[10px] text-slate-500">\${(o.OCRID||'').substring(0, 16)}...</td>
            <td class="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white">\${o.ReceiptID}</td>
            <td class="py-3 px-3.5 font-mono text-sky-600 dark:text-sky-400 font-bold">\${o.SKU || 'N/A'}</td>
            <td class="py-3 px-3.5 text-slate-800 dark:text-slate-200">\${o.ProductName}</td>
            <td class="py-3 px-3 text-right font-mono font-bold">\${parseFloat(o.ReceivedQuantity||0).toFixed(1)} Kg</td>
            <td class="py-3 px-3 text-right font-mono font-bold">\${(parseFloat(o.UnitPrice)||0).toLocaleString('vi-VN')} đ</td>
            <td class="py-3 px-3 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">\${o.ConfidenceScore || 98.5}%</td>
            <td class="py-3 px-3 text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black">\${o.Status}</span></td>
          </tr>
        \`;
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }

    function renderDbViewTable(rows, container) {
      if (rows.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Hiện tại không có lô hàng nào cận date &le; 30 ngày.</div>';
        return;
      }
      let html = \`
        <table class="w-full text-left text-xs">
          <thead class="bg-amber-50 dark:bg-amber-950/60 uppercase font-black text-amber-800 dark:text-amber-300 tracking-wider">
            <tr>
              <th class="py-3 px-3.5 rounded-l-lg">Mã SKU</th>
              <th class="py-3 px-3.5">Tên Sản Phẩm</th>
              <th class="py-3 px-3.5 font-mono">Lô Hàng</th>
              <th class="py-3 px-3 text-right">Tồn Kho</th>
              <th class="py-3 px-3 text-center">Hạn Sử Dụng (EXP)</th>
              <th class="py-3 px-3 text-center font-black">Ngày Còn Lại (DATEDIFF)</th>
              <th class="py-3 px-3.5 text-center rounded-r-lg">Mức Độ Cảnh Báo (CASE WHEN)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
      \`;
      rows.forEach(v => {
        let badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        if (v.DaysRemaining > 7 && v.DaysRemaining <= 15) {
          badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
        } else if (v.DaysRemaining > 15) {
          badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        }
        html += \`
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-3.5 font-mono text-sky-600 dark:text-sky-400 font-bold">\${v.SKU}</td>
            <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white">\${v.ProductName}</td>
            <td class="py-3 px-3.5 font-mono">\${v.BatchNumber}</td>
            <td class="py-3 px-3 text-right font-mono font-black">\${parseFloat(v.StockQuantity).toFixed(1)} Kg</td>
            <td class="py-3 px-3 text-center font-mono">\${v.ExpiryDate}</td>
            <td class="py-3 px-3 text-center font-mono font-black text-rose-600 dark:text-rose-400 text-sm">\${v.DaysRemaining} ngày</td>
            <td class="py-3 px-3.5 text-center"><span class="px-2.5 py-1 rounded-full \${badgeColor} text-[10px] font-black">\${v.WarningAlert}</span></td>
          </tr>
        \`;
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }

    function showCurrentDdlModal() {
      const activeName = state.selectedDbTab;
      const modal = document.getElementById('ddl-modal');
      const title = document.getElementById('ddl-modal-title');
      const code = document.getElementById('ddl-modal-code');
      if (!modal || !code) return;

      const isView = activeName === 'ExpiringProductsWarning';
      title.innerHTML = \`<i class="fa-solid fa-code text-sky-500 mr-2"></i> Định Nghĩa SQL DDL: \${isView ? 'VIEW' : 'TABLE'} \\\`\${activeName}\\\`\`;
      code.innerText = DDL_DEFINITIONS[activeName] || '-- Chưa có mã DDL';
      modal.classList.remove('hidden');
    }

    function closeDdlModal() {
      const modal = document.getElementById('ddl-modal');
      if (modal) modal.classList.add('hidden');
    }

    function copyDdlCode() {
      const code = document.getElementById('ddl-modal-code');
      if (code && code.innerText) {
        navigator.clipboard.writeText(code.innerText).then(() => {
          showToast('Đã sao chép mã SQL DDL vào bộ nhớ tạm!', 'success');
        });
      }
    }

    function copyDbJson() {
      if (!state.dbOverview) return;
      const activeName = state.selectedDbTab;
      let obj = (state.dbOverview.tables && state.dbOverview.tables[activeName]) || 
                (state.dbOverview.views && state.dbOverview.views[activeName]);
      if (obj && obj.data) {
        navigator.clipboard.writeText(JSON.stringify(obj.data, null, 2)).then(() => {
          showToast(\`Đã sao chép dữ liệu JSON của \${activeName}!\`, 'success');
        });
      }
    }
`;

// Insert dbScript and loadDatabaseOverview call into loadAllData
if (html.includes('loadAllData();')) {
  // insert loadDatabaseOverview inside loadAllData
  html = html.replace('renderSalesTable();', 'renderSalesTable();\n        loadDatabaseOverview();');
}

if (html.includes('</script>')) {
  html = html.replace('</script>', dbScript + '\n  </script>');
  console.log('✅ Tab 5 JS script inserted');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('🎉 Successfully patched index.html with Tab 5 Database Explorer!');
