// TheWarren Image Preview Extension - Content Script

(function () {
  "use strict";

  let previewDiv = null;
  let isSetup = false;

  function setupImagePreview() {
    if (isSetup) return;

    const resultsTable = document.getElementById("advancedSearch");

    if (!resultsTable) {
      console.log(
        'TheWarren Preview: Could not find element with id "advancedSearch", will retry...',
      );
      return false;
    }

    // Create preview div if it doesn't exist
    if (!previewDiv) {
      previewDiv = document.createElement("div");
      previewDiv.id = "image-preview";
      const imgTag = document.createElement("img");
      imgTag.alt = "Image preview";
      previewDiv.appendChild(imgTag);
      resultsTable.appendChild(previewDiv);
    } else {
      // Ensure it's a child of resultsTable
      if (previewDiv.parentElement !== resultsTable) {
        resultsTable.appendChild(previewDiv);
      }
    }

    // Set resultsTable position to relative if it's static, for positioning context
    const resultsTableStyles = window.getComputedStyle(resultsTable);
    if (resultsTableStyles.position === "static") {
      resultsTable.style.position = "relative";
    }

    // Add event listeners to all rows
    attachRowListeners();

    isSetup = true;
    console.log("TheWarren Preview: Image preview functionality enabled");
    return true;
  }

  function attachRowListeners() {
    document.querySelectorAll(".row").forEach((row) => {
      // Remove previous listeners to avoid duplicates
      row.removeEventListener("mouseover", handleMouseOver);
      row.removeEventListener("mouseout", handleMouseOut);

      // Add new listeners
      row.addEventListener("mouseover", handleMouseOver);
      row.addEventListener("mouseout", handleMouseOut);
    });
  }

  function handleMouseOver(e) {
    if (!previewDiv) return;

    // Find image element in the row
    const imgElement = this.querySelector(".item.card.left img");
    if (imgElement) {
      const imgSrc = imgElement.src;
      const previewImg = previewDiv.querySelector("img");

      // Set the preview image source
      previewImg.src = imgSrc;
      previewDiv.style.display = "block";

      // Check if the card has isFoil class and apply foil effect
      const cardElement = this.querySelector(".item.card");
      if (cardElement && cardElement.classList.contains("isFoil")) {
        previewDiv.classList.add("foil");
      } else {
        previewDiv.classList.remove("foil");
      }

      // Position the preview div
      const advancedSearchElement = document.getElementById("advancedSearch");
      const rowRect = this.getBoundingClientRect();
      const advancedSearchRect = advancedSearchElement.getBoundingClientRect();

      // Position to the right of the row, with some offset
      const leftPos = 80;
      const topPos = rowRect.bottom - (40 + advancedSearchRect.top);

      previewDiv.style.left = leftPos + "px";
      previewDiv.style.top = topPos + "px";
    }
  }

  function handleMouseOut() {
    if (previewDiv) {
      previewDiv.style.display = "none";
    }
  }

  // Initialize when DOM is ready
  function init() {
    // Try to setup immediately
    if (!setupImagePreview()) {
      // If setup failed, watch for changes and retry
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === "childList") {
            if (setupImagePreview()) {
              observer.disconnect();
            }
          }
        });
      });

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Also try again after a short delay
      setTimeout(() => {
        if (!isSetup) {
          setupImagePreview();
        }
      }, 2000);
    }
  }

  // Run initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Also watch for dynamic content changes
  const contentObserver = new MutationObserver(function (mutations) {
    if (isSetup) {
      // Re-attach listeners to any new rows that might have been added
      attachRowListeners();
    }
  });

  contentObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
