# Gemini Guidelines for Chrome Extension Development

This document provides instructions for Gemini to follow when working on this Chrome Extension project.

## Project Goal

A Chrome extension that improves functionality on thewarren.co.za, includes:

1. Adds an on-hover image preview window to all images in tables.
2. Adds hover styling to rows in tables.
3. Clones / Duplicates pagination controls on the advance search results table.
4. Adds a toggle to switch search results to grid or list view, and stores this preference in local storage.

## Project Structure

*   `manifest.json`: The core file that defines the extension's metadata, permissions, and capabilities. All changes to permissions, background scripts, content scripts, or browser actions must be registered here.
*   `scripts/content.js`: A content script that is injected into and runs in the context of web pages. It can manipulate the DOM of the page.
*   `styles.css`: CSS file for styling any UI elements injected by the content script.
*   `images/`: Contains all the icons for the extension.
*   `ai-docs/`: Contains curated Gemini documentation for developing Chrome extensions.

## Development Workflow

1.  **Making Changes**: Modify the relevant files (`.js`, `.css`, `.html`, `manifest.json`).
2.  **Loading the Extension**:
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode".
    *   Click "Load unpacked" and select the root directory of this project.
3.  **Reloading**: After making changes, click the "reload" button for the extension in `chrome://extensions`. For content script changes, you often need to reload the target web page as well.

## Key Conventions

*   **Permissions**: Before using any new `chrome.*` API, ensure the necessary permission is declared in `manifest.json`.
*   **Content Scripts & CSS**: When adding new content scripts or CSS files, they must be registered in `manifest.json` under the `content_scripts` section.
*   **Security**: Be mindful of the security implications of the code, especially for content scripts that interact with web pages. Avoid introducing cross-site scripting (XSS) vulnerabilities.
