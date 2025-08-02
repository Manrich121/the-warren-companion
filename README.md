[![Latest Release](https://img.shields.io/badge/Release-v1.2.1-blue.svg)](https://github.com/Manrich121/the-warren-companion/releases/latest) [![.zip](https://img.shields.io/badge/download%20v1.2.1-.zip-green)](https://github.com/Manrich121/the-warren-companion/archive/refs/tags/v1.2.1.zip) [![.tar.gz](https://img.shields.io/badge/download%20v1.2.1-.tar.gz-green)](https://github.com/Manrich121/the-warren-companion/archive/refs/tags/v1.2.1.tar.gz)

# The Warren Companion Chrome Extension

A Chrome extension that adds various features tp theWarren.co.za.

## Features

1. Adds an on-hover image preview window to all images in tables.
2. Adds hover styling to rows in tables.
3. Duplicates pagination controls on the advance search results table.
4. Adds a toggle to switch search results to grid or list view, and stores this preference in local storage.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the folder containing this extension
5. The extension will be loaded and active

## Usage

1. Navigate to https://thewarren.co.za/search
2. Perform a search to see results
3. Hover over any search result row to see the image preview
4. Move your mouse away to hide the preview

## Files

- `manifest.json` - Extension configuration
- `scripts/content.js` - Main functionality script
- `styles.css` - Styling for the preview window
- `README.md` - This file

## Technical Details

The extension uses:
- Manifest V3 for modern Chrome extension standards
- Content scripts to inject functionality into the page
- CSS for styling the preview window
- MutationObserver to handle dynamic content changes

## Permissions

- `activeTab` - Required to inject the preview functionality into the TheWarren search page
