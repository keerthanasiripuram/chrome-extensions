export const noteTaker = () => {

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
}
