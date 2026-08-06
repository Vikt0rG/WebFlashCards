const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let currentRequestId = 0; // Track current request ID to manage badge updates

export async function flashBadge(text, color) {
    const requestId = ++currentRequestId;
    console.log('Request ID:', requestId);

    await chrome.action.setBadgeText({ text: '' });
    await delay(100);

    if (requestId !== currentRequestId) return;

    await chrome.action.setBadgeText({ text });
    await chrome.action.setBadgeBackgroundColor({ color });

    await delay(3000);

    if (requestId === currentRequestId) {
        await chrome.action.setBadgeText({ text: '' });
    }
}