// Function to save a word to chrome's local storage
export async function saveWord(word) {
    const vocabWords = await loadWords();
    vocabWords.push(word);

    await chrome.storage.local.set({ vocabWords });
    console.log(`New word "${word}" saved to vocabWords.`);
}

// Function to load words from chrome's local storage
export async function loadWords() {
    const data = await chrome.storage.local.get({ vocabWords: [] });

    return data.vocabWords || [];
}