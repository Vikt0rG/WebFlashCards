// background.js — Manifest V3 service worker.
// Adds a right-click "Add to Vocab Library" action on any selected text.

import { translateText, flashBadge, addFlashcard, getSettings, saveWord } from './services/index.js';

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

    try {
        const { sourceLang, targetLang } = await getSettings();

        // TODO: Add translation functionality
        // const translation = await translateText(word, sourceLang, targetLang);
        const wordSaved = await saveWord(word);
        flashBadge(wordSaved ? '✓' : '•', wordSaved ? '#1F7A45' : '#dbbc22');

        // TODO: Flash card management
        // const result = await addFlashcard({ word, translation, sourceLang, targetLang });
    } catch (err) {
        console.error('Vocab Library: could not file card ->', err);
        flashBadge('!', '#B2402F');
    }
});