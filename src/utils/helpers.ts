export const getCurrentTabId = async ():Promise<number>=>{
    const tabs= await chrome.tabs.query({ active: true, currentWindow: true }); //rtrng prmse so wtng till it rslves
    if (!tabs.length || !tabs[0].id) {  //on filure dnt prcd furthr so thrw err vl get cught in nrst
        throw new Error("No current tab found")
    }
    return tabs[0].id//on succes snd data
};

export const sendTabsMessage= (currentTabId: number, messageType:string):Promise<any>=>{
    return  chrome.tabs.sendMessage(currentTabId, { type: messageType});
}