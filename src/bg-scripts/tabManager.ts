import { categorizeTab } from "../utils/catergorizeTab";

export const groupTabs = () => {
    chrome.tabs.query({}, (tabs) => {
        const categoryGroups: Record<string, number[]> = {};

        tabs.forEach((tab) => {
            const category = categorizeTab(tab?.url!);

            if (!categoryGroups[category]) categoryGroups[category] = [];
            categoryGroups[category].push(tab.id!);
        });

        Object.entries(categoryGroups).forEach(([category, tabIds]) => {
            chrome.tabs.group({ tabIds }, (groupId) => {
                chrome.tabGroups.update(groupId, { title: category, collapsed: true });
            });
        });
    });
};

export const restoreSession = () => {
    chrome.storage.local.get("savedSession", (data) => {
        if (data.savedSession) {
            data.savedSession.forEach((tab: { url: string; pinned: boolean }) => {
                chrome.tabs.create({ url: tab.url, pinned: tab.pinned });
            });
        }
    });
}

export const saveSession = () => {
    chrome.tabs.query({}, (tabs) => {
        const session = tabs.map((tab) => {
            return { url: tab.url, pinned: tab.pinned };
        });
        chrome.storage.local.set({ savedSession: session });
    });
}