const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/frontend/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add Header Ticker Widget right before Dark/Light theme button
const headerSearch = `<!-- Dark/Light Theme Toggle -->`;
const headerTickerHtml = `
          <!-- Live Cost & Quota Header Widget -->
          <div onclick="switchTab('tab-quota')" class="cursor-pointer hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all shadow-sm" title="Bấm để xem Báo cáo Quota & Chi phí Live">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span class="font-mono font-black text-[13px]" id="header-cost-ticker">0 đ</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900 font-bold" id="header-quota-percent">0.0% Quota</span>
          </div>

          <!-- Dark/Light Theme Toggle -->`;

if (!html.includes('header-cost-ticker')) {
  html = html.replace(headerSearch, headerTickerHtml);
}

// 2. Add Navigation Tab Button for Quota
const navSearch = `<!-- Tab: Kiểm Tra CSDL Thực Tế (Table vs View) -->`;
const navQuotaBtn = `
        <!-- Tab: Quản Lý Quota & Chi Phí LIVE -->
        <button onclick="switchTab('tab-quota')" id="btn-tab-quota" class="nav-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <i class="fa-solid fa-gauge-high text-emerald-500"></i>
          <span>6. Quota & Chi Phí LIVE</span>
          <span id="nav-quota-ticker-badge" class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span id="nav-cost-text">0đ / 500k</span>
          </span>
        </button>

        <!-- Tab: Kiểm Tra CSDL Thực Tế (Table vs View) -->`;

if (!html.includes('btn-tab-quota')) {
  html = html.replace(navSearch, navQuotaBtn);
}

