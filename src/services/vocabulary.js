// Function to save a word to chrome's local storage
export async function saveWord(cardData) {
    const vocabWords = await loadWords();

    // Check if we are passing a plain string by mistake
    const newEntry = typeof cardData === 'string'
        ? { word: cardData, translation: 'N/A' }
        : cardData;

    // Check for duplicates
    const duplicate = vocabWords.some(
        (entry) => entry.word.toLowerCase() === newEntry.word.toLowerCase()
    );
    if (duplicate) {
        console.warn('Duplicate word not saved:', newEntry.word);
        return false;
    }

    vocabWords.push(newEntry);

    await chrome.storage.local.set({ vocabWords });
    console.log('[Storage] Saved new entry:', newEntry);

    return true;
}

// Function to load words from chrome's local storage
export async function loadWords() {
    const data = await chrome.storage.local.get({ vocabWords: [] });

    return data.vocabWords || [];
}