/**
 * shortener-api.js
 * This script handles all the logic for communicating with the ulvis.net API.
 * It constructs the request URL and processes the response.
 */

const shortenerAPI = {
  // API and Proxy configuration
  apiBase: 'https://ulvis.net/api.php?',
  proxyBase: 'https://api.allorigins.win/get?url=',

  /**
   * Takes form data, constructs the API URL, and fetches the shortened link.
   * @param {FormData} formData - The FormData object from the submission.
   * @returns {Promise<object>} A promise that resolves with the API data or rejects with an error message.
   */
  async shortenUrl(formData) {
    const params = new URLSearchParams();

    // We only append params if they have a value to keep the URL clean
    for (const [key, value] of formData.entries()) {
      if (key === 'private' && shortenerUI.elements.privateCheckbox.checked) {
        params.append('private', '1');
      } else if (key !== 'private' && value) {
        // The API expects the date in MM/DD/YYYY format
        if (key === 'expire') {
          const [year, month, day] = value.split('-');
          params.append('expire', `${month}/${day}/${year}`);
        } else {
          params.append(key, value);
        }
      }
    }
    params.append('type', 'json'); // Always request JSON for easier parsing

    const apiUrl = this.apiBase + params.toString();
    const requestUrl = `${this.proxyBase}${encodeURIComponent(apiUrl)}`;

    try {
      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const data = await response.json();

      // The actual API response is nested inside the 'contents' property by the proxy
      const apiResponse = JSON.parse(data.contents);

      if (apiResponse.success) {
        return apiResponse.data; // Resolve with the successful data object
      } else {
        // Reject with a user-friendly error message from the API
        const errorMessage = apiResponse.error?.msg || 'An unknown error occurred.';
        throw new Error(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
      }
    } catch (error) {
      // Catch fetch errors or errors thrown from the API response
      console.error('API Error:', error);
      // Re-throw a generic error for the UI to display
      throw new Error('Could not connect to the shortening service. Please try again.');
    }
  },
};