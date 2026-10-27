import fs from 'fs';
import path from 'path';

/**
 * SWARM LAZY QUERY ENGINE (swarm-query.js)
 * Truy vấn nhanh thông tin Swarm (Registry, Tasks, Docs) theo nhu cầu (Lazy Loading),
 * giúp tối ưu ngữ cảnh, chống quá tải token trong các phiên hội thoại AI.
 */

const args = process.argv.slice(2);
const command = args[0] || '--help';

const registryPath = path.resolve(process.cwd(), 'swarm/AI_SWARM_REGISTRY.json');
const boardPath = path.resolve(process.cwd(), 'swarm/TASK_DISPATCH_BOARD.json');

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Lỗi đọc file ${filePath}:`, err.message);
    return null;
  }
}

switch (command) {
  case '--agent':
  case '-a': {
    const target = args[1];
    const registry = loadJSON(registryPath);
    if (!registry) {
      console.log('Chưa tìm thấy swarm/AI_SWARM_REGISTRY.json');
      break;
    }
    if (!target) {
      console.log('=== DANH SÁCH TÁC TỬ TRONG REGISTRY ===');
      for (const slot of registry.slot_bindings || []) {
        console.log(`[${slot.slot}] ${slot.project_assigned_id} (${slot.status}): UUID=${slot.concrete_conversation_id || 'CHƯA_GẮN'}`);
      }
    } else {
      const found = (registry.slot_bindings || []).find(
        s => s.slot === target || s.project_assigned_id === target || s.concrete_conversation_id === target
      );
      if (found) {
        console.log(JSON.stringify(found, null, 2));
      } else {
        console.log(`Không tìm thấy tác tử khớp với: "${target}"`);
      }
    }
    break;
  }

  case '--task':
  case '-t': {
    const taskId = args[1];
    const board = loadJSON(boardPath);
    if (!board) {
      console.log('Chưa tìm thấy swarm/TASK_DISPATCH_BOARD.json');
      break;
    }
    if (!taskId) {
      console.log(`=== TÁC VỤ HIỆN TẠI (Sprint: ${board.active_sprint || 'N/A'}) ===`);
      for (const t of board.tasks || []) {
        console.log(`[${t.task_id}] [${t.status}] ${t.assigned_to}: ${t.title}`);
      }
    } else {
      const found = (board.tasks || []).find(t => t.task_id === taskId);
      if (found) {
        console.log(JSON.stringify(found, null, 2));
      } else {
        console.log(`Không tìm thấy tác vụ có mã: "${taskId}"`);
      }
    }
    break;
  }

  case '--find':
  case '-f': {
    const keyword = args[1];
    if (!keyword) {
      console.log('Vui lòng nhập từ khóa tìm kiếm: node swarm-query.js --find <keyword>');
      break;
    }
    console.log(`=== TÌM KIẾM TÀI LIỆU VỚI TỪ KHÓA: "${keyword}" ===`);
    const searchDirs = ['docs', 'swarm'];
    const matched = [];

    function searchDir(dir) {
      const resolved = path.resolve(process.cwd(), dir);
      if (!fs.existsSync(resolved)) return;
      const entries = fs.readdirSync(resolved, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(resolved, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
          searchDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.json'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.toLowerCase().includes(keyword.toLowerCase())) {
            matched.push(path.relative(process.cwd(), fullPath));
          }
        }
      }
    }

    searchDirs.forEach(searchDir);
    if (matched.length === 0) {
      console.log(`Không tìm thấy tài liệu chứa "${keyword}".`);
    } else {
      matched.forEach(f => console.log(` - ${f}`));
    }
    break;
  }

  default:
    console.log('=== 🔍 SWARM LAZY QUERY ENGINE ===');
    console.log('Cách dùng:');
    console.log('  node swarm/scripts/swarm-query.js --agent [Mã vai trò/Slot/UUID]');
    console.log('  node swarm/scripts/swarm-query.js --task [Mã Task]');
    console.log('  node swarm/scripts/swarm-query.js --find <Từ khóa>');
}
