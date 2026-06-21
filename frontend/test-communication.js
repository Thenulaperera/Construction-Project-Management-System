// Simple test script for Communication module
// Run this with: node test-communication.js

const API_BASE = 'http://localhost:8080/api/messages';

async function testCommunicationModule() {
    console.log('🧪 Testing Communication & Collaboration Module...\n');

    try {
        // Test 1: Create a new message
        console.log('1️⃣ Testing message creation...');
        const newMessage = {
            senderName: "Test User",
            content: "Hello! This is a test message for the communication module.",
            recipientName: "Admin",
            messageType: "DIRECT"
        };

        const createResponse = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMessage)
        });

        if (!createResponse.ok) {
            throw new Error(`Create failed: ${createResponse.status}`);
        }

        const createdMessage = await createResponse.json();
        console.log('✅ Message created successfully:', createdMessage.id);
        const messageId = createdMessage.id;

        // Test 2: Get all messages
        console.log('\n2️⃣ Testing message retrieval...');
        const getResponse = await fetch(API_BASE);
        if (!getResponse.ok) {
            throw new Error(`Get failed: ${getResponse.status}`);
        }

        const messages = await getResponse.json();
        console.log(`✅ Retrieved ${messages.length} messages`);

        // Test 3: Update the message
        console.log('\n3️⃣ Testing message update...');
        const updatedMessage = {
            content: "This message has been updated!",
            recipientName: "Admin",
            messageType: "ANNOUNCEMENT"
        };

        const updateResponse = await fetch(`${API_BASE}/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMessage)
        });

        if (!updateResponse.ok) {
            throw new Error(`Update failed: ${updateResponse.status}`);
        }

        const updated = await updateResponse.json();
        console.log('✅ Message updated successfully');

        // Test 4: Search messages
        console.log('\n4️⃣ Testing message search...');
        const searchResponse = await fetch(`${API_BASE}/search?query=test`);
        if (!searchResponse.ok) {
            throw new Error(`Search failed: ${searchResponse.status}`);
        }

        const searchResults = await searchResponse.json();
        console.log(`✅ Search returned ${searchResults.length} results`);

        // Test 5: Mark message as read
        console.log('\n5️⃣ Testing mark as read...');
        const readResponse = await fetch(`${API_BASE}/${messageId}/read`, {
            method: 'PUT'
        });

        if (!readResponse.ok) {
            throw new Error(`Mark as read failed: ${readResponse.status}`);
        }

        console.log('✅ Message marked as read');

        // Test 6: Delete the message
        console.log('\n6️⃣ Testing message deletion...');
        const deleteResponse = await fetch(`${API_BASE}/${messageId}`, {
            method: 'DELETE'
        });

        if (!deleteResponse.ok) {
            throw new Error(`Delete failed: ${deleteResponse.status}`);
        }

        console.log('✅ Message deleted successfully');

        console.log('\n🎉 All tests passed! Communication module is working correctly.');
        console.log('\n📋 Summary:');
        console.log('   ✅ Create Message (POST)');
        console.log('   ✅ Read Messages (GET)');
        console.log('   ✅ Update Message (PUT)');
        console.log('   ✅ Delete Message (DELETE)');
        console.log('   ✅ Search Messages');
        console.log('   ✅ Mark as Read');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure the backend server is running on http://localhost:8080');
        console.log('   Start the backend with: cd backend && mvn spring-boot:run');
    }
}

// Run the tests
testCommunicationModule();
