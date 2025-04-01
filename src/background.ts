//background script code for Note taker

import { groupTabs } from "./features/tabManager/groupTabs";
import { restoreSession } from "./features/tabManager/restoreSession";
import { saveSession } from "./features/tabManager/saveSession";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addNote",
    title: "Add Note from Selection",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addNote" && info.selectionText && tab?.id && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: saveSelectedNote,
      args: [info.selectionText, tab.url]
    });
  }
});

function saveSelectedNote(text: string, url: string) {
  const note = { content: text, timestamp: new Date().toISOString() };
  chrome.storage.local.get(['local'], (data) => {
    const notes = data.local || {};
    if (!notes[url]) notes[url] = [];
    notes[url].push(note);
    chrome.storage.local.set({ local: notes }, () => {
      console.log('Note added from selection');
    });
  });
}

//background script code for Productivity Tracker

let activeTab = "";
let startTime: number | null = null;

chrome.runtime.onMessage.addListener((message, __sender, sendResponse) => {
  if (message.action === "reset") {
    chrome.storage.local.set({ siteData: {} }, () => {
      console.log("Data reset in local storage.");
    });
    sendResponse({ status: "success" });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {//rmvd asyc
  if (activeTab && startTime !== null) {
    // Pass previous tab to save correctly
    saveTimeForActiveTab(activeTab);//awit
  }

  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab?.url) {
      const currentDomain = new URL(tab.url).hostname;
      console.log(`Switching from ${activeTab || "N/A"} to ${currentDomain}`);
      activeTab = currentDomain;
      startTime = Date.now();
      console.log("Tracking started for:", activeTab);
    }
  });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    saveTimeForActiveTab(activeTab);
    console.log("Browser lost focus, tracking paused.");
  } else if (!startTime && activeTab) {
    startTime = Date.now();
    console.log("Browser gained focus, resumed tracking for:", activeTab);
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
      console.warn("Elapsed time is zero or negative. Skipping.");
      return;
    }

    console.log(`Tracking time for ${tabName}: ${elapsedSeconds}s`);

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

    startTime = null; // Reset for next tab
  }
}

//background script code for Add Blocker

let isAdBlockerEnabled = true;
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isAdBlockerEnabled, blockedCount: 0, customRules: [] });
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isAdBlockerEnabled) {
    isAdBlockerEnabled = changes.isAdBlockerEnabled.newValue;
  }
});

//background script code for Tab Manager

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "groupTabs") groupTabs();
  if (message.action === "saveSession") saveSession();
  if (message.action === "restoreSession") restoreSession();
});