import { categorizeTab } from "../../utils/catergorizeTab";

 
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