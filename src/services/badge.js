const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function flashBadge(text, color) {
    await chrome.action.setBadgeText({ text });
    await chrome.action.setBadgeBackgroundColor({ color });

    await delay(1600);

    await chrome.action.setBadgeText({ text: '' });
}