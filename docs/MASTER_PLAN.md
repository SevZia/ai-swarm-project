# 🗺️ MASTER STRATEGIC PLAN: HDD FOOD PRICING & INVENTORY EXPIRATION SYSTEM (UASOF V3.2)
**Project Instance:** `ai-swarm-project` (HDD Food)  
**Orchestrator:** `[[ BOSS-AI-LEAD&B.A ]]` (Conversation ID: `4587490e-2f01-46f3-acdf-ab63d408bd1d`)  
**Project Owner:** SevZia  
**Repository:** https://github.com/SevZia/ai-swarm-project.git  

---

## 🏛️ ĐỘI HÌNH AI SWARM & PHÂN CÔNG VAI TRÒ ĐỘC QUYỀN

| Hộp Thoại (Chat Thread) | Vai Trò Độc Quyền | Mã Định Danh | Trách Nhiệm Cốt Lõi |
| :--- | :--- | :--- | :--- |
| **`[[ BOSS-AI-LEAD&B.A ]]`** | Chief Product Architect & Swarm Orchestrator | `4587490e-2f01-46f3-acdf-ab63d408bd1d` | Điểm chạm duy nhất với Boss, lập Master Plan, phân bổ Task Sprint trên Git, nghiệm thu cuối. |
| **`AI-DATABASE-RESEARCHER`** | Database & Storage Engine Architect | `f1c79e12-370f-4378-a5da-f18731d4b014` | Thiết kế CSDL 3NF MySQL (`hdd_appsheet`), DDL Migrations, Index, Views cảnh báo cận date. |
| **`AI-BACKEND`** | Backend Services & API Gateway Architect | *(Chờ gán UUID)* | Lập trình Express.js REST API, OCR Parser thông minh, Cloudflare Worker Gateway, bảo mật. |
| **`AI-CLIENT-UI`** | Client Frontend Specialist | *(Chờ gán UUID)* | Giao diện Web App chuyên nghiệp (Kế toán đối soát & Kinh doanh tra cứu), TailwindCSS, Responsive. |
| **`AI-AUDIT-QA`** | Quality Gate & Security Auditor | *(Chờ gán UUID)* | Kiểm toán 5 Quality Gates, Zero-Trust, test luồng bóc tách hóa đơn, cấp chứng chỉ nghiệm thu. |

---

## 🚀 LỘ TRÌNH 6 GIAI ĐOẠN CHIẾN LƯỢC (ROADMAP)

### 📍 Giai đoạn 1: Nền tảng Dữ liệu & Đăng bạ Swarm (Hoàn thành 100%)
- [x] Khởi tạo Swarm Workspace UASOF V3.2, kết nối GitHub `SevZia/ai-swarm-project`.
- [x] Soạn thảo đặc tả nghiệp vụ tổng thể `docs/PROJECT_MASTER_SPECIFICATION.md`.
- [x] AI-DATA hoàn thành `migrations/001_hdd_food_schema.sql` (bảng `Products`, `ProductBatches`, `PriceHistory`, `InboundReceiptOCR`, View `ExpiringProductsWarning`).

### 📍 Giai đoạn 2: Thiết kế Giao diện UI/UX Web App (Hoàn thành 100%)
- [x] Thiết kế giao diện `src/frontend/index.html` (1.520 dòng code, chuẩn màu thực phẩm Emerald/Beef Red).
- [x] Phân hệ Kế toán: Khung paste Zalo quote, Drag & Drop hóa đơn VAT, bảng đối soát giá cũ/mới, tính % biến động.
- [x] Phân hệ Kinh doanh: Tra cứu giá vốn + giá bán theo Margin, bảng cảnh báo hàng cận Date (< 30 ngày), nút tạo thông điệp Flash Sale.

### 📍 Giai đoạn 3: Lập trình Core Backend & Parser Engine (Đang thi công ⚡)
- [ ] Xây dựng Express Server tại `src/backend/server.js`.
- [ ] Viết API bóc tách báo giá text Zalo và hóa đơn thịt bò nhập khẩu (Tenderloin, Striploin, Ribeye, Ba rọi...).
- [ ] API tự động tính % chênh lệch và cập nhật giá vào CSDL MySQL `hdd_appsheet`.
- [ ] API cảnh báo hàng cận date theo View `ExpiringProductsWarning`.

### 📍 Giai đoạn 4: Tích hợp Cầu nối Cloudflare Worker & AppSheet Realtime Sync
- [ ] Cấu hình Cloudflare Worker Endpoint kết nối an toàn với MySQL `31.220.60.199:3306`.
- [ ] Kiểm thử luồng đồng bộ: Kế toán bấm "Duyệt" trên Web App ➔ MySQL cập nhật ➔ AppSheet Kinh Doanh thấy giá mới tức thì.

### 📍 Giai đoạn 5: Kiểm toán Chất lượng 5 Quality Gates & Bảo Mật (AI-AUDIT-QA)
- [ ] Kiểm toán Zero-Trust, bảo mật mật khẩu database và API tokens.
- [ ] Kiểm thử tải và kiểm thử độ chính xác bóc tách OCR/Zalo text.
- [ ] Xuất báo cáo chứng chỉ nghiệm thu `docs/QA_AUDIT_REPORT.md`.

### 📍 Giai đoạn 6: Đóng gói Triển khai & Bàn giao Vận hành
- [ ] Đóng gói script khởi chạy 1-click cho nội bộ công ty.
- [ ] Soạn thảo hướng dẫn sử dụng nhanh cho Kế toán và Kinh doanh.
