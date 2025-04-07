//background script code for Element selector
import {elementSelector} from "./bg-scripts/elementSelector"

elementSelector()

//background script code for Tab Manager
import { groupTabs, restoreSession, saveSession } from "./bg-scripts/tabManager"

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "groupTabs") groupTabs();
  if (message.action === "saveSession") saveSession();
  if (message.action === "restoreSession") restoreSession();
});

//background script code for Note taker
import { noteTaker } from "./bg-scripts/noteTaker";

noteTaker()

//background script code for Productivity Tracker

let activeTab = "";
let startTime: number | null = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeTab && startTime !== null) {
    saveTimeForActiveTab(activeTab);
  }

  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab?.url) {
      const currentDomain = new URL(tab.url).hostname;
      activeTab = currentDomain;
      startTime = Date.now();
    }
  });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    saveTimeForActiveTab(activeTab);
  } else if (!startTime && activeTab) {
    startTime = Date.now();
  }
});

chrome.tabs.onRemoved.addListener(() => {
  saveTimeForActiveTab(activeTab);
});

async function saveTimeForActiveTab(tabName: string) {
  if (tabName && startTime !== null) {
    const endTime = Date.now();
    const elapsedSeconds = Math.floor((endTime - startTime) / 1000);

    if (elapsedSeconds <= 0) {
      return;
    }

    chrome.storage.local.get("siteData", async (data) => {
      const siteData = data.siteData || {};
      siteData[tabName] = (siteData[tabName] || 0) + elapsedSeconds;

      chrome.storage.local.set({ siteData }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving siteData:", chrome.runtime.lastError);
        } else {
          console.log("Updated siteData:", siteData);
        }
      });
    });

    startTime = null;
  }
}



