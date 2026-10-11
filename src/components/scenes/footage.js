const lerp = (a, b, t) => a + (b - a) * t;

/**
 * The full-width footage shown through the windshield: a looping video, or the car
 * image on a dark stage until a video is supplied.
 */
export function createFootage({ showreel, car }) {
    let video = null;
    let img = null;

    if (showreel.src) {
        video = document.createElement('video');
        video.src = showreel.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
    }
    const image = new Image();
    image.onload = () => (img = image);
    image.src = car;

    const frame = (ctx, cw, ch, scale, time) => {
        ctx.save();
        ctx.translate(cw / 2, ch / 2);
        ctx.scale(scale, scale);
        ctx.translate(-cw / 2, -ch / 2);
        if (video && video.readyState >= 2) {
            const r = Math.max(cw / video.videoWidth, ch / video.videoHeight);
            ctx.drawImage(video, (cw - video.videoWidth * r) / 2, (ch - video.videoHeight * r) / 2, video.videoWidth * r, video.videoHeight * r);
        } else {
            const bg = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.max(cw, ch) * 0.7);
            bg.addColorStop(0, '#2a0d12');
            bg.addColorStop(1, '#06101e');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, cw, ch);
            if (img) {
                const w = cw * (0.9 + Math.sin(time * 0.3) * 0.02);
                ctx.drawImage(img, (cw - w) / 2, (ch - w * (img.height / img.width)) / 2, w, w * (img.height / img.width));
            }
        }
        ctx.restore();
    };

    /** Draws the footage through an ellipse (the windshield) that opens to the full screen as e -> 1. */
    const draw = (ctx, cw, ch, anchor, e, time) => {
        ctx.clearRect(0, 0, cw, ch);
        if (e <= 0) {
            video?.pause();
            return;
        }
        if (video && e > 0.05 && video.paused) video.play().catch(() => {});
        ctx.save();
        if (e < 1) {
            const k = lerp(1, Math.max(cw, ch) / Math.max(anchor.rx, 1) * 1.1, e * e * (3 - 2 * e));
            ctx.beginPath();
            ctx.ellipse(anchor.x, anchor.y, anchor.rx * k, anchor.ry * k, 0, 0, Math.PI * 2);
            ctx.clip();
        }
        frame(ctx, cw, ch, lerp(1.3, 1, e), time);
        ctx.restore();
    };

    const dispose = () => video?.pause();
    return { draw, dispose };
}
