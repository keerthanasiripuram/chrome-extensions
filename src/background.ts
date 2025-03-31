let isAdBlockerEnabled = true;
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isAdBlockerEnabled, blockedCount: 0, customRules: [] });
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isAdBlockerEnabled) {
    isAdBlockerEnabled = changes.isAdBlockerEnabled.newValue;
  }
});

// let siteData: Record<string, number> = {};
// var bgTime=0
// let activeTab: string = "";
// let startTime: number | null = null;
// console.log("bg")
// chrome.tabs.onActivated.addListener((activeInfo) => {
//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     bgTime++
//     console.log("no of times bg called",bgTime)
//     console.log(tab)
//     if (activeTab && startTime) {
//       console.log(activeTab)
//       const endTime = Date.now();
//       console.log("times",startTime,endTime, Date.now())
//       const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
//       console.log(endTime,elapsedSeconds)
//       chrome.storage.local.get('siteData', (data) => {
//         const siteData: Record<string, number> = data.siteData || {};
//         siteData[activeTab] = (siteData[activeTab] || 0) + elapsedSeconds;
//         chrome.storage.local.set({ siteData });
//         console.log(siteData)
//       });
//     }

//     if (tab.url) {
//       activeTab = new URL(tab.url).hostname;
//       startTime = Date.now();
//       console.log("first",activeTab,startTime)
//     } else {
//       activeTab = "Unknown";
//       startTime = null;
//     }
//   });
// });


//failed cde

// let siteData: Record<string, number> = {};
// let activeTab: string = "";
// let startTime: number | null = null;

// function saveTimeForActiveTab() {
//   if (activeTab && startTime) {
//     const endTime = Date.now();
//     const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
//     chrome.storage.local.get('siteData', (data) => {
//       const siteData = data.siteData || {};
//       siteData[activeTab] = (siteData[activeTab] || 0) + elapsedSeconds;
//       chrome.storage.local.set({ siteData });
//       console.log("Updated siteData:", siteData);
//     });
//     startTime = null; 
//   }
// }

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   saveTimeForActiveTab();
  
//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     if (tab?.url) {
//       activeTab = new URL(tab.url).hostname;
//       startTime = Date.now();
//       console.log("Tracking started for:", activeTab);
//     } else {
//       activeTab = "Unknown";
//       startTime = null;
//     }
//   });
// });

// // Track focus changes to pause tracking when inactive
// chrome.windows.onFocusChanged.addListener((windowId) => {
//   if (windowId === chrome.windows.WINDOW_ID_NONE) {
//     saveTimeForActiveTab();
//     console.log("Browser lost focus, tracking paused.");
//   } else if (startTime === null && activeTab) {
//     startTime = Date.now();
//     console.log("Browser gained focus, resumed tracking for:", activeTab);
//   }
// });

// // Save time if a tab is closed
// chrome.tabs.onRemoved.addListener(() => {
//   saveTimeForActiveTab();
// });

//undrstd cde bt test failed

// let activeTab = "";
// let startTime: number | null = null;

// function saveTimeForActiveTab() {
//   if (activeTab && startTime !== null) {
//     const endTime = Date.now();
//     const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
//     console.log(startTime,endTime, (endTime-startTime))
//     // Avoid negative time
//     if (elapsedSeconds < 0) return;

//     chrome.storage.local.get("siteData", (data) => {
//       console.log("Current siteData before update:", data.siteData);
//       const siteData = data.siteData || {};
//       siteData[activeTab] = (siteData[activeTab] || 0) + elapsedSeconds;
//       chrome.storage.local.set({ siteData });
//       console.log("Updated siteData:", siteData);
//     });

//     startTime = null;
//   }
// }

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   saveTimeForActiveTab();

//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     console.log("Tab URL fetched:", tab?.url);

//     if (tab?.url) {
//       const currentDomain = new URL(tab.url).hostname;
//       console.log("Switching to:", currentDomain);
//       // Reset start time for new tab
//       if (activeTab !== currentDomain) {
//         activeTab = currentDomain;
//         startTime = Date.now();
//         console.log("Tracking started for:", activeTab);
//       }
//     } else {
//       activeTab = "Unknown";
//       startTime = null;
//     }
//   });
// });

// // Track focus changes to pause tracking when inactive
// chrome.windows.onFocusChanged.addListener((windowId) => {
//     // Check if no Chrome window is currently focused

//   if (windowId === chrome.windows.WINDOW_ID_NONE) {
//     saveTimeForActiveTab();
//     console.log("Browser lost focus, tracking paused.");
//   } else if (!startTime && activeTab) {   // When Chrome window regains focus
//     startTime = Date.now();// Resume time tracking from now
//     console.log("Browser gained focus, resumed tracking for:", activeTab);
//   }
// });

// // Save time if a tab is closed
// chrome.tabs.onRemoved.addListener(() => {
//   console.log
//   saveTimeForActiveTab();
// });

// let activeTab = "";
// let startTime: number | null = null;


