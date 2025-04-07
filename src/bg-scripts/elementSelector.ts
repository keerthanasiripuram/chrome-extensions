import { sendTabsMessage } from "../utils/helpers";


export const elementSelector = () => {
    chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
        if (message.type === "request-iframe-access") {
            const tabId = sender.tab?.id;
            if (tabId === undefined) {
                console.error("No valid tab ID found. Cannot inject script.");
                return;
            }
            chrome.permissions.request(
                { origins: [message.iframeSrc] },
                (granted) => {
                    if (granted) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId, allFrames: true },
                            files: ["content.js"]
                        });
                    } else {
                        console.warn(" Permission denied for iframe:", message.iframeSrc);
                    }
                }
            );
        }
    });
}

// chrome.runtime.onMessage.addListener((message, sender) => {
//     if (message.type === "disable-script" && sender.tab  && sender.tab.id !== undefined) {
//       chrome.tabs.sendMessage(sender.tab.id, { type: "disable-script" });
//     }
//   });

  chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {//hw to wrte ds
    if (message.type === "disable-script" && sender.tab?.id !== undefined) {
      try {
        const response = await chrome.tabs.sendMessage(sender.tab.id, { type: "disable-script" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error forwarding message:", chrome.runtime.lastError.message);
            sendResponse({ success: false });
          } else {
            sendResponse({ success: true, response });
          }
        });
        // Keep the message channel open for async sendResponse
        return true;
      } catch (error) {
        console.error("Exception in message forwarding:", error);
        sendResponse({ success: false });
      }
    }
  });
  
//   chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {//hw to wrte ds
//     if (message.type === "disable-script" && sender.tab?.id !== undefined) {
//       try {
//         const response=await sendTabsMessage(sender.tab.id, "disable-script");
//           if (chrome.runtime.lastError) {
//             console.error("Error forwarding message:", chrome.runtime.lastError.message);
//             sendResponse({ success: false });
//           } else {
//             sendResponse({ success: true, response });
//           }
//         return true;
//       } catch (error) {
//         console.error("Exception in message forwarding:", error);
//         sendResponse({ success: false });
//       }
//     }
//   });
  
  

