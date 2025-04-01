export const categorizeTab = (url: string): string => {
    if (/facebook|twitter|instagram|linkedin/i.test(url)) return "Social Media";
    if (/github|notion|jira|slack/i.test(url)) return "Work";
    if (/bbc|cnn|nytimes|guardian/i.test(url)) return "News";
    if (/youtube|netflix|spotify|hotstar/i.test(url)) return "Entertainment";
    return "Other";
  };