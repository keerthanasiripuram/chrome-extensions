# Productivity Tracker, Smart Note-Taking Tool, and Tab Manager

## Overview
This project consists of three Chrome extensions designed to enhance productivity and streamline browser management:
1. **Productivity Tracker** - Tracks the time spent on different websites and provides insights.
2. **Smart Note-Taking Tool** - Allows users to take URL-specific notes (local) or global notes accessible across pages.
3. **Tab Manager** - Automatically categorizes and manages open tabs based on their content.
4. **Element Selector** - Select and inspect elements visually on any page.

5. **Tooltip Helper** - Add helpful, custom tooltips to elements dynamically.
---

## Features

### 1. Productivity Tracker
- **Tracks Website Usage:** Monitors time spent on each website.
- **Time Visualization:** Displays time spent per site using a  tabular format.
- **Daily Limits:** Users can  reset daily time limits for specific websites.
- **Persistent Data:** Data is stored using `chrome.storage.local`.

### 2. Smart Note-Taking Tool
- **Local Notes:** Take notes that are tied to the current URL and only visible when revisiting that URL.
- **Global Notes:** Create notes that are accessible from any page.
- **CRUD Operations:** Notes can be added, edited, and removed easily.
- **Storage Management:** Notes are stored locally using `chrome.storage.local`.
- **Efficient UI:** Real-time UI updates using React state management.

### 3. Tab Manager
- **Tab Categorization:** Automatically groups tabs into categories like Social Media, Work, or News using basic URL-based matching.
- **Session Management:** Save using `chrome.storage.local` and restore tab sessions.
- **Tab Navigation:** Easily navigate between categorized tabs.

### 4. Element Selector

- **Highlight on Hover** : Highlights target element visually.

### 5. Tooltip Helper

-**Create tooltip**
- **Persistent Map**: Maintains a live map of elements and tooltips.

-**Restore all tooltips**:Easily trigger restoreAllTooltips() via scripts.

- **Dynamically tooltip content**

---

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/keerthanasiripuram/chrome-extensions.git
    cd chrome-extensions
    ```
2. Build the project using npm:
    ```bash
    npm install
    npm run build
    ```
3. Load the extension in Chrome:
    - Open `chrome://extensions/`
    - Enable **Developer mode** (toggle in the top right).
    - Click on **Load unpacked**.
    - Select the `build` folder.

---

## Usage

### Productivity Tracker
1. Enable the extension.
2. The tracker will automatically monitor time spent on active tabs.
3. View reports in table format.
4. Reset daily limits from the  page.

### Smart Note-Taking Tool
1. Click the extension icon.
2. Choose between **Local Note** or **Global Note**.
3. Enter your note and save.
4. Edit or delete notes as needed.

### Tab Manager
1. Open multiple tabs in Chrome.
2. Click the Tab Manager extension icon.
3. View grouped tabs by category.
4. Save or restore tab sessions as needed.

---

## Technical Details
- **Frontend:** React, HTML, CSS
- **Backend:** Chrome Extensions API (tabs, storage)
- **State Management:** React Hooks
- **Storage:** chrome.storage.local
- **Build Tools:** Vite, npm

---



