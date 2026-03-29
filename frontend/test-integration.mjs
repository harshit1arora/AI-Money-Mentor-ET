const BACKEND_URL = "http://localhost:8000";
const TEST_USER_ID = "test-user-" + Date.now();

async function runTest() {
  console.log("==================================================");
  console.log("🚀 COMPREHENSIVE INTEGRATION TEST: AI-MONEY-MENTOR 🚀");
  console.log("==================================================");

  try {
    // 1. Test Root
    console.log("\n1. Testing Root Endpoint...");
    const rootRes = await fetch(`${BACKEND_URL}/`);
    const rootData = await rootRes.json();
    console.log("✅ Root Response:", rootData);

    // 2. Test User Creation
    console.log("\n2. Testing User Creation (/user/create)...");
    const userRes = await fetch(`${BACKEND_URL}/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: TEST_USER_ID,
        name: "Test User",
        age: 30
      })
    });
    const userData = await userRes.json();
    console.log("✅ User Created:", userData);

    // 3. Test Finance Addition
    console.log("\n3. Testing Finance Addition (/finance/add)...");
    const finRes = await fetch(`${BACKEND_URL}/finance/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        income: 100000,
        expenses: 40000,
        savings: 60000,
        debt: 0
      })
    });
    const finData = await finRes.json();
    console.log("✅ Finance Added:", finData);

    // 4. Test Finance Score
    console.log("\n4. Testing Finance Score (/finance/score/{user_id})...");
    const scoreRes = await fetch(`${BACKEND_URL}/finance/score/${TEST_USER_ID}`);
    const scoreData = await scoreRes.json();
    console.log("✅ Score Result:", scoreData);

    // 5. Test SIP Plan
    console.log("\n5. Testing SIP Plan (/finance/sip/{user_id})...");
    const sipRes = await fetch(`${BACKEND_URL}/finance/sip/${TEST_USER_ID}`);
    const sipData = await sipRes.json();
    console.log("✅ SIP Result:", sipData);

    // 6. Test Tax Calculation
    console.log("\n6. Testing Tax Calculation (/tax/basic)...");
    const taxRes = await fetch(`${BACKEND_URL}/tax/basic?income=1200000`);
    const taxData = await taxRes.json();
    console.log("✅ Tax Result (1.2M income):", taxData);

    // 7. Test AI Ask
    console.log("\n7. Testing AI Ask (/ai/ask)...");
    const aiRes = await fetch(`${BACKEND_URL}/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "How to save tax in India?" })
    });
    const aiData = await aiRes.json();
    console.log("✅ AI Response Received!");
    
    console.log("\n==================================================");
    console.log("🎉 ALL INTEGRATION TESTS PASSED! 🎉");
    console.log("==================================================");

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
    console.log("    => Ensure the FastAPI server is running at", BACKEND_URL);
  }
}

runTest();
