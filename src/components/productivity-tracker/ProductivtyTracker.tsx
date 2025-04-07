import React, { useEffect, useState } from "react";
import "../../global-styles.css"
import "./ProductivityTracker.css"

const ProductivityTracker: React.FC = () => {

  const [siteData, setSiteData] = useState<Record<string, number>>({});

  useEffect(() => {
    displayData();
  }, [siteData]);

  function handleReset() {
    chrome.storage.local.set({ siteData: {} });
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
      <button onClick={handleReset}>Reset Data</button>
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

