/**
 * Utility functions for the site
 */

/**
 * Sets the current year in an element with id "y"
 * This is used in the footer copyright notice
 */
function setCurrentYear() {
  const yearElement = document.getElementById("y");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setCurrentYear);
} else {
  setCurrentYear();
}
