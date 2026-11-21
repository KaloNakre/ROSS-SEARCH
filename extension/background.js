// ROSS-SEARCH Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log("[ROSS-SEARCH Extension] Installed successfully.");
});

// Listener for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "alive" });
  }
  return true;
});
