const puppeteer = require('puppeteer');
const fs = require('fs');

// Load your data
const gitaData = require('./gita.json');

async function generateWallpaper() {
  // 1. Pick a Random Verse
  const verse = gitaData[Math.floor(Math.random() * gitaData.length)];
  
  // 2. Launch Browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 3. Set Size to iPhone 16 Pro Max (1320 x 2868)
  await page.setViewport({ width: 1320, height: 2868, deviceScaleFactor: 1 });

  // 4. The "Perfect Center" HTML Template
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
        /* FONTS (Load from your live site) */
        @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Regular.ttf'); font-weight: 400; }
        @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
        @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-SemiBold.ttf'); font-weight: 600; }
        @font-face { font-family: 'Rozha One'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }

        body {
            background-color: #F9F7F2;
            margin: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; /* Vertical Center */
            padding-top: 250px;      /* Clear Clock */
            padding-bottom: 150px;   /* Clear Home Bar */
            box-sizing: border-box;
        }

        .verse-card {
            margin-top: auto;
            margin-bottom: auto;
            text-align: center;
            width: 100%;
            padding: 0 100px; /* Side padding for high-res */
        }

        #verse-reference {
            background-color: #FFF7ED;
            color: #B45309;
            font-family: 'Playfair Display', serif;
            padding: 20px 50px;
            border-radius: 100px;
            font-size: 32px; /* Scaled for Image */
            font-weight: 700;
            font-style: italic;
            border: 2px solid rgba(180, 83, 9, 0.1);
            display: inline-block;
            margin-bottom: 80px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

        #translation-text {
            font-family: 'Playfair Display', serif;
            color: #444444;
            font-size: 110px; /* HUGE text for readability */
            line-height: 1.5;
            font-style: italic;
            margin: 0 auto;
        }

        .wallpaper-footer {
            font-family: 'Rozha One', serif;
            font-size: 55px;
            color: #B45309;
            opacity: 0.65;
            letter-spacing: 2px;
            margin-top: 0;
        }
    </style>
    </head>
    <body>
        <div class="verse-card">
            <div id="verse-reference">Chapter ${verse.chapter} • Verse ${verse.verse}</div>
            <div id="translation-text">${verse.simpleEnglish || verse.english}</div>
        </div>
        <div class="wallpaper-footer">gita.bhgvd.com</div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // --- SAFETY FIX: Wait for fonts to load before screenshotting ---
  await page.evaluateHandle('document.fonts.ready');
  // ---------------------------------------------------------------
  
  // 5. Save the image
  await page.screenshot({ path: 'wallpaper.png' });
  await browser.close();
}

generateWallpaper();