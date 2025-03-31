// import React, { useEffect, useState } from 'react';

// const AddBlocker = () => {
//   const [isEnabled, setIsEnabled] = useState(true);
//   const [blockedCount, setBlockedCount] = useState(0);

//   // Fetch data from storage
//   useEffect(() => {
//     console.log("Fetching data from storage...");
//     chrome.storage.local.get(['isAdBlockerEnabled', 'blockedCount'], (data) => {
//       console.log("Storage Data Retrieved:", data);
//       setIsEnabled(data.isAdBlockerEnabled ?? true);
//       setBlockedCount(data.blockedCount ?? 0);
//     });

//     // Listen for storage changes
//     chrome.storage.onChanged.addListener((changes) => {
//       if (changes.blockedCount) {
//         setBlockedCount(changes.blockedCount.newValue);
//       }
//       if (changes.isAdBlockerEnabled) {
//         setIsEnabled(changes.isAdBlockerEnabled.newValue);
//       }
//     });
//   }, []);

//   // Toggle the ad blocker and reset count if disabled
//   const toggleAdBlocker = () => {
//     const newState = !isEnabled;
//     if (!newState) {
//       chrome.storage.local.set({ isAdBlockerEnabled: newState, blockedCount: 0 }, () => {
//         console.log('Ad blocker disabled and blocked count reset');
//       });
//     } else {
//       chrome.storage.local.set({ isAdBlockerEnabled: newState });
//     }
//     setIsEnabled(newState);
//   };

//   return (
//     <div>
//       <h2>Ad Blocker</h2>
//       <button onClick={toggleAdBlocker}>{isEnabled ? 'Disable' : 'Enable'} Ad Blocker</button>
//       <p>Blocked Ads: {blockedCount}</p>
//       <a href="options.html" target="_blank">Manage Custom Rules</a>
//     </div>
//   );
// };

// export default AddBlocker;


import React, { useEffect, useState } from 'react';

const AddBlocker = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [blockedCount, setBlockedCount] = useState(0);

  // Fetch data from storage
  const fetchData = () => {
    chrome.storage.local.get(['isAdBlockerEnabled', 'blockedCount'], (data) => {
      console.log("Storage Data Retrieved:", data);
      setIsEnabled(data.isAdBlockerEnabled ?? true);
      setBlockedCount(data.blockedCount ?? 0);
    });
  };

  useEffect(() => {
    fetchData();

    // Listen for storage changes
    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.blockedCount?.newValue !== undefined) {
        setBlockedCount(changes.blockedCount.newValue);
      }
      if (changes.isAdBlockerEnabled?.newValue !== undefined) {
        setIsEnabled(changes.isAdBlockerEnabled.newValue);
      }
    };

    chrome.storage.onChanged.addListener(storageListener);

    // Cleanup on unmount
    return () => chrome.storage.onChanged.removeListener(storageListener);
  }, []);

  // Toggle the ad blocker and reset count if disabled
  const toggleAdBlocker = () => {
    const newState = !isEnabled;
    if (!newState) {
      chrome.storage.local.set({ isAdBlockerEnabled: newState, blockedCount: 0 }, () => {
        console.log('Ad blocker disabled and blocked count reset');
        setBlockedCount(0); // Reset UI count immediately
      });
    } else {
      chrome.storage.local.set({ isAdBlockerEnabled: newState });
    }
    setIsEnabled(newState);
  };

  return (
    <div>
      <h2>Ad Blocker</h2>
      <button onClick={toggleAdBlocker}>{isEnabled ? 'Disable' : 'Enable'} Ad Blocker</button>
      <p>Blocked Ads: {blockedCount}</p>
      <a href="options.html" target="_blank">Manage Custom Rules</a>
    </div>
  );
};

export default AddBlocker;