// 3. Add Tab 6 Pane before </main>
const mainSearch = `  </main>`;
const tabQuotaHtml = `
    <!-- ============================================================== -->
    <!-- TAB 6: BÁO CÁO QUOTA & CHI PHÍ TRỰC TIẾP (LIVE COST & QUOTA MONITOR) -->
    <!-- ============================================================== -->
    <div id="tab-quota" class="tab-pane hidden space-y-6 sm:space-y-8">
      
      <!-- Box 1: Banner Quota & Real-time Status -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border-l-4 border-l-emerald-500 shadow-md space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-start space-x-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shrink-0">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Báo Cáo Hạn Mức Quota & Chi Phí Trực Tiếp (Live Cost Sentinel)
                </h3>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Đang Bắt Sóng Live Liên Tục (2.5s)
                </span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Hệ thống tự động đo lường Token LLM, Request Cloudflare Worker, OCR Vision và truy vấn MySQL để tính toán chi phí chính xác từng đồng thời gian thực.
              </p>
            </div>
          </div>
          
          <!-- Simulation Test Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="simulateActivity('ai')" class="px-3 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-robot"></i>
              <span>+ Gọi AI Trợ Lý</span>
            </button>
            <button onclick="simulateActivity('ocr')" class="px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-file-invoice"></i>
              <span>+ Quét HĐ OCR</span>
            </button>
            <button onclick="simulateActivity('sync')" class="px-3 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-rotate"></i>
              <span>+ Sync AppSheet</span>
            </button>
            <button onclick="openBudgetModal()" class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-sliders"></i>
              <span>Đổi Hạn Mức</span>
            </button>
            <button onclick="resetQuotaCounters()" class="px-3 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-all flex items-center gap-1" title="Xóa dữ liệu test về 0">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Box 2: 4 Thẻ KPI Chi Phí & Quota Realtime -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <!-- KPI 1: Đã Chi Phí -->
        <div class="glass-card rounded-2xl p-5 shadow-sm space-y-2 border-t-4 border-t-emerald-500">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Chi Phí Đã Dùng</span>
            <i class="fa-solid fa-money-bill-wave text-emerald-500 text-base"></i>
          </div>
          <div class="flex items-baseline space-x-2">
            <span class="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white" id="quota-kpi-cost-vnd">0 đ</span>
          </div>
          <div class="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Quy đổi USD:</span>
            <span class="font-bold text-slate-700 dark:text-slate-300" id="quota-kpi-cost-usd">$0.0000</span>
          </div>
        </div>

        <!-- KPI 2: Ngân Sách Còn Lại -->
        <div class="glass-card rounded-2xl p-5 shadow-sm space-y-2 border-t-4 border-t-sky-500">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Hạn Mức Còn Lại</span>
            <i class="fa-solid fa-wallet text-sky-500 text-base"></i>
          </div>
          <div class="flex items-baseline space-x-2">
            <span class="text-2xl sm:text-3xl font-mono font-black text-sky-600 dark:text-sky-400" id="quota-kpi-remaining-vnd">500,000 đ</span>
          </div>
          <div class="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Hạn mức tối đa:</span>
            <span class="font-bold text-slate-700 dark:text-slate-300" id="quota-kpi-budget-limit">500,000 đ</span>
          </div>
        </div>

        <!-- KPI 3: Token LLM & Lượt Gọi -->
        <div class="glass-card rounded-2xl p-5 shadow-sm space-y-2 border-t-4 border-t-purple-500">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Token AI Đã Dùng</span>
            <i class="fa-solid fa-microchip text-purple-500 text-base"></i>
          </div>
          <div class="flex items-baseline space-x-2">
            <span class="text-2xl sm:text-3xl font-mono font-black text-purple-600 dark:text-purple-400" id="quota-kpi-tokens">0</span>
            <span class="text-xs text-slate-500 font-medium">tokens</span>
          </div>
          <div class="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Tổng số request:</span>
            <span class="font-bold text-slate-700 dark:text-slate-300" id="quota-kpi-requests">0 calls</span>
          </div>
        </div>

        <!-- KPI 4: Trạng Thái An Toàn -->
        <div class="glass-card rounded-2xl p-5 shadow-sm space-y-2 border-t-4 border-t-teal-500" id="quota-kpi-health-card">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Tình Trạng Hạn Mức</span>
            <i class="fa-solid fa-shield-halved text-emerald-500 text-base" id="quota-health-icon"></i>
          </div>
          <div class="flex items-baseline space-x-2">
            <span class="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 uppercase" id="quota-kpi-health-status">AN TOÀN</span>
          </div>
          <div class="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Tỷ lệ đã dùng:</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400" id="quota-kpi-percent-used">0.0%</span>
          </div>
        </div>

      </div>

      <!-- Box 3: Thanh Tiến Độ Hạn Mức Quota (Visual Budget Gauge) -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div class="flex items-center justify-between text-xs sm:text-sm">
          <span class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-bars-progress text-brand-600"></i>
            Thanh Tiến Độ Hạn Mức Ngân Sách Tháng
          </span>
          <span class="font-mono font-black text-xs text-slate-600 dark:text-slate-300" id="quota-progress-label">0.0% (Đã chi 0đ / 500,000đ)</span>
        </div>
        
        <!-- Progress Bar Track -->
        <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div id="quota-progress-bar" class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style="width: 1%"></div>
        </div>

        <div class="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
          <span>0 đ (Bắt đầu)</span>
          <span class="text-amber-500 font-bold">Cảnh báo: 75% (375,000đ)</span>
          <span class="text-rose-500 font-bold">Nguy cấp: 90% (450,000đ)</span>
          <span id="quota-progress-max-label">100% (500,000đ)</span>
        </div>
      </div>

      <!-- Box 4: 2 Cột Thống Kê Chi Tiết Theo Dịch Vụ & Biểu Giá -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Cột 1: Phân Bổ Chi Phí Theo Dịch Vụ (2 phần) -->
        <div class="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-sky-500"></i>
              Bảng Phân Bổ Chi Phí Theo Dịch Vụ Kỹ Thuật
            </h4>
            <span class="text-[11px] text-slate-400 font-mono">Tỷ giá: 1 USD = 25,400 VNĐ</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100/70 dark:bg-slate-800/60 uppercase font-black text-slate-600 dark:text-slate-300">
                <tr>
                  <th class="py-3 px-3.5 rounded-l-lg">Dịch Vụ / Thành Phần</th>
                  <th class="py-3 px-3 text-center">Khối Lượng Dùng</th>
                  <th class="py-3 px-3">Đơn Giá Định Mức</th>
                  <th class="py-3 px-3.5 text-right rounded-r-lg">Chi Phí (VNĐ)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                
                <!-- Row: Gemini LLM -->
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>AI Gemini 1.5 Flash (LLM)</span>
                  </td>
                  <td class="py-3 px-3 text-center font-mono" id="breakdown-ai-volume">0 tokens</td>
                  <td class="py-3 px-3 text-slate-500 font-mono text-[11px]">~1.9đ / 1k input; ~7.6đ / 1k output</td>
                  <td class="py-3 px-3.5 text-right font-mono font-black text-purple-600 dark:text-purple-400" id="breakdown-ai-cost">0 đ</td>
                </tr>

                <!-- Row: OCR Vision -->
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>OCR Vision Engine (Bóc Tách Hóa Đơn)</span>
                  </td>
                  <td class="py-3 px-3 text-center font-mono" id="breakdown-ocr-volume">0 lần quét</td>
                  <td class="py-3 px-3 text-slate-500 font-mono text-[11px]">~38.1 VNĐ / hóa đơn</td>
                  <td class="py-3 px-3.5 text-right font-mono font-black text-blue-600 dark:text-blue-400" id="breakdown-ocr-cost">0 đ</td>
                </tr>

                <!-- Row: Cloudflare Edge -->
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Cloudflare Worker Edge API</span>
                  </td>
                  <td class="py-3 px-3 text-center font-mono" id="breakdown-cf-volume">0 reqs</td>
                  <td class="py-3 px-3 text-slate-500 font-mono text-[11px]">100,000 req/ngày Free (Gói Miễn Phí)</td>
                  <td class="py-3 px-3.5 text-right font-mono font-black text-amber-600 dark:text-amber-400" id="breakdown-cf-cost">0 đ</td>
                </tr>

                <!-- Row: MySQL VPS -->
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>MySQL 8 Database Queries (VPS)</span>
                  </td>
                  <td class="py-3 px-3 text-center font-mono" id="breakdown-db-volume">0 queries</td>
                  <td class="py-3 px-3 text-slate-500 font-mono text-[11px]">Server riêng VPS (Trọn gói tháng)</td>
                  <td class="py-3 px-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400" id="breakdown-db-cost">0 đ</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        <!-- Cột 2: Quy Tắc An Toàn Ngân Sách (Guardrails) -->
        <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <i class="fa-solid fa-lock text-brand-600"></i>
            Chốt Chặn Chi Phí (Cost Guardrail)
          </h4>
          
          <div class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div class="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-xs"></i>
                <span>Tự Động Bảo Vệ Số Dư</span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Khi chi phí chạm ngưỡng 90% hạn mức đã đặt, hệ thống sẽ tự động bật cảnh báo nổi trên toàn bộ màn hình để ngăn chặn vượt ngân sách.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <div class="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <i class="fa-solid fa-bolt text-xs"></i>
                <span>Đồng Bộ Trực Tiếp</span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Mọi tác vụ bóc tách OCR hay tính giá margin tự động cộng dồn tức thời vào bảng báo cáo này không cần reload lại trang.
              </p>
            </div>

            <button onclick="openBudgetModal()" class="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow hover:opacity-90 transition-all">
              <i class="fa-solid fa-sliders mr-1.5"></i> Cấu Hình Lại Ngân Sách Tháng
            </button>
          </div>
        </div>

      </div>

      <!-- Box 5: Bảng Dòng Sự Kiện Live Liên Tục (Live Event Feed Stream) -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              Dòng Sự Kiện Chi Phí Tức Thời (Real-Time Live Event Stream)
            </h4>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-[11px] text-slate-400 font-mono" id="quota-last-sync-time">Cập nhật lúc: --:--:--</span>
            <button onclick="fetchQuotaData(true)" class="p-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" title="Tải lại ngay">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/70 dark:bg-slate-800/60 uppercase font-black text-slate-600 dark:text-slate-300">
              <tr>
                <th class="py-3 px-3.5 rounded-l-lg">Thời Gian</th>
                <th class="py-3 px-3">Dịch Vụ / Bot</th>
                <th class="py-3 px-3.5">Hành Động Hệ Thống</th>
                <th class="py-3 px-3 text-center">Khối Lượng</th>
                <th class="py-3 px-3.5 text-right rounded-r-lg font-black">Chi Phí Tức Thời</th>
              </tr>
            </thead>
            <tbody id="quota-events-tbody" class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              <!-- Live populated via JS -->
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </main>`;

