// TheWarren Image Preview Extension - Content Script

(function () {
  "use strict";

  let previewDiv = null;
  let isSetup = false;
  let currentAttachedRows = new Set(); // Keep track of rows with listeners
  let currentAttachedImages = new Set(); // Keep track of images with listeners

  // Element container with position:relative
  const containerElementQueryString = ".innerContainer:has(.tableData)";

  /**
   * Creates or ensures the existence of the preview div and attaches it to the results table.
   * Also sets the containerElement's position if it's static.
   */
  function setupPreviewDiv() {
    const containerElement = document.querySelector(
      containerElementQueryString,
    );

    if (!containerElement) {
      return false;
    }

    if (!previewDiv) {
      previewDiv = document.createElement("div");
      previewDiv.id = "image-preview";
      const imgTag = document.createElement("img");
      imgTag.alt = "Image preview";
      previewDiv.appendChild(imgTag);
      containerElement.appendChild(previewDiv);
    } else {
      // Ensure it's a child of containerElement
      if (previewDiv.parentElement !== containerElement) {
        containerElement.appendChild(previewDiv);
      }
    }

    // Set containerElement position to relative if it's static, for positioning context
    const containerElementStyles = window.getComputedStyle(containerElement);
    if (containerElementStyles.position === "static") {
      containerElement.style.position = "relative";
    }

    // Style previewDiv for absolute positioning
    previewDiv.style.position = "absolute";
    previewDiv.style.pointerEvents = "none"; // Let mouse events pass through

    return true;
  }

  function attachRowListeners() {
    // Attach hover listeners to rows for background styling
    const allRows = document.querySelectorAll(".row");
    const newAttachedRows = new Set();

    allRows.forEach((row) => {
      if (!currentAttachedRows.has(row)) {
        row.addEventListener("mouseenter", handleRowMouseEnter);
        row.addEventListener("mouseleave", handleRowMouseLeave);
      }
      newAttachedRows.add(row);
    });

    // Remove listeners from rows that are no longer in the DOM
    currentAttachedRows.forEach((row) => {
      if (!newAttachedRows.has(row)) {
        row.removeEventListener("mouseenter", handleRowMouseEnter);
        row.removeEventListener("mouseleave", handleRowMouseLeave);
      }
    });

    currentAttachedRows = newAttachedRows; // Update the set of attached rows

    // Attach preview listeners to images only
    const allImages = document.querySelectorAll(".item.left > img");
    const newAttachedImages = new Set();

    allImages.forEach((img) => {
      if (!currentAttachedImages.has(img)) {
        img.addEventListener("mouseenter", handleImageMouseEnter);
        img.addEventListener("mouseleave", handleImageMouseLeave);
        img.addEventListener("mousemove", handleMouseMove);
      }
      newAttachedImages.add(img);
    });

    // Remove listeners from images that are no longer in the DOM
    currentAttachedImages.forEach((img) => {
      if (!newAttachedImages.has(img)) {
        img.removeEventListener("mouseenter", handleImageMouseEnter);
        img.removeEventListener("mouseleave", handleImageMouseLeave);
        img.removeEventListener("mousemove", handleMouseMove);
      }
    });

    currentAttachedImages = newAttachedImages; // Update the set of attached images
  }

  // Show preview when hovering over the image only
  function handleImageMouseEnter(e) {
    if (!previewDiv) return;

    const imgElement = this;
    const imgSrc = imgElement.src;
    const previewImg = previewDiv.querySelector("img");

    // Set the preview image source
    previewImg.src = imgSrc;
    previewDiv.style.display = "block";

    // Check if the card has isFoil class and apply foil effect
    const cardElement = imgElement.closest(".item.card");
    if (cardElement && cardElement.classList.contains("isFoil")) {
      previewDiv.classList.add("foil");
    } else {
      previewDiv.classList.remove("foil");
    }
  }

  function handleImageMouseLeave(e) {
    if (previewDiv) {
      previewDiv.style.display = "none";
    }
  }

  function handleMouseMove(e) {
    if (!previewDiv) return;
    const containerElement = document.querySelector(
      containerElementQueryString,
    );
    if (!containerElement) return;

    const containerElementRect = containerElement.getBoundingClientRect();

    // Offset from mouse pointer
    const offsetX = 10;
    const offsetY = 10;

    // Position relative to advancedSearch container
    const leftPos = e.clientX - containerElementRect.left + offsetX;
    const topPos = e.clientY - containerElementRect.top + offsetY;

    previewDiv.style.left = leftPos + "px";
    previewDiv.style.top = topPos + "px";
  }

  // Row hover background logic
  function handleRowMouseEnter(e) {
    this.classList.add("row-hovered");
  }

  function handleRowMouseLeave(e) {
    this.classList.remove("row-hovered");
  }

  /**
   * Initializes the image preview functionality.
   * This function should be called whenever the relevant DOM content might have changed.
   */
  function initializeImagePreview() {
    if (!setupPreviewDiv()) {
      // If the results table isn't ready, we can't initialize.
      // The MutationObserver will call this function again when content changes.
      console.log(
        "The Warren Preview: table not found yet. Waiting for DOM updates.",
      );
      isSetup = false; // Reset setup status if we couldn't find the table
      return;
    }

    attachRowListeners();
    isSetup = true;
    console.log("The Warren Preview: Image preview functionality enabled.");
  }

  // --- Main Execution Logic ---

  // Use a single MutationObserver to watch for changes to the entire body.
  // This helps handle SPA navigation where content might be replaced entirely.
  const mainObserver = new MutationObserver((mutations) => {
    // We want to re-initialize if the body's content changes significantly,
    // which indicates a potential SPA navigation or dynamic loading.
    // Checking for 'containerElement' table presence is a good trigger.
    const containerElement = document.querySelector(
      containerElementQueryString,
    );
    if (!isSetup || !containerElement) {
      initializeImagePreview();
    } else {
      // If already setup and the main table is still there, just re-attach listeners
      // in case new rows were added within the existing table.
      attachRowListeners();
    }
  });

  // Start observing the body for child list changes (additions/removals)
  // and subtree changes (any change within descendants).
  mainObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  // Initial attempt to set up when the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeImagePreview);
  } else {
    initializeImagePreview();
  }
})();
