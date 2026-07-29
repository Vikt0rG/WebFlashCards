let badgeTimer = null;

export function flashBadge(text, color) {
    if (badgeTimer) clearTimeout(badgeTimer);
    
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color });
    
    badgeTimer = setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
    }, 1600);
}