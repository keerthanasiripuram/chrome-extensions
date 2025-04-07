// export const getCurrentTab = async () => {
//     try {
//         const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//         if (!tabs.length) throw new Error("No tabs found");
//         return tabs;
//     } catch (error) {
//         console.error("Error fetching current tab:", error);
//         return null;
//     }
// };


export const getCurrentTab = async ():Promise<chrome.tabs.Tab[]>=>{
    return await chrome.tabs.query({ active: true, currentWindow: true }); //rtrng prmse so wtng till it rslves
};

export const sendTabsMessage= (currentTabId: number, messageType:string):Promise<any>=>{
    return  chrome.tabs.sendMessage(currentTabId, { type: messageType});
}
// export const getStorageData = async (keys: string[]) => {
//     try {
//         const data = await chrome.storage.local.get(keys);
//         return data || {};
//     } catch (error) {
//         console.error("Error fetching storage data:", error);
//         return {};
//     }
// };
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
// export const setStorageData = async (key: string, value: any) => {
//         return await chrome.storage.local.set({ [key]: value });
// };
// export const getCurrentTab = async (): Promise<chrome.tabs.Tab | null> => {
//     const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//     return tabs.length > 0 ? tabs[0] : null;
// };

// export const getStorageData = async <T>(key: string | string[]): Promise<T> => {
//     return chrome.storage.local.get(key) as Promise<T>;
// };

// export const setStorageData = async (data: Record<string, any>): Promise<void> => {
//     return chrome.storage.local.set(data);
// };
