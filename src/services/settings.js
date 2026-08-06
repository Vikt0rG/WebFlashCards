// TODO: Add different source and target languages for each flashcard, so that a user can
// learn different languages
const DEFAULT_SETTINGS = { sourceLang: 'fr', targetLang: 'en' };

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