const { fork } = require('child_process');

console.log('🚀 Spawning backend server for testing...');
const server = fork('src/backend/server.js', [], { stdio: 'pipe' });

let testStarted = false;

function triggerTest() {
  if (testStarted) return;
  testStarted = true;
  console.log('📡 Server ready, triggering automated test suite...');
  const test = fork('src/backend/test-api.js', [], { stdio: 'inherit' });
  test.on('exit', (code) => {
    console.log(`🧹 Cleaning up server process (exit code: ${code})...`);
    server.kill();
    process.exit(code);
  });
}

server.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);
  if (str.includes('Server running on http://localhost:3000') || str.includes('CỔNG 3000 ĐÃ CÓ ỨNG DỤNG')) {
    setTimeout(triggerTest, 500);
  }
});

server.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

// Fallback trigger after 6s in case stdout wasn't caught
setTimeout(triggerTest, 6000);
