const axios = require('axios');

// Test 2FA endpoints
const test2FAEndpoints = async () => {
  const baseURL = 'http://localhost:3000';
  
  // console.log('🧪 Testing 2FA endpoints...\n');

  try {
    // Test 1: Check if server is running
    // console.log('1. Testing server connection...');
    const healthCheck = await axios.get(`${baseURL}/api/users`);
    // console.log('✅ Server is running\n');

    // Test 2: Check 2FA status endpoint (without auth - should fail)
    // console.log('2. Testing 2FA status endpoint (no auth)...');
    try {
      await axios.get(`${baseURL}/api/users/2fa/status`);
    } catch (err) {
      if (err.response?.status === 401) {
        // console.log('✅ 2FA status endpoint exists (correctly requires auth)\n');
      } else {
        // console.log('❌ Unexpected error:', err.response?.status);
      }
    }

    // Test 3: Check 2FA generate endpoint (without auth - should fail)
    // console.log('3. Testing 2FA generate endpoint (no auth)...');
    try {
      await axios.post(`${baseURL}/api/users/2fa/generate`);
    } catch (err) {
      if (err.response?.status === 401) {
        // console.log('✅ 2FA generate endpoint exists (correctly requires auth)\n');
      } else {
        // console.log('❌ Unexpected error:', err.response?.status);
      }
    }

    // Test 4: Check 2FA verify endpoint (without auth - should fail)
    // console.log('4. Testing 2FA verify endpoint (no auth)...');
    try {
      await axios.post(`${baseURL}/api/users/2fa/verify`, { token: '123456' });
    } catch (err) {
      if (err.response?.status === 401) {
        // console.log('✅ 2FA verify endpoint exists (correctly requires auth)\n');
      } else {
        // console.log('❌ Unexpected error:', err.response?.status);
      }
    }

    // Test 5: Check 2FA disable endpoint (without auth - should fail)
    // console.log('5. Testing 2FA disable endpoint (no auth)...');
    try {
      await axios.post(`${baseURL}/api/users/2fa/disable`, { currentPassword: 'test' });
    } catch (err) {
      if (err.response?.status === 401) {
        // console.log('✅ 2FA disable endpoint exists (correctly requires auth)\n');
      } else {
        // console.log('❌ Unexpected error:', err.response?.status);
      }
    }

    // console.log('🎉 All 2FA endpoints are accessible and properly protected!');
    // console.log('\n📋 Available 2FA endpoints:');
    // console.log('   GET  /api/users/2fa/status');
    // console.log('   POST /api/users/2fa/generate');
    // console.log('   POST /api/users/2fa/verify');
    // console.log('   POST /api/users/2fa/disable');
    // console.log('   POST /api/users/2fa/login');

  } catch (err) {
    // console.error('❌ Test failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      // console.log('\n💡 Make sure your backend server is running on port 3000');
      // console.log('   Run: cd backend && npm start');
    }
  }
};

// Run the test
test2FAEndpoints(); 