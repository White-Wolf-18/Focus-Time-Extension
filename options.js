// Save to chrome.storage
function saveSite(site) {
  chrome.storage.sync.get("blocklist", (data) => {
    let list = data.blocklist || [];
    list.push(site);
    chrome.storage.sync.set({ blocklist: list });
  });
}
