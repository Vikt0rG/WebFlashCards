export async function getFlashcards() {
    const { vocabCards } = await chrome.storage.local.get('vocabCards');
    return vocabCards || [];
}

export async function addFlashcard({ word, translation, sourceLang, targetLang }) {
    const cleanWord = word.trim();
    const cleanTranslation = translation.trim();
    if (!cleanWord || !cleanTranslation) {
        throw new Error('A word and translation are both required.');
    }

    const cards = await getFlashcards();
    const duplicate = cards.some(
        (c) =>
            c.word.toLowerCase() === cleanWord.toLowerCase() &&
            c.sourceLang === sourceLang &&
            c.targetLang === targetLang
    );
    if (duplicate) {
        return { added: false, reason: 'duplicate' };
    }

    const card = {
        id: crypto.randomUUID(),
        word: cleanWord,
        translation: cleanTranslation,
        sourceLang,
        targetLang,
        examples: [], // reserved for the "usage examples" expansion
        dateAdded: new Date().toISOString(),
        timesReviewed: 0,
        lastReviewed: null
    };

    cards.push(card);
    await chrome.storage.local.set({ vocabCards: cards });
    return { added: true, card };
}

export async function updateFlashcard(id, updates) {
    const cards = await getFlashcards();
    const idx = cards.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    cards[idx] = { ...cards[idx], ...updates };
    await chrome.storage.local.set({ vocabCards: cards });
    return cards[idx];
}

export async function deleteFlashcard(id) {
    const cards = await getFlashcards();
    const next = cards.filter((c) => c.id !== id);
    await chrome.storage.local.set({ vocabCards: next });
    return next;
}