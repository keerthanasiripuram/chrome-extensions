// chrome.storage.local.get(["isAdBlockerEnabled", "customRules"], ({ isAdBlockerEnabled, customRules }) => {
//     console.log("content",isAdBlockerEnabled)
//     if (!isAdBlockerEnabled) return;
  
//     const adSelectors = [
//       "iframe[src*='ads']",
//       "div[id*='ads']",
//       "div[class*='ad']",
//       ...customRules.map((rule: { selector: any; }) => rule.selector)
//     ];
  
//     const observer = new MutationObserver(() => {
//       adSelectors.forEach((selector) => {
//         document.querySelectorAll(selector).forEach((ad) => {
//           ad.remove();
//           chrome.storage.local.get("blockedCount", (data) => {
//             chrome.storage.local.set({ blockedCount: (data.blockedCount || 0) + 1 });
//           });
//         });
//       });
//     });
  
//     observer.observe(document.body, { childList: true, subtree: true });
//   });

//2nd apprch

// let isAdBlockerEnabled = true;
// let observer: MutationObserver;

// function highlightAds() {
//   chrome.storage.local.get("customRules", ({ customRules }) => {
//     const adSelectors = [
//       "iframe[src*='ads']",
//       "div[id*='ads']",
//       "div[class*='ad']",
//       ...customRules.map((rule: { selector: any; }) => rule.selector),
//     ];

//     adSelectors.forEach((selector) => {
//       document.querySelectorAll(selector).forEach((ad) => {
//         ad.style.border = "3px solid red";
//         ad.style.opacity = "0.5";
//         ad.style.pointerEvents = "none";
//       });
//     });
//   });
// }

// function removeHighlights() {
//     document.querySelectorAll("iframe[src*='ads'], div[id*='ads'], div[class*='ad']").forEach((ad) => {
//       ad.classList.remove('highlighted-ad');
//     });
//   }
  

// function initAdBlocker() {
//   if (observer) observer.disconnect(); // Ensure previous observer is disconnected

//   chrome.storage.local.get(["isAdBlockerEnabled", "customRules"], ({ isAdBlockerEnabled, customRules }) => {
//     console.log("AdBlocker Status:", isAdBlockerEnabled);
    
//     if (!isAdBlockerEnabled) {
//       removeHighlights();
//       return;
//     }

//     const adSelectors = [
//       "iframe[src*='ads']",
//       "div[id*='ads']",
//       "div[class*='ad']",
//       ...customRules.map((rule: { selector: any; }) => rule.selector),
//     ];

//     // Highlight existing ads immediately
//     highlightAds();

//     observer = new MutationObserver(() => {
//       highlightAds(); // Apply highlights to dynamically loaded ads
//       adSelectors.forEach((selector) => {
//         document.querySelectorAll(selector).forEach((ad) => {
//           chrome.storage.local.get("blockedCount", (data) => {
//             chrome.storage.local.set({ blockedCount: (data.blockedCount || 0) + 1 });
//           });
//         });
//       });
//     });

//     observer.observe(document.body, { childList: true, subtree: true });
//   });
// }

// // Listen for changes in ad blocker state
// chrome.storage.onChanged.addListener((changes) => {
//   if (changes.isAdBlockerEnabled) {
//     isAdBlockerEnabled = changes.isAdBlockerEnabled.newValue;
//     if (isAdBlockerEnabled) {
//       console.log("Enabling Ad Blocker...");
//       initAdBlocker();
//     } else {
//       console.log("Disabling Ad Blocker...");
//       removeHighlights();
//       if (observer) observer.disconnect();
//     }
//   }
// });

// // Initialize when content script loads
// initAdBlocker();


//without mutation  color fine

// function highlightAds() {
//     chrome.storage.local.get(["isAdBlockerEnabled", "customRules"], ({ isAdBlockerEnabled, customRules }) => {
//       if (!isAdBlockerEnabled) return;
    
//       const adSelectors = [
//         "iframe[src*='ads']",
//         "div[id*='ads']",
//         "div[class*='ad']",
//         ...(customRules || []).map((rule: { selector: any; }) => rule.selector),
//       ];
  
//       adSelectors.forEach((selector) => {
//         document.querySelectorAll(selector).forEach((ad) => {
//           ad.style.border = "3px solid red";
//           ad.style.opacity = "0.4";
//           ad.style.pointerEvents = "none";
//         });
//       });
//     });
//   }


//     function removeHighlights() {
//         console.log("Removing highlights...");
        
//         const allAds = document.querySelectorAll("iframe[src*='ads'], div[id*='ads'], div[class*='ad']");
        
//         allAds.forEach((ad) => {
//           const element = ad as HTMLElement;
//           if (element.style) {
//             element.style.border = "";
//             element.style.opacity = "";
//             element.style.pointerEvents = "";
//           }
//         });
//       }
      


  
//   chrome.storage.local.get("isAdBlockerEnabled", ({ isAdBlockerEnabled }) => {
//     if (isAdBlockerEnabled) {
//       highlightAds();
//     } else {
//       removeHighlights();
//     }
//   });
  
//   chrome.storage.onChanged.addListener((changes) => {
//     if (changes.isAdBlockerEnabled) {
//       if (changes.isAdBlockerEnabled.newValue) {
//         highlightAds();
//       } else {
//         removeHighlights();
//       }
//     }
//   });
  
