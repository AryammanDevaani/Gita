const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load your data
const gitaData = require('./gita.json');

// Config for languages
const languages = [
    { code: 'en', fileChar: 'e', key: 'English', fallback: 'translationEnglish', simple: 'simpleEnglish' },
    { code: 'hi', fileChar: 'h', key: 'Hindi', fallback: 'translationHindi', simple: 'simpleHindi' },
    { code: 'gu', fileChar: 'g', key: 'Gujarati', fallback: 'translationGujarati', simple: 'simpleGujarati' }
];

// Config for Devices (Verified Jan 2026)
const devices = [
    // --- iPhone 17 Series ---
    { suffix: '17pm',  width: 1320, height: 2868 }, 
    { suffix: '17air', width: 1260, height: 2736 },
    { suffix: '17p',   width: 1206, height: 2622 }, 
    { suffix: '17',    width: 1206, height: 2622 }, 

    // --- iPhone 16 Series ---
    { suffix: '16pm', width: 1320, height: 2868 }, 
    { suffix: '16pl', width: 1290, height: 2796 }, 
    { suffix: '16p',  width: 1206, height: 2622 }, 
    { suffix: '16',   width: 1179, height: 2556 },
    { suffix: '16e',  width: 1170, height: 2532 },

    // --- iPhone 15 Series ---
    { suffix: '15pm', width: 1290, height: 2796 },
    { suffix: '15pl', width: 1290, height: 2796 },
    { suffix: '15p',  width: 1179, height: 2556 },
    { suffix: '15',   width: 1179, height: 2556 }, 

    // --- iPhone 14 Series ---
    { suffix: '14pm', width: 1290, height: 2796 },
    { suffix: '14pl', width: 1284, height: 2778 },
    { suffix: '14p',  width: 1179, height: 2556 },
    { suffix: '14',   width: 1170, height: 2532 },

    // --- iPhone 13 Series ---
    { suffix: '13pm', width: 1284, height: 2778 },
    { suffix: '13p',  width: 1170, height: 2532 },
    { suffix: '13',   width: 1170, height: 2532 },

    // --- iPhone 12 Series ---
    { suffix: '12pm', width: 1284, height: 2778 },
    { suffix: '12p',  width: 1170, height: 2532 },
    { suffix: '12',   width: 1170, height: 2532 },

    // --- iPhone 11 Series ---
    { suffix: '11pm', width: 1242, height: 2688 },
    { suffix: '11p',  width: 1125, height: 2436 },
    { suffix: '11',   width: 828,  height: 1792 }
];

async function generateWallpapers() {
    // 1. Setup Output Directory (Renamed to 'wallpapers')
    const outputDir = 'wallpapers';
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    // 2. Pick a Random Verse
    const verseIndex = Math.floor(Math.random() * gitaData.length);
    const verse = gitaData[verseIndex];
    console.log(`Selected Chapter ${verse.chapter}, Verse ${verse.verse}`);

    // 3. Launch Browser
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();

    // 4. Loop through languages first
    for (const lang of languages) {
        
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
                
                @font-face { font-family: 'fonthindi'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/fonthindi.ttf'); }
                @font-face { font-family: 'fontgujarati'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/fontgujarati.ttf'); }
                
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

                .text-box {
                    position: relative;
                    /* Universal Positioning: 4% from visual center offset */
                    top: 12.5vh;
                    
                    width: 85vw; 
                    height: 55vh; 
                    
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding-top: 8vw;
                    box-sizing: border-box;
                }

                #verse-reference {
                    position: absolute;
                    top: -5vw; 
                    left: 50%;
                    transform: translateX(-50%);
                    
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    
                    background-color: #FFF7ED;
                    color: #B45309;
                    
                    padding: 1.6vw 4.1vw;
                    border-radius: 100px;
                    
                    font-size: 3vw;
                    font-weight: 700;
                    font-style: italic;
                    border: 3px solid rgba(180, 83, 9, 0.1);
                    letter-spacing: 3px;
                    z-index: 10;
                    white-space: nowrap;
                    box-shadow: 0 10px 30px -10px rgba(180, 83, 9, 0.1);
                }

                #translation-text {
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    color: #2D2D2D;
                    
                    font-size: 6.2vw;
                    
                    line-height: 1.6;
                    font-style: italic;
                    text-align: center;
                    padding: 0 2vw;
                    max-height: 100%; 
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 11;
                    -webkit-box-orient: vertical;
                }

                .wallpaper-footer {
                    position: absolute;
                    top: -15vw;
                    
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-family: 'Rozha One', serif;
                    
                    font-size: 4.6vw;
                    
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

        // 5. Loop through ALL devices
        for (const device of devices) {
            await page.setViewport({ 
                width: device.width, 
                height: device.height, 
                deviceScaleFactor: 1 
            });

            // PATH UPDATE: Save inside 'wallpapers/' folder
            const fileName = `${outputDir}/${lang.fileChar}apple${device.suffix}.png`;
            
            await page.screenshot({ path: fileName });
            console.log(`Generated ${fileName}`);
        }
    }

    await page.close();
    await browser.close();
}

generateWallpapers();