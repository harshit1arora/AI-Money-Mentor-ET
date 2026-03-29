const BACKEND_URL = "http://localhost:8000";
const TEST_USER_ID = "monitor-user-" + Date.now();

const endpoints = [
  { name: "Root", url: "/", method: "GET" },
  { 
    name: "User Create", 
    url: "/user/create", 
    method: "POST", 
    body: { id: TEST_USER_ID, name: "Monitor User", age: 30 } 
  },
  { 
    name: "Finance Add", 
    url: "/finance/add", 
    method: "POST", 
    body: { user_id: TEST_USER_ID, income: 50000, expenses: 20000, savings: 30000, debt: 0 } 
  },
  { name: "Finance Score", url: `/finance/score/${TEST_USER_ID}`, method: "GET" },
  { name: "Tax Basic", url: "/tax/basic?income=1000000", method: "GET" }
];

async function runHealthCheck() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] --- Starting Connection Health Check ---`);

  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" }
      };
      if (endpoint.body) options.body = JSON.stringify(endpoint.body);

      const startTime = Date.now();
      const res = await fetch(`${BACKEND_URL}${endpoint.url}`, options);
      const duration = Date.now() - startTime;
      
      const status = res.status === 200 ? "✅ 200 OK" : `❌ ${res.status}`;
      console.log(`[${timestamp}] ${endpoint.name} (${endpoint.method} ${endpoint.url}) -> ${status} (${duration}ms)`);
      
      if (res.status !== 200) {
          const errorText = await res.text();
          console.error(`    Error Payload: ${errorText}`);
      }
    } catch (err) {
      console.error(`[${timestamp}] ${endpoint.name} -> ❌ FAILED: ${err.message}`);
    }
  }
}

// Run immediately, then every 30 seconds
runHealthCheck();
setInterval(runHealthCheck, 30000);
