export const restoreSession=()=> {
    chrome.storage.local.get("savedSession", (data) => {
      if (data.savedSession) {
        data.savedSession.forEach((tab: { url: string; pinned: boolean }) => {
          chrome.tabs.create({ url: tab.url, pinned: tab.pinned });
        });
      }
    });
  }