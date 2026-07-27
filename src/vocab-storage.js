// vocab-storage.js
// All reading/writing of extension data lives here, so the background
// service worker and the popup UI share exactly one source of truth.


// TODO: Add different source and target languages for each flashcard, so that a user can
// learn different languages
const DEFAULT_SETTINGS = { sourceLang: 'fr', targetLang: 'en' };

/**
 * Calls the free MyMemory translation API.
 * Docs: https://mymemory.translated.net/doc/spec.php
 * Anonymous usage is capped at ~5000 characters/day per IP and 500 bytes
 * per request, which is plenty for single words and short phrases.
 */
export async function translateText(text, sourceLang, targetLang) {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Nothing to translate.');

    const params = new URLSearchParams({
        q: trimmed.slice(0, 500),
        langpair: `${sourceLang}|${targetLang}`
    });

    const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
    if (!res.ok) throw new Error(`Translation request failed (${res.status}).`);

    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (!translated || data.responseStatus === 403) {
        throw new Error(data?.responseDetails || 'No translation found.');
    }
    return translated;
}

export async function getSettings() {
    const { settings } = await chrome.storage.local.get('settings');
    return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

export async function saveSettings(partialSettings) {
    const current = await getSettings();
    const next = { ...current, ...partialSettings };
    await chrome.storage.local.set({ settings: next });
    return next;
}

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