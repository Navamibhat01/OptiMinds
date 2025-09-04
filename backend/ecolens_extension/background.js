const API_URL = "http://localhost:8000/analyze"; // Use localhost instead of 127.0.0.1

// 1. Open side panel when icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 2. Handle analyzeProduct messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeProduct") {
    console.log("🌱 Background script received URL:", request.url);

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: request.url })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Data received from API:", data);
        sendResponse({ status: "success", data });
      })
      .catch((error) => {
        console.error("❌ Error fetching from API:", error);

        // Fallback dummy data for testing
        sendResponse({
          status: "success",
          data: {
            score: 6,
            alternatives: [
              { name: "Reusable Bottle", score: 9 },
              { name: "Eco Bag", score: 8 }
            ]
          }
        });
      });

    return true; // Keeps the message channel open for async response
  }
});

