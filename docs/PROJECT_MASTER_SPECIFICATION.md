# ĐẶC TẢ NGHIỆP VỤ & KIẾN TRÚC HỆ THỐNG HDD FOOD (UASOF V3.2)
**Dự án:** HDD Food Pricing & Expiration Management System (Web App Mini & AppSheet Sync)  
**Tài liệu:** Project Master Specification  
**Phiên bản:** 1.0.0  
**Tác giả:** AI-LEAD&BA (Conversation ID: `4587490e-2f01-46f3-acdf-ab63d408bd1d`)  
**Project Owner:** SevZia  

---

## 1. TỔNG QUAN DỰ ÁN
- **Lĩnh vực hoạt động:** Kinh doanh thực phẩm, phân phối thịt bò nhập khẩu cao cấp (Chilled Tenderloin Angus, Striploin, Ribeye Angus, Ba rọi bò Canada...).
- **Hệ thống hiện hữu:**
  - Database: MySQL 8 (`hdd_appsheet`), máy chủ `31.220.60.199:3306`, user `hdd_user`.
  - Frontend nghiệp vụ chính: **AppSheet** (kết nối trực tiếp với MySQL).
  - API Gateway / Edge Worker: **Cloudflare Worker** (`https://hdd-pricing-worker.huy-kv.workers.dev`).
- **Mục tiêu hệ thống mới:**
  - Xây dựng một Web App mini nội bộ gọn nhẹ, chạy trực tiếp trên máy hoặc web, phục vụ đồng thời 2 nhóm đối tượng:
    1. **Kế toán / Mua hàng:** Nhận và bóc tách tự động dữ liệu từ hóa đơn, phiếu giao hàng, bảng báo giá (ảnh, Excel, text Zalo), đối soát giá cũ và cập nhật giá vốn mới vào MySQL.
    2. **Kinh doanh:** Tra cứu giá vốn mới nhất theo thời gian thực (kèm giá bán đề xuất tính theo % Desired Margin), nhận cảnh báo danh sách sản phẩm cận hạn sử dụng (< 30 ngày) để ưu tiên xả hàng.

---

## 2. KIẾN TRÚC DỮ LIỆU MYSQL (`hdd_appsheet`)

### 2.1. Bảng `Products` (Danh mục sản phẩm & Giá vốn hiện hành)
- `SKU` VARCHAR(100) PRIMARY KEY: Mã hàng chuẩn (ví dụ: `TP-BO-TENDER-MB2`).
- `ProductName` VARCHAR(255) NOT NULL: Tên thương phẩm (ví dụ: `Chilled Tenderloin Angus MB2+`).
- `Category` VARCHAR(100) DEFAULT 'Thịt Bò Nhập Khẩu'.
- `CuttingSpec` VARCHAR(255): Quy cách pha lóc / cắt steak.
- `Unit` VARCHAR(50) DEFAULT 'Kg': Đơn vị tính.
- `cost_price` DECIMAL(15, 2) DEFAULT 0.00: Giá vốn nhập gần nhất.
- `previous_cost_price` DECIMAL(15, 2) DEFAULT 0.00: Giá vốn lần nhập trước đó.
- `DesiredMarginPct` DECIMAL(5, 2) DEFAULT 20.00: Tỷ lệ lợi nhuận mong muốn (%).
- `suggested_price` DECIMAL(15, 2) GENERATED ALWAYS AS (ROUND(cost_price * (1 + DesiredMarginPct / 100), 0)) STORED: Giá bán đề xuất cho Kinh Doanh.
- `latest_supplier` VARCHAR(255): Nhà cung cấp gần nhất.
- `last_purchase_date` DATE: Ngày nhập gần nhất.
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP.

### 2.2. Bảng `PriceHistory` (Lịch sử biến động giá)
- `HistoryID` BIGINT AUTO_INCREMENT PRIMARY KEY.
- `SKU` VARCHAR(100) NOT NULL, FOREIGN KEY REFERENCES `Products(SKU)`.
- `UnitPrice` DECIMAL(15, 2) NOT NULL: Đơn giá nhập ghi nhận.
- `SupplierName` VARCHAR(255): Tên nhà cung cấp.
- `ReceiptRef` VARCHAR(100): Mã số hóa đơn / phiếu nhập.
- `EffectiveDate` DATE NOT NULL: Ngày áp dụng giá.
- `SourceType` ENUM('OCR_INVOICE', 'ZALO_QUOTE', 'MANUAL_EXCEL') DEFAULT 'OCR_INVOICE'.
- `RecordedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP.

### 2.3. Bảng `InboundReceiptOCR` (Nhật ký bóc tách dữ liệu)
- `OCRID` VARCHAR(100) PRIMARY KEY (UUID).
- `ReceiptID` VARCHAR(100) NOT NULL: Mã lô / phiếu nhập.
- `SKU` VARCHAR(100): Mã SKU được map.
- `ProductName` VARCHAR(255) NOT NULL: Tên sản phẩm trên hóa đơn gốc.
- `ReceivedQuantity` DECIMAL(12, 3) DEFAULT 0.000: Số lượng thực nhận.
- `UnitPrice` DECIMAL(15, 2) NOT NULL: Đơn giá trên hóa đơn.
- `RawExtractedText` TEXT: Đoạn trích xuất OCR ban đầu.
- `ConfidenceScore` DECIMAL(5, 2) DEFAULT 100.00: Độ chính xác bóc tách.
- `Status` ENUM('PENDING_CONFIRMATION', 'COMMITTED', 'REJECTED') DEFAULT 'COMMITTED'.
- `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP.

### 2.4. View `ExpiringProductsWarning` (Cảnh báo hàng cận Date)
- Truy vấn các lô hàng thực phẩm có `DaysRemaining <= 30` ngày.
- Trường dữ liệu: `SKU`, `ProductName`, `BatchNumber`, `StockQuantity`, `ExpiryDate`, `DaysRemaining`, `WarningAlert`.

---

## 3. PHÂN VAI SWARM VÀ TIẾN ĐỘ THI CÔNG
1. **AI-LEAD&BA (CONVERSATION_ID_1):** Giám sát kiến trúc, bóc tách User Stories, quản trị Dispatch Board và tích hợp GitOps.
2. **AI-DATA (CONVERSATION_ID_2):** Viết trọn bộ script SQL Migration, DDL bảng, index và views trong `migrations/`.
3. **AI-BACKEND (CONVERSATION_ID_4):** Dựng backend Express API và Cloudflare Worker gateway kết nối an toàn với MySQL.
4. **AI-AUDIT (CONVERSATION_ID_3):** Kiểm toán bảo mật, Zero-Trust, performance SQL và kiểm thử tính toàn vẹn dữ liệu.
