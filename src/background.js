// background.js — Manifest V3 service worker.
// Adds a right-click "Add to Vocab Library" action on any selected text.

import { SaveStatus } from './services/constants.js';
import { flashIconStatus } from './services/icon-animator.js';
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
        const translation = await translateText(word, sourceLang, targetLang);
        
        const wordSaved = await saveWord({ word, translation });

        if (wordSaved) {
            // Trigger the animated checkmark on the icon!
            flashIconStatus(SaveStatus.SUCCESS);
        }
    } catch (err) {
        console.error('Vocab Library: could not file card ->', err);
    }
});