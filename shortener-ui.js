/**
 * shortener-ui.js
 * This script handles all direct DOM manipulation and UI-only event listeners
 * for the URL shortener component. It's designed to be independent of the API logic.
 */

const shortenerUI = {
  // Store all DOM element references in one place for easy access and management.
  elements: {
    form: document.getElementById('shorten-form'),
    longUrlInput: document.getElementById('long-url'),
    submitButton: document.getElementById('submit-button'),
    buttonText: document.getElementById('button-text'),
    linkIcon: document.getElementById('link-icon'),
    spinner: document.getElementById('spinner'),
    resultArea: document.getElementById('result-area'),
    resultText: document.getElementById('result-text'),
    errorArea: document.getElementById('error-area'),
    errorText: document.getElementById('error-text'),
    copyButton: document.getElementById('copy-button'),
    toggleOptionsButton: document.getElementById('toggle-options'),
    advancedOptionsDiv: document.getElementById('advanced-options'),
    chevronIcon: document.getElementById('chevron-icon'),
    privateCheckbox: document.getElementById('private'),
  },

  // --- UI State Management Functions ---

  /**
   * Toggles the loading state of the submit button.
   * @param {boolean} isLoading - True to show spinner, false to show text/icon.
   */
  setLoading(isLoading) {
    this.elements.submitButton.disabled = isLoading;
    this.elements.buttonText.classList.toggle('hidden', isLoading);
    this.elements.linkIcon.classList.toggle('hidden', isLoading);
    this.elements.spinner.classList.toggle('hidden', !isLoading);
  },

  /**
   * Displays the shortened URL result.
   * @param {string} shortUrl - The shortened URL to display.
   */
  displayResult(shortUrl) {
    this.elements.resultText.textContent = shortUrl;
    this.elements.resultArea.classList.remove('hidden');
    this.elements.errorArea.classList.add('hidden');
  },

  /**
   * Displays an error message.
   * @param {string} message - The error message to display.
   */
  displayError(message) {
    this.elements.errorText.textContent = message;
    this.elements.errorArea.classList.remove('hidden');
    this.elements.resultArea.classList.add('hidden');
  },

  /**
   * Resets the result and error areas to their initial hidden state.
   */
  reset() {
    this.elements.resultArea.classList.add('hidden');
    this.elements.errorArea.classList.add('hidden');
  },

  // --- UI Interaction Handlers ---

  /**
   * Toggles the visibility of the advanced options section.
   */
  toggleAdvancedOptions() {
    this.elements.advancedOptionsDiv.classList.toggle('open');
    this.elements.chevronIcon.classList.toggle('rotate-180');
  },

  /**
   * Copies the result text to the clipboard and provides user feedback.
   */
  copyToClipboard() {
    const urlToCopy = this.elements.resultText.textContent;
    if (!urlToCopy) return;

    // Use the modern, secure Clipboard API
    navigator.clipboard.writeText(urlToCopy).then(() => {
      const copyButtonSpan = this.elements.copyButton.querySelector('span');
      const originalText = copyButtonSpan.textContent;
      copyButtonSpan.textContent = 'Copied!';
      this.elements.copyButton.disabled = true;

      setTimeout(() => {
        copyButtonSpan.textContent = originalText;
        this.elements.copyButton.disabled = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy URL. Please try again.');
    });
  },
};