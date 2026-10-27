-- =============================================================================
-- MIGRATION: 001_hdd_food_schema.sql
-- PROJECT: HDD Food Pricing & Expiration Management System
-- TARGET PLATFORM: MySQL 8.0+ / AppSheet Direct Sync
-- ARCHITECT: AI-DATA (Conversation ID: f1c79e12-370f-4378-a5da-f18731d4b014)
-- DATE: 2026-10-27
-- DESCRIPTION:
--   Thiết kế CSDL quan hệ chuẩn 3NF cho phân hệ Định giá thực phẩm & Cảnh báo date.
--   Bao gồm:
--     1. Bảng `Products` (Danh mục SKU, Giá vốn, Lợi nhuận mong muốn, Giá đề xuất STORED)
--     2. Bảng `ProductBatches` (Quản lý lô hàng, tồn kho và hạn sử dụng)
--     3. Bảng `PriceHistory` (Nhật ký lịch sử biến động giá vốn theo thời gian)
--     4. Bảng `InboundReceiptOCR` (Nhật ký bóc tách OCR từ hóa đơn/Zalo/Excel)
--     5. View `ExpiringProductsWarning` (Cảnh báo các lô hàng cận date <= 30 ngày)
--     6. Dữ liệu mẫu (Seed Data) chuẩn thịt bò nhập khẩu
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- -----------------------------------------------------------------------------
-- 1. BẢNG: Products (Danh mục sản phẩm & Giá vốn hiện hành)
-- Tương thích hoàn toàn với AppSheet (sử dụng SKU làm Key chính)
-- Cột `suggested_price` được tính tự động bằng Generated Column (STORED)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Products` (
    `SKU` VARCHAR(100) NOT NULL COMMENT 'Mã hàng chuẩn SKU (AppSheet Key)',
    `ProductName` VARCHAR(255) NOT NULL COMMENT 'Tên thương phẩm chi tiết',
    `Category` VARCHAR(100) NOT NULL DEFAULT 'Thịt Bò Nhập Khẩu' COMMENT 'Phân loại ngành hàng',
    `CuttingSpec` VARCHAR(255) NULL COMMENT 'Quy cách pha lóc / cắt steak',
    `Unit` VARCHAR(50) NOT NULL DEFAULT 'Kg' COMMENT 'Đơn vị tính chuẩn',
    `cost_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn nhập gần nhất',
    `previous_cost_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Giá vốn lần nhập trước đó',
    `DesiredMarginPct` DECIMAL(5, 2) NOT NULL DEFAULT 20.00 COMMENT 'Tỷ lệ lợi nhuận mong muốn (%)',
    `suggested_price` DECIMAL(15, 2) GENERATED ALWAYS AS (ROUND(`cost_price` * (1 + (`DesiredMarginPct` / 100)), 0)) STORED COMMENT 'Giá bán lẻ/sỉ đề xuất tính tự động',
    `latest_supplier` VARCHAR(255) NULL COMMENT 'Nhà cung cấp gần nhất',
    `last_purchase_date` DATE NULL COMMENT 'Ngày nhập hàng gần nhất',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật cuối',
    PRIMARY KEY (`SKU`),
    INDEX `idx_products_category` (`Category`),
    INDEX `idx_products_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm và bảng giá vốn hiện hành';

