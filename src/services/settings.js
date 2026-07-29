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