if (!html.includes('id="tab-quota"')) {
  html = html.replace(mainSearch, tabQuotaHtml);
}

// 4. Add Budget Configuration Modal before </body>
const bodyEndSearch = `</body>`;
const budgetModalHtml = `
  <!-- Budget Setting Modal -->
  <div id="budget-modal" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center">
          <i class="fa-solid fa-sliders text-emerald-500 mr-2"></i>
          Cài Đặt Hạn Mức Ngân Sách (Budget Quota)
        </h3>
        <button onclick="closeBudgetModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>
      <div class="space-y-3">
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Hạn mức ngân sách tối đa hàng tháng (VNĐ):
        </label>
        <div class="relative">
          <input type="number" id="input-budget-vnd" step="10000" min="50000" class="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="500000">
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VNĐ</span>
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <button type="button" onclick="setBudgetPreset(200000)" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300">200k</button>
          <button type="button" onclick="setBudgetPreset(500000)" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300">500k</button>
          <button type="button" onclick="setBudgetPreset(1000000)" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300">1 Triệu</button>
          <button type="button" onclick="setBudgetPreset(2000000)" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300">2 Triệu</button>
        </div>
      </div>
      <div class="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button onclick="closeBudgetModal()" class="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">Hủy</button>
        <button onclick="saveBudgetLimit()" class="px-4 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow">Lưu Hạn Mức</button>
      </div>
    </div>
  </div>
</body>`;

