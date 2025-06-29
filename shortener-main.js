/**
 * shortener-main.js
 * This is the main script that orchestrates the UI and API modules.
 * It sets up all the event listeners and defines the flow of the application.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Defensive check to ensure required modules are loaded before running the app.
    if (typeof shortenerUI === 'undefined' || typeof shortenerAPI === 'undefined') {
        console.error('A required script (shortener-ui.js or shortener-api.js) failed to load. The application cannot start.');
        // Display a user-friendly error message in the UI.
        const errorArea = document.getElementById('error-area');
        const errorText = document.getElementById('error-text');
        if (errorArea && errorText) {
            errorText.textContent = 'A critical error occurred. Please refresh the page.';
            errorArea.classList.remove('hidden');
            document.getElementById('shorten-form')?.classList.add('hidden');
        }
        return;
    }

    // --- Shortener Component Logic ---
    const { elements } = shortenerUI;

    // Handle form submission
    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        shortenerUI.reset();
        shortenerUI.setLoading(true);
        try {
            const formData = new FormData(elements.form);
            const resultData = await shortenerAPI.shortenUrl(formData);
            shortenerUI.displayResult(resultData.url);
        } catch (error) {
            shortenerUI.displayError(error.message);
        } finally {
            shortenerUI.setLoading(false);
        }
    });

    // Handle advanced options toggle
    elements.toggleOptionsButton.addEventListener('click', () => shortenerUI.toggleAdvancedOptions());

    // Handle copy to clipboard
    elements.copyButton.addEventListener('click', () => shortenerUI.copyToClipboard());
});