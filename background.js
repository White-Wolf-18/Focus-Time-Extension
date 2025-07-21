chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBlockList") {
    chrome.storage.local.get("blockedSites", ({ blockedSites }) => {
      const rules = [];
      const removeIds = [];

      blockedSites = blockedSites || [];

      // Create rules for each domain
      blockedSites.forEach((site, index) => {
        const id = 1000 + index;
        removeIds.push(id);
        rules.push({
          id,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: `||${site}.com`,
            resourceTypes: ["main_frame"]
          }
        });
      });

      // Remove old rules, then add new ones
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: removeIds,
        addRules: rules
      });
    });
  }
});


chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});
