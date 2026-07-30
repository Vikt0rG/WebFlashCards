import { loadWords } from '../services/index.js';

// Wait for the popup's HTML document to load
document.addEventListener('DOMContentLoaded', async () => {
    const listElement = document.getElementById('word-list');
  
    // Fetch array from storage using our helper
    const words = await loadWords();

    if (words.length === 0) {
        listElement.innerHTML = "<li>No words saved yet!</li>";
        return;
    } else {
        console.log(`Found ${words.length} words in storage.`);
    }

    // Render words dynamically using array .map()
    listElement.innerHTML = words
        .map(w => `<li><strong>${w.word}</strong>: ${w.meaning}</li>`)
        .join('');
});