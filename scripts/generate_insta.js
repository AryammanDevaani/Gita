const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');

const verseData = JSON.parse(fs.readFileSync('todays_verse.json', 'utf8'));

// Register Fonts
registerFont('./fonts/Arya-Bold.ttf', { family: 'Arya' });
registerFont('./fonts/RozhaOne-Regular.ttf', { family: 'Rozha One' });
registerFont('./fonts/Inter-Regular.ttf', { family: 'Inter' });

async function createInstagramPost() {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, width, height);

    const margin = 100;
    const textWidth = width - (margin * 2);
    const centerX = width / 2;

    // Sanskrit
    ctx.fillStyle = '#EBCB8B';
    ctx.font = '50px "Arya"';
    ctx.textAlign = 'center';
    wrapText(ctx, verseData.sanskrit, centerX, 400, textWidth, 70);

    // English
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '40px "Rozha One"';
    wrapText(ctx, verseData.english, centerX, 800, textWidth, 60);

    // Footer
    ctx.fillStyle = '#555555';
    ctx.font = '30px "Inter"';
    ctx.fillText(`Chapter ${verseData.chapter} • Verse ${verseData.verse}`, centerX, height - 150);
    ctx.fillText('gita.bhgvd.com', centerX, height - 100);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('daily_post.png', buffer);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

createInstagramPost();