//wrkng code

// function highlightAds() {
//     chrome.storage.local.get(["isAdBlockerEnabled", "customRules", "blockedCount"], ({ isAdBlockerEnabled, customRules, blockedCount = 0 }) => {
//       if (!isAdBlockerEnabled) return;
  
//       const adSelectors = [
//         "iframe[src*='ads']",
//         "div[id*='ads']",
//         "div[class*='ad']",
//         ...(customRules || []).map((rule: { selector: any; }) => rule.selector),
//       ];
  
//       let detectedAds = 0;
  
//       adSelectors.forEach((selector) => {
//         const ads = document.querySelectorAll(selector);
//         detectedAds += ads.length; // Track number of ads detected
//         ads.forEach((ad) => {
//           ad.style.border = "3px solid red";
//           ad.style.opacity = "0.4";
//           ad.style.pointerEvents = "none";
//         });
//       });
  
//       if (detectedAds > 0) {
//         const newBlockedCount = blockedCount + detectedAds;
//         chrome.storage.local.set({ blockedCount: newBlockedCount }, () => {
//           console.log(`Blocked Ads Count Updated: ${newBlockedCount}`);
//         });
//       }
//     });
//   }
  
//   function removeHighlights() {
//     console.log("Removing highlights...");
//     const allAds = document.querySelectorAll("iframe[src*='ads'], div[id*='ads'], div[class*='ad']");
    
//     allAds.forEach((ad) => {
//       const element = ad as HTMLElement;
//       if (element.style) {
//         element.style.border = "";
//         element.style.opacity = "";
//         element.style.pointerEvents = "";
//       }
//     });
//   }
  
//   chrome.storage.local.set({ blockedCount: 0 }, () => {
//     console.log("Blocked count reset for new page.");
//   });

//   // Check on load
//   chrome.storage.local.get("isAdBlockerEnabled", ({ isAdBlockerEnabled }) => {
//     if (isAdBlockerEnabled) {
//       highlightAds();
//     } else {
//       removeHighlights();
//     }
//   });
  
//   // Listen for storage changes
//   chrome.storage.onChanged.addListener((changes) => {
//     if (changes.isAdBlockerEnabled) {
//       if (changes.isAdBlockerEnabled.newValue) {
//         highlightAds();
//       } else {
//         removeHighlights();
//       }
//     }
//   });
  

function highlightAds() {
    chrome.storage.local.get(["isAdBlockerEnabled", "customRules", "blockedCount"], ({ isAdBlockerEnabled, customRules, blockedCount = 0 }) => {
      if (!isAdBlockerEnabled) return;
  
      const adSelectors = [
        "iframe[src*='ads']",
        "div[id*='ads']",
        "div[class*='ad']",
        ...(customRules || []).map((rule: { selector: any; }) => rule.selector),
      ];
  
    //   const uniqueAds = new Set();
  
    //   adSelectors.forEach((selector) => {
    //     document.querySelectorAll(selector).forEach((ad) => {
    //       if (!uniqueAds.has(ad)) {
    //         uniqueAds.add(ad);
    //         ad.style.border = "3px solid red";
    //         ad.style.opacity = "0.4";
    //         ad.style.pointerEvents = "none";
    //       }
    //     });
    //   });

    let detectedAds = 0; // Track count manually

    const uniqueAds = new WeakSet();
    adSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((ad) => {
        if (!uniqueAds.has(ad)) {
          uniqueAds.add(ad);
          ad.style.border = "3px solid red";
          ad.style.opacity = "0.4";
          ad.style.pointerEvents = "none";
          detectedAds++;
        }
      });
    });
    
    console.log(`Detected Ads: ${detectedAds}`);

  
      if (detectedAds > 0) {
        const newBlockedCount = blockedCount + detectedAds;
        chrome.storage.local.set({ blockedCount: newBlockedCount }, () => {
          console.log(`Blocked Ads Count Updated: ${newBlockedCount}`);
        });
      }
    });
  }
  
  function removeHighlights() {
    console.log("Removing highlights and resetting counts...");
    const allAds = document.querySelectorAll("iframe[src*='ads'], div[id*='ads'], div[class*='ad']");
    
    allAds.forEach((ad) => {
        const element = ad as HTMLElement;
        if (element.style) {
          element.style.border = "";
          element.style.opacity = "";
          element.style.pointerEvents = "";
        }
      });
  
    chrome.storage.local.set({ blockedCount: 0 }, () => {
      console.log("Blocked count reset to 0 on disable.");
    });
  }
  
  // Reset count on each page load
  chrome.storage.local.set({ blockedCount: 0 }, () => {
    console.log("Blocked count reset for new page.");
  });
  
  // Initial check on load
  chrome.storage.local.get("isAdBlockerEnabled", ({ isAdBlockerEnabled }) => {
    if (isAdBlockerEnabled) {
      highlightAds();
    } else {
      removeHighlights();
    }
  });
  
  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isAdBlockerEnabled) {
      if (changes.isAdBlockerEnabled.newValue) {
        highlightAds();
      } else {
        removeHighlights();
      }
    }
  });
  