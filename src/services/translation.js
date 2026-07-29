// TODO: Add different source and target languages for each flashcard, so that a user can
// learn different languages
const DEFAULT_SETTINGS = { sourceLang: 'fr', targetLang: 'en' };

// Quick, DOM-less entity decoder for Service Workers
function decodeHTMLEntities(text) {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

// TODO: Setup my own translator model locally? 
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
    const rawTranslation = data?.responseData?.translatedText;
    if (!rawTranslation || data.responseStatus === 403) {
        throw new Error(data?.responseDetails || 'No translation found.');
    }
    return decodeHTMLEntities(rawTranslation);
}