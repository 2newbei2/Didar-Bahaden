const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const instructions = document.getElementById('instructions');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = searchInput.value.trim();
    if (!word) return;

    // Reset UI
    instructions.style.display = 'none';
    loadingSpinner.style.display = 'block';
    resultsContainer.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.title || 'Could not find the word.');
        }
        
        const data = await response.json();
        renderResults(data[0]);

    } catch (error) {
        renderError(error.message);
    } finally {
        loadingSpinner.style.display = 'none';
    }
});

function renderResults(data) {
    resultsContainer.style.display = 'block';
    
    const phoneticWithAudio = data.phonetics.find(p => p.audio);
    const audioUrl = phoneticWithAudio ? phoneticWithAudio.audio : null;

    let meaningsHtml = '';
    data.meanings.forEach(meaning => {
        let definitionsHtml = '';
        meaning.definitions.forEach(def => {
            definitionsHtml += `
                <li>
                    <p>${def.definition}</p>
                    ${def.example ? `<p class="example">“${def.example}”</p>` : ''}
                </li>
            `;
        });

        meaningsHtml += `
            <div class="meaning">
                <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
                <ul class="definitions-list">
                    ${definitionsHtml}
                </ul>
            </div>
        `;
    });

    resultsContainer.innerHTML = `
        <div class="result-header">
            <div>
                <h2 class="result-word">${data.word}</h2>
                <p class="result-phonetic">${data.phonetic || (phoneticWithAudio ? phoneticWithAudio.text : '')}</p>
            </div>
            <button class="audio-button" id="audio-button" ${!audioUrl ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            </button>
        </div>
        ${meaningsHtml}
    `;

    const audioButton = document.getElementById('audio-button');
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioButton.addEventListener('click', () => {
            audio.play();
        });
    }
}

function renderError(message) {
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.style.display = 'block';
}