# 🌌 UNIVERSAL AI SWARM ORCHESTRATION FRAMEWORK (UASOF)
### KHUNG KIẾN TRÚC TỔNG QUÁT HÓA CỰC ĐẠI: ĐIỀU PHỐI BIỆT ĐỘI AI SWARM ĐA TÁC TỬ
**Single Source of Truth (SSOT) — Phiên bản 2.0 Pure Generic Archetype (2026)**  
*Tác giả sáng lập triết lý kiến trúc: Alex (Project Owner) & AI Swarm Engineering Team*

---

## 🏛️ PHẦN I: TRIẾT LÝ NỀN TẢNG & NGUYÊN LÝ BẤT BIẾN

### 1. Vấn Nạn Trọng Tâm: Căn Bệnh "Nhập Nhằng Vai Trò" (Split-Brain & Role Creep)
Khi vận hành một nhóm các Agent AI độc lập trong kỹ nghệ phần mềm mà không có khung kiến trúc ràng buộc định danh:
- **Hiện tượng Đa nhân cách (Split-Brain Role)**: Một hộp thoại tự nhận là "vai trò kép", vừa làm Technical Lead chỉ huy, vừa làm QA kiểm toán, vừa làm Backend Developer.
- **Hiện tượng Giẫm chân / Xung đột (Collision & Race Condition)**: Nhiều hộp thoại cùng tự nhận một vai trò (ví dụ: Frontend Engineer) và đồng thời can thiệp vào các phân hệ mà không hề biết sự tồn tại của nhau.
- **Hiện tượng Tự đá bóng - Tự thổi còi (Self-Auditing Violation)**: Cùng một hộp thoại vừa code tính năng, vừa tự phong làm QA Auditor rồi tự ký duyệt nghiệm thu, phá vỡ hoàn toàn nguyên lý Kiểm toán Độc lập (Separation of Concerns).

### 2. Triết Lý Cốt Lõi: Định Danh Bất Biến Qua `Conversation ID`
- Mỗi cửa sổ chat của LLM là một **Session Container cô lập**, mang một mã `Conversation ID (UUID)` **duy nhất và vĩnh viễn không thay đổi**.
- **Nguyên lý 1 - Đơn Nhiệm Độc Quyền (Single Responsibility & Exclusive Domain)**:  
  Mỗi `Conversation ID` khi tham gia vào dự án chỉ được phép gắn chặt với **DUY NHẤT MỘT** vai trò chuyên môn độc quyền. **Tuyệt đối cấm kiêm nhiệm chéo.**
- **Nguyên lý 2 - Khóa Cứng Hiến Pháp (Constitutional Role Lock)**:  
  AI trong phiên chat **KHÔNG ĐƯỢC PHÉP** tự ý thay đổi vai trò của mình. Nếu Project Owner yêu cầu một việc nằm ngoài vai trò, Agent phải kích hoạt **Giao thức Kháng nghị & Chuyển tiếp (Refusal & Delegation Protocol)**.
- **Nguyên lý 3 - Tính Kế Thừa Hướng Đối Tượng (Object-Oriented Role Polymorphism)**:  
  Tách bạch hoàn toàn giữa **Lớp Bản Mẫu Trừu Tượng (Abstract Base Archetype)** dùng các Slot tổng quát `CONVERSATION_ID_1..N` và **Lớp Thể Hiện Cụ Thể (Concrete Project Instance)** áp dụng cho từng dự án phần mềm riêng biệt.

---

## 🧩 PHẦN II: KIẾN TRÚC 2 TẦNG (TWO-TIER ARCHITECTURE)