-- -----------------------------------------------------------------------------
-- 2. BẢNG: ProductBatches (Quản lý lô hàng, số lượng tồn kho & hạn sử dụng)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ProductBatches` (
    `BatchID` BIGINT AUTO_INCREMENT COMMENT 'Khóa chính kỹ thuật',
    `BatchNumber` VARCHAR(100) NOT NULL COMMENT 'Số lô sản xuất của nhà cung cấp',
    `SKU` VARCHAR(100) NOT NULL COMMENT 'Mã SKU liên kết',
    `StockQuantity` DECIMAL(12, 3) NOT NULL DEFAULT 0.000 COMMENT 'Số lượng tồn kho thực tế (Kg/Gói)',
    `ManufactureDate` DATE NULL COMMENT 'Ngày sản xuất / Đóng gói',
    `ExpiryDate` DATE NOT NULL COMMENT 'Hạn sử dụng tốt nhất (Best Before Date)',
    `WarehouseLocation` VARCHAR(100) NOT NULL DEFAULT 'Kho Lạnh Chính' COMMENT 'Vị trí lưu kho lạnh',
    `Status` ENUM('IN_STOCK', 'RESERVED', 'EXPIRED', 'DEPLETED') NOT NULL DEFAULT 'IN_STOCK' COMMENT 'Trạng thái lô hàng',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`BatchID`),
    UNIQUE KEY `uq_batch_sku_number` (`SKU`, `BatchNumber`),
    INDEX `idx_batches_expiry_stock` (`ExpiryDate`, `StockQuantity`),
    INDEX `idx_batches_sku` (`SKU`),
    CONSTRAINT `fk_batches_sku` FOREIGN KEY (`SKU`) REFERENCES `Products` (`SKU`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý lô hàng chi tiết và Date thực phẩm';

-- -----------------------------------------------------------------------------
-- 3. BẢNG: PriceHistory (Lịch sử biến động giá vốn theo thời gian)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `PriceHistory` (
    `HistoryID` BIGINT AUTO_INCREMENT COMMENT 'Khóa chính kỹ thuật',
    `SKU` VARCHAR(100) NOT NULL COMMENT 'Mã SKU liên kết',
    `UnitPrice` DECIMAL(15, 2) NOT NULL COMMENT 'Đơn giá nhập ghi nhận',
    `SupplierName` VARCHAR(255) NULL COMMENT 'Tên nhà cung cấp báo giá/giao hàng',
    `ReceiptRef` VARCHAR(100) NULL COMMENT 'Mã số hóa đơn / phiếu nhập kho',
    `EffectiveDate` DATE NOT NULL COMMENT 'Ngày áp dụng mức giá này',
    `SourceType` ENUM('OCR_INVOICE', 'ZALO_QUOTE', 'MANUAL_EXCEL') NOT NULL DEFAULT 'OCR_INVOICE' COMMENT 'Nguồn thu thập giá',
    `RecordedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi nhận vào hệ thống',
    PRIMARY KEY (`HistoryID`),
    INDEX `idx_price_history_sku_date` (`SKU`, `EffectiveDate` DESC),
    INDEX `idx_price_history_recorded` (`RecordedAt` DESC),
    CONSTRAINT `fk_price_history_sku` FOREIGN KEY (`SKU`) REFERENCES `Products` (`SKU`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký lịch sử biến động giá nhập';

-- -----------------------------------------------------------------------------
-- 4. BẢNG: InboundReceiptOCR (Nhật ký bóc tách dữ liệu hóa đơn/chứng từ bằng AI)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `InboundReceiptOCR` (
    `OCRID` VARCHAR(100) NOT NULL COMMENT 'Khóa chính UUID',
    `ReceiptID` VARCHAR(100) NOT NULL COMMENT 'Mã lô / phiếu nhập kho đối soát',
    `SKU` VARCHAR(100) NULL COMMENT 'Mã SKU được ánh xạ tự động hoặc thủ công',
    `ProductName` VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm gốc bóc tách từ ảnh/văn bản',
    `ReceivedQuantity` DECIMAL(12, 3) NOT NULL DEFAULT 0.000 COMMENT 'Số lượng trên chứng từ',
    `UnitPrice` DECIMAL(15, 2) NOT NULL COMMENT 'Đơn giá bóc tách được',
    `RawExtractedText` TEXT NULL COMMENT 'Đoạn văn bản thô bóc tách từ OCR',
    `ConfidenceScore` DECIMAL(5, 2) NOT NULL DEFAULT 100.00 COMMENT 'Độ tin cậy OCR / AI Confidence (%)',
    `Status` ENUM('PENDING_CONFIRMATION', 'COMMITTED', 'REJECTED') NOT NULL DEFAULT 'COMMITTED' COMMENT 'Trạng thái duyệt',
    `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm bóc tách',
    PRIMARY KEY (`OCRID`),
    INDEX `idx_inbound_ocr_receipt` (`ReceiptID`),
    INDEX `idx_inbound_ocr_status` (`Status`),
    INDEX `idx_inbound_ocr_created` (`CreatedAt` DESC),
    CONSTRAINT `fk_inbound_ocr_sku` FOREIGN KEY (`SKU`) REFERENCES `Products` (`SKU`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký bóc tách chứng từ hóa đơn AI';

-- -----------------------------------------------------------------------------
-- 5. VIEW: ExpiringProductsWarning (Cảnh báo hàng cận hạn sử dụng <= 30 ngày)
-- AppSheet và Web App có thể truy vấn trực tiếp view này để hiển thị dashboard
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW `ExpiringProductsWarning` AS
SELECT 
    p.`SKU`,
    p.`ProductName`,
    b.`BatchNumber`,
    b.`StockQuantity`,
    b.`ExpiryDate`,
    DATEDIFF(b.`ExpiryDate`, CURDATE()) AS `DaysRemaining`,
    CASE 
        WHEN DATEDIFF(b.`ExpiryDate`, CURDATE()) < 0 THEN 'ĐÃ HẾT HẠN'
        WHEN DATEDIFF(b.`ExpiryDate`, CURDATE()) <= 7 THEN 'KHẨN CẤP (< 7 NGÀY)'
        WHEN DATEDIFF(b.`ExpiryDate`, CURDATE()) <= 15 THEN 'CẢNH BÁO CAO (< 15 NGÀY)'
        ELSE 'CẬN HẠN (< 30 NGÀY)'
    END AS `WarningAlert`
FROM `ProductBatches` b
JOIN `Products` p ON b.`SKU` = p.`SKU`
WHERE b.`StockQuantity` > 0 
  AND DATEDIFF(b.`ExpiryDate`, CURDATE()) <= 30
ORDER BY `DaysRemaining` ASC;

-- -----------------------------------------------------------------------------
-- 6. DỮ LIỆU KHỞI TẠO (SEED DATA)
-- Danh mục thịt bò nhập khẩu cao cấp thực tế cho HDD Food
-- -----------------------------------------------------------------------------
INSERT INTO `Products` (`SKU`, `ProductName`, `Category`, `CuttingSpec`, `Unit`, `cost_price`, `previous_cost_price`, `DesiredMarginPct`, `latest_supplier`, `last_purchase_date`)
VALUES
('TP-BO-TENDER-MB2', 'Chilled Tenderloin Angus MB2+', 'Thịt Bò Nhập Khẩu', 'Cắt Steak 200g - 250g', 'Kg', 850000.00, 820000.00, 25.00, 'Midfield Meat Australia', '2026-10-20'),
('TP-BO-STRIP-MB3', 'Chilled Striploin Angus MB3+', 'Thịt Bò Nhập Khẩu', 'Cắt Steak 250g', 'Kg', 620000.00, 600000.00, 22.00, 'Stanbroke Australia', '2026-10-22'),
('TP-BO-RIBEYE-MB2', 'Chilled Ribeye Angus MB2+', 'Thịt Bò Nhập Khẩu', 'Cắt Steak 300g dày 2cm', 'Kg', 720000.00, 710000.00, 25.00, 'Teys Australia', '2026-10-24'),
('TP-BO-BRISKET-CA', 'Ba rọi bò Canada (Short Plate)', 'Thịt Bò Nhập Khẩu', 'Bào cuộn lẩu / nướng 1.5mm', 'Kg', 185000.00, 180000.00, 20.00, 'Excel Canada Meat', '2026-10-25')
ON DUPLICATE KEY UPDATE 
    `cost_price` = VALUES(`cost_price`),
    `previous_cost_price` = VALUES(`previous_cost_price`),
    `updated_at` = CURRENT_TIMESTAMP;

-- Lô hàng mẫu (Bao gồm các lô cận hạn để kiểm thử View ExpiringProductsWarning)
INSERT INTO `ProductBatches` (`BatchNumber`, `SKU`, `StockQuantity`, `ManufactureDate`, `ExpiryDate`, `WarehouseLocation`, `Status`)
VALUES
('BATCH-202610-01', 'TP-BO-TENDER-MB2', 25.500, '2026-09-15', DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'Kho Lạnh Âm 2 - 4C', 'IN_STOCK'),
('BATCH-202610-02', 'TP-BO-STRIP-MB3', 42.000, '2026-09-20', DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'Kho Lạnh Âm 2 - 4C', 'IN_STOCK'),
('BATCH-202610-03', 'TP-BO-RIBEYE-MB2', 18.250, '2026-10-01', DATE_ADD(CURDATE(), INTERVAL 28 DAY), 'Kho Lạnh Âm 2 - 4C', 'IN_STOCK'),
('BATCH-202610-04', 'TP-BO-BRISKET-CA', 120.000, '2026-10-10', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'Kho Đông -18C', 'IN_STOCK')
ON DUPLICATE KEY UPDATE 
    `StockQuantity` = VALUES(`StockQuantity`),
    `ExpiryDate` = VALUES(`ExpiryDate`);

-- Lịch sử biến động giá mẫu
INSERT INTO `PriceHistory` (`SKU`, `UnitPrice`, `SupplierName`, `ReceiptRef`, `EffectiveDate`, `SourceType`)
VALUES
('TP-BO-TENDER-MB2', 820000.00, 'Midfield Meat Australia', 'INV-202609-088', '2026-09-15', 'OCR_INVOICE'),
('TP-BO-TENDER-MB2', 850000.00, 'Midfield Meat Australia', 'INV-202610-104', '2026-10-20', 'OCR_INVOICE'),
('TP-BO-STRIP-MB3', 600000.00, 'Stanbroke Australia', 'INV-202609-112', '2026-09-20', 'OCR_INVOICE'),
('TP-BO-STRIP-MB3', 620000.00, 'Stanbroke Australia', 'INV-202610-155', '2026-10-22', 'ZALO_QUOTE');

-- Nhật ký bóc tách OCR mẫu
INSERT INTO `InboundReceiptOCR` (`OCRID`, `ReceiptID`, `SKU`, `ProductName`, `ReceivedQuantity`, `UnitPrice`, `RawExtractedText`, `ConfidenceScore`, `Status`)
VALUES
('OCR-8f12a9e0-d021-4d92-bb50-4824e4d58011', 'REC-20261020-01', 'TP-BO-TENDER-MB2', 'Thăn nội bò Úc Tenderloin Chilled MB2+', 25.500, 850000.00, 'Thăn nội bò Úc Chilled MB2+ - Slg: 25.5kg - Đơn giá: 850.000đ/kg', 98.50, 'COMMITTED');

SET FOREIGN_KEY_CHECKS = 1;