// function saveTimeForActiveTab() {
//   if (activeTab && startTime !== null) {
//     const endTime = Date.now();
//     const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
//     console.log(startTime,endTime,(endTime-startTime))
//     if (elapsedSeconds < 0) return; // Prevent invalid times
//     console.log(startTime,endTime,(endTime-startTime))
//     chrome.storage.local.get("siteData", (data) => {
//       const siteData = data.siteData || {};
//       siteData[activeTab] = (siteData[activeTab] || 0) + elapsedSeconds;
//       chrome.storage.local.set({ siteData });
//       console.log(`Updated siteData for ${activeTab}:`, siteData);
//     });

//     startTime = null;
//   }
// }

// async function saveTimeForActiveTab() {
//   if (activeTab && startTime !== null) {
//     const endTime = Date.now();
//     const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
//     console.log(startTime,endTime, (endTime-startTime))
//     console.log("activetab",activeTab)
//     // Avoid negative time
//     // if (elapsedSeconds < 0) return;    
//     await chrome.storage.local.get("siteData", async (data) => {
//       console.log("Current siteData before update:", data.siteData || {});
//       const siteData = data.siteData || {};
      
//       // Ensure activeTab is valid
//       if (!activeTab) {
//         console.warn("No active tab found during save!");
//         return;
//       }
    
//       siteData[activeTab] = (siteData[activeTab] || 0) + elapsedSeconds;
      
//       await chrome.storage.local.set({ siteData }, () => {
//         if (chrome.runtime.lastError) {
//           console.error("Error saving siteData:", chrome.runtime.lastError);
//         } else {
//           console.log("Updated siteData:", siteData);
//         }
//       });
//     });
    
//     startTime = null;
//   }
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "reset") {
//     chrome.storage.local.set({ siteData: {} }, () => {
//       console.log("Data reset in local storage.");
//     });
//     sendResponse({ status: "success" });
//   }
// });


// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   if (activeTab) {
//    await saveTimeForActiveTab();
//   }

//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     if (tab?.url) {
//       const currentDomain = new URL(tab.url).hostname;
//       console.log("Switching to:", currentDomain);

//       if (activeTab !== currentDomain) {
//         activeTab = currentDomain;
//         startTime = Date.now(); // Start tracking for the new tab
//         console.log("Tracking started for:", activeTab);
//       }
//     }
//   });
// });

// chrome.windows.onFocusChanged.addListener((windowId) => {
//   if (windowId === chrome.windows.WINDOW_ID_NONE) {
//     saveTimeForActiveTab();
//     console.log("Browser lost focus, tracking paused.");
//   } else if (!startTime && activeTab) {
//     startTime = Date.now(); // Resume tracking
//     console.log("Browser gained focus, resumed tracking for:", activeTab);
//   }
// });

// chrome.tabs.onRemoved.addListener(() => {
//   saveTimeForActiveTab();
// });

//modified versin calctn crct bt store updtn is wrng

// let activeTab = "";
// let startTime: number | null = null;

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "reset") {
//     chrome.storage.local.set({ siteData: {} }, () => {
//       console.log("Data reset in local storage.");
//     });
//     sendResponse({ status: "success" });
//   }
// });

// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   // Save time for the previous tab before switching
//   if (activeTab && startTime !== null) {
//     await saveTimeForActiveTab();
//   }

//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//     if (tab?.url) {
//       const currentDomain = new URL(tab.url).hostname;

//       if (activeTab !== currentDomain) {
//         console.log(`Switching from ${activeTab || "N/A"} to ${currentDomain}`);
//         activeTab = currentDomain;
//         startTime = Date.now();
//         console.log("Tracking started for:", activeTab);
//       }
//     }
//   });
// });

// chrome.windows.onFocusChanged.addListener((windowId) => {
//   if (windowId === chrome.windows.WINDOW_ID_NONE) {
//     saveTimeForActiveTab();
//     console.log("Browser lost focus, tracking paused.");
//   } else if (!startTime && activeTab) {
//     startTime = Date.now();
//     console.log("Browser gained focus, resumed tracking for:", activeTab);
//   }
// });

// chrome.tabs.onRemoved.addListener(() => {
//   saveTimeForActiveTab();
// });

// async function saveTimeForActiveTab() {
//   if (activeTab && startTime !== null) {
//     const endTime = Date.now();
//     const elapsedSeconds = Math.floor((endTime - startTime) / 1000);

//     if (elapsedSeconds <= 0) {
//       console.warn("Elapsed time is zero or negative. Skipping.");
//       return;
//     }

//     console.log(`Tracking time for ${activeTab}: ${elapsedSeconds}s`);

//     await chrome.storage.local.get("siteData", async (data) => {
//       const siteData = data.siteData || {};
//       siteData[activeTab] = (siteData[activeTab] || 0) + elapsedSeconds;

//       await chrome.storage.local.set({ siteData }, () => {
//         if (chrome.runtime.lastError) {
//           console.error("Error saving siteData:", chrome.runtime.lastError);
//         } else {
//           console.log("Updated siteData:", siteData);
//         }
//       });
//     });

//     startTime = null; // Reset the time for the next tab
//   }
// }


//mofifed cde
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

chrome.tabs.onActivated.addListener( (activeInfo) => {//rmvd asyc
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


  //note taker
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