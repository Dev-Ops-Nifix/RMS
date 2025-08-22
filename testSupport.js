const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/support';

const testSupportSystem = async () => {
  try {
    console.log('Testing Support System...\n');
    
    // Test 1: Get FAQs
    console.log('1. Testing FAQ retrieval...');
    const faqResponse = await axios.get(`${BASE_URL}/faq`);
    console.log(`✓ FAQs retrieved: ${faqResponse.data.faqs.length} items\n`);
    
    // Test 2: Create Support Ticket
    console.log('2. Testing ticket creation...');
    const ticketData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Support Ticket',
      message: 'This is a test support ticket',
      priority: 'medium'
    };
    
    const ticketResponse = await axios.post(`${BASE_URL}/tickets`, ticketData);
    console.log(`✓ Ticket created: ${ticketResponse.data.ticket.ticketId}\n`);
    
    // Test 3: Get Resources
    console.log('3. Testing resource retrieval...');
    const docResponse = await axios.get(`${BASE_URL}/resources/documentation`);
    console.log(`✓ Documentation resources: ${docResponse.data.resources.length} items`);
    
    const tutorialResponse = await axios.get(`${BASE_URL}/resources/tutorial`);
    console.log(`✓ Tutorial resources: ${tutorialResponse.data.resources.length} items`);
    
    const brochureResponse = await axios.get(`${BASE_URL}/resources/brochure`);
    console.log(`✓ Brochure resources: ${brochureResponse.data.resources.length} items\n`);
    
    console.log('All tests passed! ✅');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

// Run tests only if this file is executed directly
if (require.main === module) {
  testSupportSystem();
}

module.exports = testSupportSystem;