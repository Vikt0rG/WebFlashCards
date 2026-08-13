const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let currentRequestId = 0;

/**
* Animated Status Icon on Extension Badge
* @param {string} status - The status of the icon ('success' or 'error')
*/
export async function flashIconStatus(status) {
    const requestId = ++currentRequestId;

    // Standard Chrome icon sizes (16x16, 32x32)
    const size = 32;
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const totalFrames = 15;

    // Scale up the green circle and draw the checkmark over time
    for (let frame = 1; frame <= totalFrames; frame++) {
        if (requestId !== currentRequestId) return;

        const progress = frame / totalFrames; // 0.0 to 1.0

        // 1. Clear previous frame
        ctx.clearRect(0, 0, size, size);

        // 2. Draw Background Circle (Scales up)
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, (size / 2 - 2) * progress, 0, Math.PI * 2);
        ctx.fillStyle = '#1F7A45';
        ctx.fill();

        // 3. Draw White Status symbol (Appears halfway through)
        if (progress > 0.4) {
            ctx.beginPath();
            ctx.moveTo(size * 0.28, size * 0.52);
            ctx.lineTo(size * 0.44, size * 0.68);
            ctx.lineTo(size * 0.72, size * 0.36);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        // 4. Push canvas frame to Chrome Extension Icon
        const imageData = ctx.getImageData(0, 0, size, size);
        chrome.action.setIcon({ imageData: { 32: imageData } });

        await delay(20);
    }

    // Hold the checkmark icon visible for 1.2 seconds
    await delay(1200);
    if (requestId !== currentRequestId) return;

    // Scale down and fade into the default icon
    for (let frame = totalFrames; frame >= 1; frame--) {
        if (requestId !== currentRequestId) return;

        const progress = frame / totalFrames; // 1.0 to 0.0

        ctx.clearRect(0, 0, size, size);

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, (size / 2 - 2) * progress, 0, Math.PI * 2);
        ctx.fillStyle = '#1F7A45';
        ctx.fill();

        if (progress > 0.4) {
            ctx.beginPath();
            ctx.moveTo(size * 0.28, size * 0.52);
            ctx.lineTo(size * 0.44, size * 0.68);
            ctx.lineTo(size * 0.72, size * 0.36);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        const imageData = ctx.getImageData(0, 0, size, size);
        await chrome.action.setIcon({ imageData: { 32: imageData } });

        await delay(20);
    }

    if (requestId !== currentRequestId) return;

    await resetIcon();
}

/**
* Resets the icon back to default manifest PNG files
*/
export async function resetIcon() {
    await chrome.action.setIcon({
        path: {
            16: '/assets/icons/icon16.png',
            32: '/assets/icons/icon32.png',
            48: '/assets/icons/icon48.png',
            128: '/assets/icons/icon128.png'
        }
    });
}