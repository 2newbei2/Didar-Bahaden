document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    if (!wordDisplay) return;

    // Thematic word list for your portfolio
    const wordList = ['VIBE', 'CODE', 'AI', 'BUILD', 'LEARN', 'CREATE'];
    const staticChars = '▓▒░█#@!%^&*()_-+=[]{}|;:<>?/~';
    let currentWordIndex = 0;
    
    let staticInterval;

    function generateStaticText(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += staticChars.charAt(Math.floor(Math.random() * staticChars.length));
        }
        return result;
    }

    function radioEffectLoop() {
        const targetWord = wordList[currentWordIndex];
        wordDisplay.classList.remove('tuned-in');

        // 1. "shshsh" static phase
        let staticCounter = 0;
        staticInterval = setInterval(() => {
            // Generate static text with a length similar to the target word
            const staticLength = targetWord.length + Math.floor(Math.random() * 3 - 1);
            wordDisplay.textContent = generateStaticText(staticLength);
            
            staticCounter++;
            // Run the static effect for about 1 second
            if (staticCounter > 20) { 
                clearInterval(staticInterval);
                
                // 2. Display the clear word
                wordDisplay.textContent = targetWord;
                wordDisplay.classList.add('tuned-in');

                // 3. Move to the next word for the next cycle
                currentWordIndex = (currentWordIndex + 1) % wordList.length;
            }
        }, 50); // Update static every 50ms
    }

    // Start the main loop, cycling every 4 seconds
    radioEffectLoop(); // Initial call
    setInterval(radioEffectLoop, 4000);
});