
export const  saveSession=()=> {
    chrome.tabs.query({}, (tabs) => {
      const session = tabs.map((tab) => {
        console.log(tab);
        return { url: tab.url, pinned: tab.pinned };
      });
      chrome.storage.local.set({ savedSession: session }, () => { });
    });
  }