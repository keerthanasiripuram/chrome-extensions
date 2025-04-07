
export const getCurrentTab = async ():Promise<chrome.tabs.Tab[]>=>{
    return await chrome.tabs.query({ active: true, currentWindow: true }); 
};

export const sendTabsMessage= (currentTabId: number, messageType:string):Promise<any>=>{
    return  chrome.tabs.sendMessage(currentTabId, { type: messageType});
}

export const getStorageData = async (keys: string[]) => {
        return await chrome.storage.local.get(keys);
};

export const setStorageData = async (key: string, value: any) => {
    try {
        await chrome.storage.local.set({ [key]: value });
    } catch (error) {
        console.error("Error setting storage data:", error);
    }
};