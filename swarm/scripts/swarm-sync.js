import fs from 'fs';
import path from 'path';

const boardPath = path.resolve(process.cwd(), 'swarm/TASK_DISPATCH_BOARD.json');

function loadBoard() {
  if (!fs.existsSync(boardPath)) {
    console.error('Dispatch board not found:', boardPath);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(boardPath, 'utf8'));
}

function saveBoard(board) {
  board.last_updated = new Date().toISOString();
  fs.writeFileSync(boardPath, JSON.stringify(board, null, 2), 'utf8');
}

const args = process.argv.slice(2);
const command = args[0] || '--status';

const board = loadBoard();

switch (command) {
  case '--status':
    console.log('=== BẢNG ĐIỀU PHỐI BIỆT ĐỘI AI SWARM HDD ERP ===');
    console.log(`Cập nhật: ${board.last_updated} | Sprint: ${board.active_sprint}\n`);
    for (const t of board.tasks) {
      console.log(`[${t.task_id}] [${t.status}] Phân hệ: ${t.module}`);
      console.log(`  Tiêu đề: ${t.title}`);
      console.log(`  Người phụ trách: ${t.assigned_to} -> Bàn giao tiếp theo: ${t.handoff_to || 'None'}`);
      console.log(`  Hành động kế tiếp: ${t.next_action || 'None'}\n`);
    }
    break;

  case '--claim': {
    const agent = args[1];
    if (!agent) {
      console.error('Vui lòng chỉ định mã Agent: node swarm-sync.js --claim AI-1A');
      process.exit(1);
    }
    const myTask = board.tasks.find(t => t.assigned_to === agent && t.status !== 'DEPLOYED_LIVE');
    if (!myTask) {
      console.log(`Không có tác vụ nào đang chờ cho ${agent}.`);
    } else {
      myTask.status = 'IN_PROGRESS';
      saveBoard(board);
      console.log(`Agent [${agent}] đã nhận tác vụ [${myTask.task_id}]: "${myTask.title}"`);
    }
    break;
  }

  case '--handoff': {
    const taskId = args[1];
    const nextAgent = args[2];
    const task = board.tasks.find(t => t.task_id === taskId);
    if (!task) {
      console.error(`Không tìm thấy task ${taskId}`);
      process.exit(1);
    }
    task.status = 'READY_FOR_AUDIT';
    task.assigned_to = nextAgent || task.handoff_to;
    saveBoard(board);
    console.log(`Đã chuyển giao [${taskId}] sang cho [${task.assigned_to}] kiểm toán & tiếp nhận!`);
    break;
  }

  default:
    console.log('Lệnh không hỗ trợ. Sử dụng: --status, --claim <Agent>, --handoff <TaskId> <NextAgent>');
}
