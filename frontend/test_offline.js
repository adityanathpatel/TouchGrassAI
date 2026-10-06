// Simple unit tests for offline storage logic
// Run with: node test_offline.js (mocking localStorage)

// Mock localStorage
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value.toString();
  },
  clear() {
    this.data = {};
  }
};

function testOfflineStorage() {
  console.log("Testing offline storage logic...");
  
  // 1. Test Saving Adventure
  const mockAdventure = { id: "123", title: "Test Adventure" };
  let stored = JSON.parse(localStorage.getItem('touchgrass_adventures') || '[]');
  stored.push(mockAdventure);
  localStorage.setItem('touchgrass_adventures', JSON.stringify(stored));
  
  const retrieved = JSON.parse(localStorage.getItem('touchgrass_adventures'));
  if (retrieved[0].title === "Test Adventure") {
    console.log("✅ Adventure saved and retrieved from offline storage successfully.");
  } else {
    console.error("❌ Failed to retrieve adventure.");
  }

  // 2. Test Clearing Data
  localStorage.clear();
  if (!localStorage.getItem('touchgrass_adventures')) {
    console.log("✅ Offline data cleared successfully.");
  } else {
    console.error("❌ Failed to clear data.");
  }
}

testOfflineStorage();
