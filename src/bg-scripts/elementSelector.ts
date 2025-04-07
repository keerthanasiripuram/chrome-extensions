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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "disable-script" && sender.tab?.id !== undefined) {
        try {
            const response = sendTabsMessage(sender.tab.id, "disable-script");
            sendResponse(response)
            return true;
        } catch (error) {
            console.error("Exception in message forwarding:", error);
            sendResponse({ success: false });
        }
    }
});