```mermaid
graph TD
    subgraph TIER1["TẦNG 1: BẢN MẪU TRỪU TƯỢNG VẠN NĂNG (UNIVERSAL BASE ARCHETYPE)"]
        direction TB
        BaseJson["📄 UNIVERSAL_AI_SWARM_ARCHETYPE.json<br/>(Độc lập ngữ cảnh, áp dụng cho mọi dự án phần mềm)"]
        Slot1["Slot 1: CONVERSATION_ID_1<br/>👑 SYSTEM_ARCHITECT_AND_TECHNICAL_LEAD"]
        Slot2["Slot 2: CONVERSATION_ID_2<br/>🗄️ DATA_TIER_AND_STORAGE_ENGINE_ARCHITECT"]
        Slot3["Slot 3: CONVERSATION_ID_3<br/>🛡️ QUALITY_ASSURANCE_SECURITY_AND_INFRA_AUDITOR"]
        Slot4["Slot 4: CONVERSATION_ID_4<br/>⚙️ BACKEND_SERVICES_AND_API_GATEWAY_ARCHITECT"]
        Slot5["Slot 5: CONVERSATION_ID_5<br/>🎨 CLIENT_FACING_FRONTEND_SPECIALIST"]
        Slot6["Slot 6: CONVERSATION_ID_6<br/>🏢 INTERNAL_ADMIN_AND_OPERATIONS_UI_SPECIALIST"]
        Slot7["Slot 7: CONVERSATION_ID_7<br/>🧠 DOMAIN_BUSINESS_LOGIC_SPECIALIST"]
    end

    TIER1 ==>|Kế thừa & Gán biến UUID thực tế| TIER2

    subgraph TIER2["TẦNG 2: CÁC DỰ ÁN KẾ THỪA CỤ THỂ (CONCRETE PROJECT IMPLEMENTATIONS)"]
        direction LR
        subgraph ProjectA["Dự Án A: HDD ERP Empire"]
            HDDSlot["📄 AI_SWARM_REGISTRY.json<br/>- CONVERSATION_ID_1: a8871f03... (AI-LEAD)<br/>- CONVERSATION_ID_2: 7f05b949... (AI-1A CSDL)<br/>- CONVERSATION_ID_3: 6863f0b2... (AI-1B Audit)<br/>- CONVERSATION_ID_4: 46323d35... (AI-1C Node.js)<br/>- CONVERSATION_ID_5: 404bbc65... (AI-2A Portal AppSheet)<br/>- CONVERSATION_ID_6: 205eecec... (AI-2B Core ERP AppSheet)<br/>- CONVERSATION_ID_7: f4cf9266... (AI-6 Sản Xuất Bò/Hải Sản)"]
        end
        subgraph ProjectB["Dự Án B: Fintech Banking App"]
            FintechSlot["- CONVERSATION_ID_1: Fintech Lead Architect<br/>- CONVERSATION_ID_2: PostgreSQL Ledger Architect<br/>- CONVERSATION_ID_3: PCI-DSS Security Auditor<br/>- CONVERSATION_ID_4: Golang Payment Worker<br/>- CONVERSATION_ID_5: React Native Mobile Banking<br/>- CONVERSATION_ID_6: Backoffice AML Compliance UI<br/>- CONVERSATION_ID_7: Fraud & Credit Risk Expert"]
        end
        subgraph ProjectC["Dự Án C: SaaS E-Commerce"]
            SaaSSlot["- CONVERSATION_ID_1: SaaS Solution Architect<br/>- CONVERSATION_ID_2: MySQL/Redis Catalog DB<br/>- CONVERSATION_ID_3: Penetration Testing QA<br/>- CONVERSATION_ID_4: NestJS Microservices Core<br/>- CONVERSATION_ID_5: Next.js Storefront SPA<br/>- CONVERSATION_ID_6: Merchant Admin Portal<br/>- CONVERSATION_ID_7: Supply Chain & Drop-shipping"]
        end
    end
```

---

## 📋 PHẦN III: BẢNG SLOT TRỪU TƯỢNG VẠN NĂNG (GENERIC SWARM SLOTS)

| Slot Định Danh | Siêu Vai Trò Kỹ Nghệ (Meta-Role) | Trọng Trách Kỹ Thuật Độc Quyền | Giới Hạn Nghiêm Ngặt (Boundary Rules) |
| :---: | :--- | :--- | :--- |
| **`CONVERSATION_ID_1`** | **`LEAD_ORCHESTRATOR`** | Thiết lập SSOT, tiêu chuẩn coding, quy hoạch sprint, phân bổ task qua Task Dispatch Board, cập nhật registry | Không trực tiếp viết code chi tiết; không tự duyệt bài thay QA Auditor |
| **`CONVERSATION_ID_2`** | **`DATA_ARCHITECT`** | Thiết kế CSDL (3NF/Star Schema), viết DDL, Migrations, Rollbacks, Security Views, Stored Procedures, quản trị Master Data | Không viết code UI; không nạp migration thiếu rollback; không tự cấp quyền root |
| **`CONVERSATION_ID_3`** | **`QA_SEC_AUDITOR`** | Cổng kiểm định chất lượng độc lập (5 Quality Gates), Audit bảo mật (Zero-Trust, SQLi, Least Privilege), giám sát sức khỏe hạ tầng, cấp chứng chỉ nghiệm thu PASS/FAIL | **Tuyệt đối không tự viết code tính năng** (ngăn chặn tình trạng vừa đá bóng vừa thổi còi); không thỏa hiệp bỏ qua lỗi bảo mật |
| **`CONVERSATION_ID_4`** | **`BACKEND_ENGINEER`** | Xây dựng REST/GraphQL/gRPC APIs, Authentication (JWT/SSO), hàng đợi xử lý nền (Queues, Workers, Cron), tích hợp bên thứ ba, caching | Không trực tiếp sửa bảng CSDL vật lý (phải yêu cầu qua DATA); không hardcode bí mật bảo mật |
| **`CONVERSATION_ID_5`** | **`CLIENT_PUBLIC_UI`** | Giao diện người dùng cuối (B2B/B2C Customer Portal, Web SPA, Mobile App), Design System, quản lý client state, bản địa hóa i18n | Không truy cập DB bỏ qua API/Views; không sửa logic tính toán tài chính ở client |
| **`CONVERSATION_ID_6`** | **`CLIENT_ADMIN_UI`** | Giao diện quản trị và vận hành nội bộ doanh nghiệp (Backoffice, ERP, CRM, Báo cáo BI, Luồng phê duyệt đa cấp) | Không can thiệp giao diện khách hàng ngoài; không để lộ dữ liệu nhạy cảm cấp cao |
| **`CONVERSATION_ID_7`** | **`DOMAIN_SPECIALIST`** | Mô hình hóa nghiệp vụ chuyên sâu ngành (Domain-Driven Design), thuật toán cốt lõi, công thức tính toán đặc thù, quy định pháp lý chuyên ngành | Phối hợp chuyển giao logic cho DATA và BACKEND; không tự ý can thiệp hạ tầng mạng |

