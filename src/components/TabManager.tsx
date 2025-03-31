import React from "react";
import "./TabManager.css"
const Popup: React.FC = () => {
  const handleAction = (action: string) => {
    chrome.runtime.sendMessage({ action });
  };

  return (
    <div className="popup-container">
      <h2>Tab Manager</h2>
      <button onClick={() => handleAction("groupTabs")}>Group Tabs</button>
      <button onClick={() => handleAction("saveSession")}>Save Session</button>
      <button onClick={() => handleAction("restoreSession")}>Restore Session</button>
    </div>
  );
};
export default Popup;