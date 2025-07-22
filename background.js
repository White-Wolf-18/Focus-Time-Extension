chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBlockList") {
    chrome.storage.local.get("allowedSites", ({ allowedSites }) => {
      const rules = [];
      const removeIds = [];

      allowedSites = allowedSites || [];

      // First rule blocks everything by default
      rules.push({
        id: 999,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: "*",
          resourceTypes: ["main_frame"]
        }
      });

      // Allow only listed sites
      allowedSites.forEach((site, index) => {
        const id = 1000 + index;
        removeIds.push(id);
        rules.push({
          id,
          priority: 2,
          action: { type: "allow" },
          condition: {
            urlFilter: `||${site}.com`,
            resourceTypes: ["main_frame"]
          }
        });
      });

      // Remove old rules, then apply new
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: removeIds.concat([999]), // remove all, including block-all rule
        addRules: rules
      });
    });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});