if (!html.includes('id="budget-modal"')) {
  html = html.replace(bodyEndSearch, budgetModalHtml);
}

// 5. Add Quota Live JS Script before </script>
const scriptEndSearch = `  </script>`;
const quotaJsCode = `
    // ================================================================
    // LIVE COST & QUOTA MONITOR JAVASCRIPT ENGINE
    // ================================================================
    let quotaPollTimer = null;

    async function fetchQuotaData(showNotice = false) {
      try {
        const res = await fetch('/api/quota/overview');
        const json = await res.json();
        if (json.success && json.data) {
          renderQuotaDashboard(json.data);
          if (showNotice) showToast('Đã đồng bộ số liệu Quota & Chi phí mới nhất!', 'info');
        }
      } catch (err) {
        console.warn('Lỗi đọc quota:', err.message);
      }
    }

    function renderQuotaDashboard(data) {
      // Header Tickers
      const headerCost = document.getElementById('header-cost-ticker');
      if (headerCost) headerCost.innerText = data.totalCostVND.toLocaleString('vi-VN') + ' đ';

      const headerPercent = document.getElementById('header-quota-percent');
      if (headerPercent) headerPercent.innerText = data.percentUsed + '% Quota';

      const navCostText = document.getElementById('nav-cost-text');
      if (navCostText) {
        navCostText.innerText = data.totalCostVND.toLocaleString('vi-VN') + 'đ / ' + (Math.round(data.budgetLimitVND / 1000)) + 'k';
      }

      // KPI Cards
      const kpiCostVnd = document.getElementById('quota-kpi-cost-vnd');
      if (kpiCostVnd) kpiCostVnd.innerText = data.totalCostVND.toLocaleString('vi-VN') + ' đ';

      const kpiCostUsd = document.getElementById('quota-kpi-cost-usd');
      if (kpiCostUsd) kpiCostUsd.innerText = '$' + data.totalCostUSD.toFixed(4);

      const kpiRemaining = document.getElementById('quota-kpi-remaining-vnd');
      if (kpiRemaining) kpiRemaining.innerText = data.remainingBudgetVND.toLocaleString('vi-VN') + ' đ';

      const kpiBudgetLimit = document.getElementById('quota-kpi-budget-limit');
      if (kpiBudgetLimit) kpiBudgetLimit.innerText = data.budgetLimitVND.toLocaleString('vi-VN') + ' đ';

      const kpiTokens = document.getElementById('quota-kpi-tokens');
      if (kpiTokens) kpiTokens.innerText = data.totalTokens.toLocaleString('vi-VN');

      const kpiRequests = document.getElementById('quota-kpi-requests');
      if (kpiRequests) kpiRequests.innerText = data.totalRequests.toLocaleString('vi-VN') + ' calls';

      const kpiHealthStatus = document.getElementById('quota-kpi-health-status');
      if (kpiHealthStatus) {
        kpiHealthStatus.innerText = data.healthStatus;
        kpiHealthStatus.className = 'text-xl sm:text-2xl font-black uppercase text-' + (data.healthClass === 'rose' ? 'rose-600 dark:text-rose-400' : (data.healthClass === 'amber' ? 'amber-600 dark:text-amber-400' : 'emerald-600 dark:text-emerald-400'));
      }

      const kpiPercentUsed = document.getElementById('quota-kpi-percent-used');
      if (kpiPercentUsed) kpiPercentUsed.innerText = data.percentUsed + '%';

      // Progress Bar
      const progressBar = document.getElementById('quota-progress-bar');
      if (progressBar) {
        const pct = Math.max(1, Math.min(100, data.percentUsed));
        progressBar.style.width = pct + '%';
        if (data.percentUsed >= 90) {
          progressBar.className = 'h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-500';
        } else if (data.percentUsed >= 70) {
          progressBar.className = 'h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500';
        } else {
          progressBar.className = 'h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500';
        }
      }

      const progressLabel = document.getElementById('quota-progress-label');
      if (progressLabel) {
        progressLabel.innerText = data.percentUsed + '% (Đã chi ' + data.totalCostVND.toLocaleString('vi-VN') + 'đ / ' + data.budgetLimitVND.toLocaleString('vi-VN') + 'đ)';
      }

      const progressMaxLabel = document.getElementById('quota-progress-max-label');
      if (progressMaxLabel) progressMaxLabel.innerText = '100% (' + data.budgetLimitVND.toLocaleString('vi-VN') + 'đ)';

      // Service Breakdown Table
      const bd = data.breakdown;
      if (bd) {
        if (document.getElementById('breakdown-ai-volume')) {
          document.getElementById('breakdown-ai-volume').innerText = (bd.aiGemini.tokens || 0).toLocaleString('vi-VN') + ' tokens (' + (bd.aiGemini.requests || 0) + ' calls)';
          document.getElementById('breakdown-ai-cost').innerText = Math.round(bd.aiGemini.costVND || 0).toLocaleString('vi-VN') + ' đ';
        }
        if (document.getElementById('breakdown-ocr-volume')) {
          document.getElementById('breakdown-ocr-volume').innerText = (bd.ocrVision.requests || 0) + ' lần quét';
          document.getElementById('breakdown-ocr-cost').innerText = Math.round(bd.ocrVision.costVND || 0).toLocaleString('vi-VN') + ' đ';
        }
        if (document.getElementById('breakdown-cf-volume')) {
          document.getElementById('breakdown-cf-volume').innerText = (bd.cloudflareEdge.requests || 0) + ' reqs';
          document.getElementById('breakdown-cf-cost').innerText = Math.round(bd.cloudflareEdge.costVND || 0).toLocaleString('vi-VN') + ' đ';
        }
        if (document.getElementById('breakdown-db-volume')) {
          document.getElementById('breakdown-db-volume').innerText = (bd.mysqlDb.queries || 0) + ' queries';
          document.getElementById('breakdown-db-cost').innerText = Math.round(bd.mysqlDb.costVND || 0).toLocaleString('vi-VN') + ' đ';
        }
      }

      // Live Events Stream
      const tbody = document.getElementById('quota-events-tbody');
      if (tbody && data.recentEvents) {
        let rowsHtml = '';
        data.recentEvents.slice(0, 15).forEach(evt => {
          let dotColor = 'bg-emerald-500';
          let textColor = 'text-emerald-600 dark:text-emerald-400';
          if (evt.service.includes('AI') || evt.service.includes('Gemini')) {
            dotColor = 'bg-purple-500';
            textColor = 'text-purple-600 dark:text-purple-400';
          } else if (evt.service.includes('OCR')) {
            dotColor = 'bg-blue-500';
            textColor = 'text-blue-600 dark:text-blue-400';
          } else if (evt.service.includes('Cloudflare')) {
            dotColor = 'bg-amber-500';
            textColor = 'text-amber-600 dark:text-amber-400';
          }

          rowsHtml += \`
            <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td class="py-2.5 px-3.5 font-mono text-slate-500 text-[11px]">\${evt.timestamp}</td>
              <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full \${dotColor}"></span>
                <span>\${evt.service}</span>
              </td>
              <td class="py-2.5 px-3.5 text-slate-700 dark:text-slate-300 text-xs">\${evt.action}</td>
              <td class="py-2.5 px-3 text-center font-mono text-[11px] text-slate-500">\${evt.tokens ? evt.tokens.toLocaleString('vi-VN') + ' tks' : '1 req'}</td>
              <td class="py-2.5 px-3.5 text-right font-mono font-black \${textColor} text-xs">+\${evt.costVND} đ</td>
            </tr>
          \`;
        });
        tbody.innerHTML = rowsHtml;
      }

      const syncTime = document.getElementById('quota-last-sync-time');
      if (syncTime) syncTime.innerText = 'Cập nhật lúc: ' + new Date().toLocaleTimeString('vi-VN');
    }

    async function simulateActivity(type) {
      let payload = {};
      if (type === 'ai') {
        payload = {
          service: 'AI Gemini 1.5 Flash',
          action: 'Trợ lý AI phân tích margin & so sánh giá đối thủ cho 5 SKU',
          tokensIn: 1450,
          tokensOut: 520
        };
      } else if (type === 'ocr') {
        payload = {
          service: 'OCR Vision Engine',
          action: 'Bóc tách ảnh chụp bảng báo giá Zalo NPP Nam Khải Phú',
          tokensIn: 3800,
          tokensOut: 610
        };
      } else if (type === 'sync') {
        payload = {
          service: 'Cloudflare Worker',
          action: 'Đồng bộ hóa tức thời 120 dòng bảng Products & Batches với AppSheet',
          tokensIn: 0,
          tokensOut: 0,
          costVND: 1.2
        };
      }

      try {
        const res = await fetch('/api/quota/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success && json.overview) {
          renderQuotaDashboard(json.overview.data);
          showToast(\`Đã mô phỏng tác vụ: \${payload.action} (+\${json.event.costVND}đ)\`, 'success');
        }
      } catch (err) {
        showToast('Lỗi mô phỏng: ' + err.message, 'error');
      }
    }

    function openBudgetModal() {
      const modal = document.getElementById('budget-modal');
      const input = document.getElementById('input-budget-vnd');
      if (modal && input) {
        modal.classList.remove('hidden');
        input.focus();
      }
    }

    function closeBudgetModal() {
      const modal = document.getElementById('budget-modal');
      if (modal) modal.classList.add('hidden');
    }

    function setBudgetPreset(amount) {
      const input = document.getElementById('input-budget-vnd');
      if (input) input.value = amount;
    }

    async function saveBudgetLimit() {
      const input = document.getElementById('input-budget-vnd');
      const limit = input ? parseFloat(input.value) : 0;
      if (!limit || limit < 10000) {
        showToast('Vui lòng nhập hạn mức tối thiểu 10,000 VNĐ!', 'error');
        return;
      }
      try {
        const res = await fetch('/api/quota/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ budgetLimitVND: limit })
        });
        const json = await res.json();
        if (json.success && json.overview) {
          renderQuotaDashboard(json.overview.data);
          closeBudgetModal();
          showToast('Đã cập nhật hạn mức ngân sách thành ' + limit.toLocaleString('vi-VN') + ' VNĐ!', 'success');
        }
      } catch (err) {
        showToast('Lỗi cập nhật hạn mức: ' + err.message, 'error');
      }
    }

    async function resetQuotaCounters() {
      if (!confirm('Bạn có chắc muốn đặt lại toàn bộ bộ đếm chi phí & lượt dùng về 0 để test lại từ đầu không?')) return;
      try {
        const res = await fetch('/api/quota/reset', { method: 'POST' });
        const json = await res.json();
        if (json.success && json.overview) {
          renderQuotaDashboard(json.overview.data);
          showToast('Đã đặt lại toàn bộ thống kê quota về 0!', 'info');
        }
      } catch (err) {
        showToast('Lỗi đặt lại: ' + err.message, 'error');
      }
    }

    // Auto start polling every 2.5s for live cost streaming
    setInterval(() => {
      fetchQuotaData();
    }, 2500);

    // Initial fetch on DOM load
    setTimeout(fetchQuotaData, 500);
  </script>`;

if (!html.includes('fetchQuotaData')) {
  html = html.replace(scriptEndSearch, quotaJsCode);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully injected Live Quota & Cost Monitor into src/frontend/index.html');
