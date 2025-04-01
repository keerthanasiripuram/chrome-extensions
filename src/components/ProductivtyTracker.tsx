import React, { useEffect, useState } from "react";
import "./GlobalStyles.css"
import "./ProductivityTracker.css"

const ProductivityTracker: React.FC = () => {
  const [siteData, setSiteData] = useState<Record<string, number>>({});

  useEffect(() => {
    displayData();
  }, [siteData]);

  function handleAction(action: string) {
    if (action === "reset") {
      chrome.runtime.sendMessage({ action: "reset" }, (response) => {
        if (response?.status === "success") {
          setSiteData({});
          console.log("Data Reset Successfully across all scripts.");
        }
      });
    }
  }

  function displayData() {
    chrome.storage.local.get("siteData", (data) => {
      const fetchedData = data.siteData || {};
      setSiteData(fetchedData);
    });
  }

  return (
    <div className="popup-container">
      <h1>Website Time Tracker</h1>
      <button onClick={() => handleAction("reset")}>Reset Data</button>
      <table id="timeTable" >
        <thead>
          <tr>
            <th>Website</th>
            <th>Time Spent (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(siteData).map(([site, time]) => (
            <tr key={site}>
              <td>{site}</td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductivityTracker;

