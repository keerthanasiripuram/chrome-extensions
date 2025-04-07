//helper fun to get current tabid
export const getCurrentTabId = async ():Promise<number>=>{
    const tabs= await chrome.tabs.query({ active: true, currentWindow: true }); 
    if (!tabs.length || !tabs[0].id) {  
        throw new Error("No current tab found")
    }
    return tabs[0].id
};

//helper fun to send message to tab
export const sendTabsMessage = (currentTabId: number, messageType:string)=>{
    const response=chrome.tabs.sendMessage(currentTabId, { type: messageType})
      if (chrome.runtime.lastError) {
          console.error("Error forwarding message:", chrome.runtime.lastError.message);  
          return {success:false};
        } else {
          console.log("message",response)
          return {success:true,response}
        }
}


