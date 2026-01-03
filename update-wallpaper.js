const puppeteer = require('puppeteer');
const fs = require('fs');

// Load your data
const gitaData = require('./gita.json');

// Config for languages
const languages = [
    { code: 'en', key: 'English', fallback: 'translationEnglish', simple: 'simpleEnglish' },
    { code: 'hi', key: 'Hindi', fallback: 'translationHindi', simple: 'simpleHindi' },
    { code: 'gu', key: 'Gujarati', fallback: 'translationGujarati', simple: 'simpleGujarati' }
];

async function generateWallpapers() {
    // 1. Pick a Random Verse (Same verse for all languages)
    const verseIndex = Math.floor(Math.random() * gitaData.length);
    const verse = gitaData[verseIndex];
    console.log(`Selected Chapter ${verse.chapter}, Verse ${verse.verse}`);

    // 2. Launch Browser
    const browser = await puppeteer.launch();
    
    // 3. Loop through languages
    for (const lang of languages) {
        const page = await browser.newPage();
        
        // Set Size to iPhone 16 Pro Max (1320 x 2868)
        await page.setViewport({ width: 1320, height: 2868, deviceScaleFactor: 1 });

        // Determine text content
        const textContent = verse[lang.simple] || verse[lang.fallback];

        // HTML Template
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="${lang.code}">
            <head>
            <style>
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Regular.ttf'); font-weight: 400; }
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-SemiBold.ttf'); font-weight: 600; }
                @font-face { font-family: 'Rozha One'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
                
                body {
                    background-color: #F9F7F2;
                    margin: 0;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                }

                /* Fixed Box for Translation */
                .text-box {
                    position: relative; 
                    width: 1000px;
                    height: 1400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Verse Pill - Sitting on top edge of the box */
                #verse-reference {
                    position: absolute;
                    top: -60px; 
                    left: 50%;
                    transform: translateX(-50%);
                    
                    background-color: #FFF7ED;
                    color: #B45309;
                    font-family: 'Playfair Display', serif;
                    padding: 20px 50px;
                    border-radius: 100px;
                    font-size: 36px;
                    font-weight: 700;
                    font-style: italic;
                    border: 3px solid rgba(180, 83, 9, 0.1);
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    z-index: 10;
                    white-space: nowrap;
                    box-shadow: 0 10px 30px -10px rgba(180, 83, 9, 0.1);
                }

                /* Translation Text */
                #translation-text {
                    font-family: 'Playfair Display', serif;
                    color: #2D2D2D;
                    font-size: 75px; /* Decreased font size */
                    line-height: 1.6;
                    font-style: italic;
                    text-align: center;
                    padding: 0 20px;
                    
                    max-height: 100%; 
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 9;
                    -webkit-box-orient: vertical;
                }

                /* Footer Link - Now anchored to the bottom of the TEXT BOX */
                .wallpaper-footer {
                    position: absolute;
                    bottom: -100px; /* Positioned just below the box */
                    left: 0;
                    right: 0;
                    text-align: center;
                    
                    font-family: 'Rozha One', serif;
                    font-size: 55px;
                    color: #B45309;
                    opacity: 0.65;
                    letter-spacing: 2px;
                }
            </style>
            </head>
            <body>
                <div class="text-box">
                    <div id="verse-reference">Chapter ${verse.chapter} • Verse ${verse.verse}</div>
                    <div id="translation-text">${textContent}</div>
                    
                    <div class="wallpaper-footer">gita.bhgvd.com</div>
                </div>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        await page.evaluateHandle('document.fonts.ready');

        const fileName = `wallpaper-${lang.code}.png`;
        await page.screenshot({ path: fileName });
        console.log(`Generated ${fileName}`);
        
        await page.close();
    }

    await browser.close();
}

generateWallpapers();