/**
 * HDD FOOD - Backend Automated Test Suite
 * Validates all REST API endpoints and data consistency
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=======================================================');
  console.log('🧪 RUNNING HDD FOOD BACKEND TEST SUITE (API & DATA VERIFICATION)');
  console.log('=======================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: GET /api/health
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    assert(healthRes.data && healthRes.data.status === 'ok', 'Health status is "ok"');
    assert(healthRes.data && healthRes.data.mysql, 'Health reports MySQL status');
    console.log(`     MySQL Mode: ${healthRes.data.mysql.mode}`);

    // TEST 2: GET /api/products
    console.log('\n--- 2. Testing GET /api/products ---');
    const prodRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET'
    });
    assert(prodRes.status === 200, 'Products endpoint responds with 200 OK');
    assert(prodRes.data && prodRes.data.count >= 4, `Returned ${prodRes.data.count} standard SKUs (>= 4)`);
    const tenderloin = prodRes.data.data.find(p => p.SKU === 'TP-BO-TENDER-MB2');
    assert(tenderloin !== undefined, 'Tenderloin MB2+ found in product catalog');
    assert(tenderloin && tenderloin.suggested_price > tenderloin.cost_price, 'Suggested price properly calculated from DesiredMarginPct');

    // TEST 2b: GET /api/products with search & margin query
    console.log('\n--- 2b. Testing GET /api/products?search=Ribeye&margin=30 ---');
    const filterRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products?search=Ribeye&margin=30',
      method: 'GET'
    });
    assert(filterRes.status === 200, 'Search filter query responds with 200 OK');
    assert(filterRes.data.count === 1, 'Search properly isolates single SKU');
    const ribeye = filterRes.data.data[0];
    const expectedSuggested = Math.round(ribeye.cost_price * 1.30);
    assert(ribeye.suggested_price === expectedSuggested, `Dynamic margin 30% applied accurately (${ribeye.suggested_price} === ${expectedSuggested})`);

    // TEST 3: GET /api/expiring-warnings
    console.log('\n--- 3. Testing GET /api/expiring-warnings ---');
    const expRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/expiring-warnings',
      method: 'GET'
    });
    assert(expRes.status === 200, 'Expiring warnings endpoint responds with 200 OK');
    assert(expRes.data && expRes.data.count >= 3, `Found ${expRes.data.count} batches within 30-day expiration window`);
    assert(expRes.data.data[0].DaysRemaining <= expRes.data.data[1].DaysRemaining, 'Batches correctly sorted by DaysRemaining ascending');

    // TEST 4: POST /api/extract-quote (Smart Zalo Quote Parser)
    console.log('\n--- 4. Testing POST /api/extract-quote ---');
    const sampleZaloText = `[Zalo Midfield Meat Australia - 28/10/2026]
Dạ em gửi bên HDD Food bảng giá thịt bò nhập khẩu Chilled hàng air mới về:
1. Chilled Tenderloin Angus MB2+ (Thăn nội bò Úc) - SL: 25.5 kg - Giá: 855.000 đ/kg
2. Chilled Striploin Angus MB3+ (Thăn ngoại bò Úc) - SL: 40.0 kg - Giá: 625.000 đ/kg
Số lô: BATCH-202610-01 - Hóa đơn VAT: INV-202610-104.`;

    const extractRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/extract-quote',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { rawText: sampleZaloText });

    assert(extractRes.status === 200, 'Extract quote endpoint responds with 200 OK');
    assert(extractRes.data && extractRes.data.success === true, 'Extraction marked as success');
    assert(extractRes.data.items && extractRes.data.items.length === 2, `Correctly parsed 2 items from text: ${extractRes.data.items.length}`);
    const parsedItem1 = extractRes.data.items[0];
    assert(parsedItem1.SKU === 'TP-BO-TENDER-MB2', 'Correctly mapped item to SKU TP-BO-TENDER-MB2');
    assert(parsedItem1.newPrice === 855000, `Parsed new price 855,000 correctly (got ${parsedItem1.newPrice})`);
    assert(parsedItem1.diffPrice !== undefined && parsedItem1.diffPct !== undefined, 'Computed price difference and percentage fluctuation');

    // TEST 5: POST /api/commit-quote
    console.log('\n--- 5. Testing POST /api/commit-quote ---');
    const commitPayload = {
      items: [
        {
          SKU: 'TP-BO-TENDER-MB2',
          rawProductName: 'Chilled Tenderloin Angus MB2+',
          quantity: 25.5,
          newPrice: 855000,
          confidence: 99.4
        }
      ],
      supplierName: 'Midfield Meat Australia',
      receiptRef: 'INV-202610-104',
      effectiveDate: '2026-10-28',
      sourceType: 'OCR_INVOICE'
    };

    const commitRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/commit-quote',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, commitPayload);

    assert(commitRes.status === 200, 'Commit quote endpoint responds with 200 OK');
    assert(commitRes.data && commitRes.data.committedCount === 1, 'Committed 1 record successfully');

    // Verify product price updated in database
    const verifyProd = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products?search=TENDER',
      method: 'GET'
    });
    const updatedProd = verifyProd.data.data[0];
    assert(updatedProd.cost_price === 855000, `Product cost_price updated to 855,000 (previous: ${updatedProd.previous_cost_price})`);

    // TEST 6: GET /api/price-history
    console.log('\n--- 6. Testing GET /api/price-history ---');
    const histRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/price-history',
      method: 'GET'
    });
    assert(histRes.status === 200, 'Price history endpoint responds with 200 OK');
    assert(histRes.data && histRes.data.count > 0, `Price history records retrieved: ${histRes.data.count}`);
    const latestHist = histRes.data.data[0];
    assert(latestHist.SKU === 'TP-BO-TENDER-MB2' && latestHist.UnitPrice === 855000, 'Latest price history entry matches committed quote');

    // SUMMARY
    console.log('\n=======================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('=======================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
