const AD_BLOCKER_RULES :chrome.declarativeNetRequest.Rule[]= [
    {
      id: 1,
      action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
      condition: { urlFilter: '*://*.doubleclick.net/*' },
    },
    {
      id: 2,
      action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
      condition: { urlFilter: '*://*.googlesyndication.com/*' },
    },
  ];
  const setBlocking= (enabled:boolean):void=>{
       if(enabled){
          chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds:AD_BLOCKER_RULES.map((rule) => rule.id),
          addRules:AD_BLOCKER_RULES
         })
       }else{
           chrome.declarativeNetRequest.updateDynamicRules({
              removeRuleIds:AD_BLOCKER_RULES.map((rule) => rule.id),
              addRules:[]
          })
       }
  }
  chrome.runtime.onInstalled.addListener(async ():Promise<void>=>{
      const {enabled =true}=await chrome.storage.local.get("enabled");
      setBlocking(enabled);
      await chrome.storage.local.set({"totalAdsBlocked":0});
  });
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async ():Promise<void>=>{
      const {totalAdsBlocked=0}=await chrome.storage.local.get("totalAdsBlocked");
      await chrome.storage.local.set({"totalAdsBlocked":totalAdsBlocked+1});
  } );
  chrome.storage.onChanged.addListener((change):void=>{
     if(change.enabled){
      setBlocking(change.enabled.newValue);
     }
  })
   