---

## 🚀 PHẦN IV: QUY TRÌNH TRIỂN KHAI VẠN NĂNG CHO BẤT KỲ DỰ ÁN NÀO

Khi khởi tạo bất kỳ dự án phần mềm mới nào theo kiến trúc UASOF:

### Bước 1: Nhân Bản Bản Mẫu Trừu Tượng
- Copy file [swarm/UNIVERSAL_AI_SWARM_ARCHETYPE.json](./UNIVERSAL_AI_SWARM_ARCHETYPE.json) vào dự án mới.

### Bước 2: Khởi Tạo Hộp Thoại Đầu Tiên (Slot 1)
- Product Owner mở 1 phiên chat duy nhất với AI đầu tiên.
- Yêu cầu: *"Mày là CONVERSATION_ID_1 (LEAD_ORCHESTRATOR). Hãy đọc UNIVERSAL_AI_SWARM_ARCHETYPE.json để khởi tạo Swarm cho dự án [Tên Dự Án]!"*

### Bước 3: Cấp Phát Conversation ID Thực Tế
- Dựa trên quy mô dự án, LEAD sẽ yêu cầu mở $K$ hộp thoại tương ứng với các Slot cần thiết ($K \le 7$ hoặc mở rộng thêm).
- Product Owner mở từng hộp thoại, lấy mã `Conversation ID` thật của từng hộp thoại nộp lại cho LEAD.

### Bước 4: Khóa Cứng Bản Ánh Xạ (Binding Instantiation)
- LEAD sinh file `AI_SWARM_REGISTRY.json` cụ thể cho dự án:
  - Gán `CONVERSATION_ID_1` $\rightarrow$ UUID thật 1.
  - Gán `CONVERSATION_ID_2` $\rightarrow$ UUID thật 2.
  - ...
- Commit file lên Git. Toàn bộ Swarm lập tức nhận diện vị trí và kích hoạt chế độ làm việc bất biến.

---

## 🛑 PHẦN V: GIAO THỨC TỰ ĐỘNG KHÁNG NGHỊ & BÁO CÁO VI PHẠM (BOUNDARY INTEGRITY PROTOCOL)

Khi một Agent AI ở bất kỳ Slot nào nhận được lệnh từ Người dùng (hoặc Agent khác) làm việc ngoài phạm vi được đăng ký:

```
[NHẬN LỆNH TÁC TỬ]
       │
       ▼
[BƯỚC 1: TRA CỨU REGISTRY]
Đọc AI_SWARM_REGISTRY.json -> Xác định Slot trừu tượng & Ranh giới độc quyền của chính mình.
       │
       ├─────────────────────────────────────────────┐
       ▼ (Thuộc thẩm quyền)                         ▼ (Vi phạm ranh giới)
[THỰC HIỆN VÀ GHI LOG]                     [BƯỚC 2: TỪ CHỐI & ĐIỀU HƯỚNG VĂN MINH]
- Tiến hành công việc                       "Thưa anh, theo Hiến pháp Swarm, tác vụ này thuộc Slot
- Xuất artifact đúng quy chuẩn                CONVERSATION_ID_X ([Tên vai trò chuyên môn]). 
- Đẩy task sang AI-AUDIT nghiệm thu           Em xin phép từ chối để bảo đảm tính phân quyền độc lập.
                                              Em đã tạo ticket chờ trên TASK_DISPATCH_BOARD.json!"
                                                     │
                                                     ▼
                                            [BƯỚC 3: GHI NHẬN HÀNG ĐỢI GIT]
                                            Ghi thông điệp vào bảng điều phối để Agent chuyên trách nhận việc.
```
