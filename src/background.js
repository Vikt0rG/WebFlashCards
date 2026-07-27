// background.js — Manifest V3 service worker.
// Adds a right-click "Add to Vocab Library" action on any selected text.

import { translateText, addFlashcard, getSettings } from './vocab-storage.js';

const MENU_ID = 'add-to-vocab-library';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: MENU_ID,
        title: 'File "%s" in Vocab Library',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId !== MENU_ID) return;

    const word = (info.selectionText || '').trim();
    if (!word) return;

    const { sourceLang, targetLang } = await getSettings();

    try {
        const translation = await translateText(word, sourceLang, targetLang);
        const result = await addFlashcard({ word, translation, sourceLang, targetLang });
        flashBadge(result.added ? '✓' : '•', result.added ? '#1F7A45' : '#8A8672');
    } catch (err) {
        console.error('Vocab Library: could not file card ->', err);
        flashBadge('!', '#B2402F');
    }
});

function flashBadge(text, color) {
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1600);
}