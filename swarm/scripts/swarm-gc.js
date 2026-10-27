import fs from 'fs';
import path from 'path';

/**
 * SWARM GARBAGE COLLECTOR (GC ENGINE)
 * Tự động quét dọn file tạm, scratch dumps để bảo vệ ổ cứng và bộ nhớ hệ thống.
 */

const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');
const TTL_HOURS = 48; // Hạn sử dụng tối đa của file tạm trong scratch
const NOW = Date.now();

const args = process.argv.slice(2);
const isDryRun = !args.includes('--clean');

console.log('=== 🧹 SWARM GARBAGE COLLECTOR (GC ENGINE) ===');
console.log(`Chế độ: ${isDryRun ? 'DRY RUN (Chỉ kiểm tra)' : 'CLEAN (Thực hiện xóa rác)'}`);
console.log(`Thư mục quét: ${SCRATCH_DIR}`);
console.log(`Thời gian sống tối đa (TTL): ${TTL_HOURS} giờ\n`);

if (!fs.existsSync(SCRATCH_DIR)) {
  console.log('Thư mục scratch không tồn tại hoặc đã sạch sẽ.');
  process.exit(0);
}

const files = fs.readdirSync(SCRATCH_DIR);
let totalBytes = 0;
let eligibleFiles = [];

for (const file of files) {
  const filePath = path.join(SCRATCH_DIR, file);
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) continue;

  const ageHours = (NOW - stats.mtimeMs) / (1000 * 60 * 60);
  // File nặng > 1MB hoặc cũ hơn TTL
  const isLargeDump = stats.size > 1024 * 1024;
  const isExpired = ageHours > TTL_HOURS;

  if (isExpired || isLargeDump) {
    eligibleFiles.push({ file, path: filePath, size: stats.size, ageHours: ageHours.toFixed(1) });
    totalBytes += stats.size;
  }
}

console.log(`Tìm thấy ${eligibleFiles.length} file rác / dump nặng cần xử lý:`);
for (const item of eligibleFiles) {
  const sizeMB = (item.size / (1024 * 1024)).toFixed(2);
  console.log(` - ${item.file} (${sizeMB} MB, tuổi thọ: ${item.ageHours}h)`);
  if (!isDryRun) {
    fs.unlinkSync(item.path);
    console.log(`   -> [ĐÃ XÓA]`);
  }
}

const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
console.log(`\nTổng dung lượng giải phóng: ${totalMB} MB`);
if (isDryRun && eligibleFiles.length > 0) {
  console.log('💡 Để thực sự xóa sạch các file trên, hãy chạy: node swarm/scripts/swarm-gc.js --clean');
}
