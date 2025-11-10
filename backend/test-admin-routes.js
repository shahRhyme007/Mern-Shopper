const axios = require('axios');

async function testAdminRoutes() {
    try {
        console.log('\n🧪 Testing admin login endpoint...');
        
        const loginResponse = await axios.post('http://localhost:4000/admin/login', {
            email: 'admin@shopper.com',
            password: 'admin123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Admin login successful!');
        console.log('Response:', loginResponse.data);
        
    } catch (error) {
        console.error('❌ Admin login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testAdminRoutes();
