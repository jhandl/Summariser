# AI Summarizer Chrome Extension

A minimal Chrome extension that adds a toolbar button to summarize the current page (or selected text) using Chrome’s built-in **Summarizer API**.  
The summary is displayed in a clean **side panel** injected directly into the page.

This extension works on Chrome as long as the Summarizer API is available.

---

## Features

- One-click page summarization
- Uses Chrome’s native `Summarizer` API
- Summarizes full page or selected text
- Renders results in a fixed right-side panel
- No external services or network requests

---

## Installation Instructions

### 1. Enable Required Chrome Flags

Paste each of the following into the Chrome address bar and set the flag to **Enabled**:

chrome://flags/#optimization-guide-on-device-model
chrome://flags/#prompt-api-for-gemini-nano
chrome://flags/#summarization-api-for-gemini-nano

After enabling flags, **restart Chrome**.

---

### 2. Download this repository

Run `git clone https://github.com/jhandl/Summariser.git`

---

### 3. Load the Extension

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select the folder containing:

   - `manifest.json`
   - `background.js`
   - `icon128.png`

You should now see the extension icon in the toolbar.

---

## Usage

1. Navigate to any webpage.  
2. Optionally highlight a block of text to summarize only that portion.  
3. Click the extension icon.  
4. A right-side panel appears showing the summary.

Close the panel using the “×” button in the top-right corner of the panel.

---

## Troubleshooting

### Summarizer API not available
Ensure:
- Chrome is up to date
- Flags are enabled
- You restarted Chrome after enabling flags

### `availability()` returns `"unavailable"` or `null`
This means the Summarizer API is not enabled in your Chrome build on this device.  
Some builds roll APIs out gradually per-platform.

### Side panel does not appear
A content blocker may be blocking DOM injection.  
Try disabling extensions like uBlock or privacy filters on the affected page.

---

## Notes

This extension performs all summarization **locally inside Chrome** using the Summarizer API.  
No data is sent to remote servers unless the underlying Chrome API uses cloud fallback (varies by build/platform).

---

## License

MIT License

