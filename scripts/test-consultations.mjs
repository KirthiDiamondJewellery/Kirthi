async function testConsultationEndpoint() {
  console.log('Testing /api/consultation endpoint connectivity...');
  
  const mockPayload = {
    category: "Test Category",
    style: "Test Style",
    metal: "18K Gold",
    budget: "Under 5L",
    occasion: "Testing",
    name: "Automated Test User",
    email: "test@example.com",
    phone: "1234567890",
    message: "This is an automated test for endpoint connectivity.",
    attachment: ""
  };

  try {
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockPayload)
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Endpoint connectivity test PASSED');
      process.exit(0);
    } else {
      console.error('❌ Endpoint connectivity test FAILED: endpoint returned error status or false success flag.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Endpoint connectivity test FAILED: Could not reach endpoint.', err);
    process.exit(1);
  }
}

testConsultationEndpoint();
