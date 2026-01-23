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

const ipadDevices = [
    { suffix: 'ip13', width: 2064, height: 2752 }, // iPad Pro 13" (M4) / 12.9"
    { suffix: 'ip11', width: 1668, height: 2420 }, // iPad Pro 11" / Air
    { suffix: 'ipmini', width: 1488, height: 2266 },  // iPad Mini
    { suffix: 'ip10', width: 1640, height: 2360 }, // iPad 10th Gen
];

const androidTablets = [
    { suffix: 'tab16x10', width: 1600, height: 2560 } // Generic High-Res Tablet
];

// Config for Devices (Verified Jan 2026)
const devices = [
    // --- iPhone 17 Series ---
    { suffix: '17pm', width: 1320, height: 2868 },
    { suffix: '17air', width: 1260, height: 2736 },
    { suffix: '17p', width: 1206, height: 2622 },
    { suffix: '17', width: 1206, height: 2622 },

    // --- iPhone 16 Series ---
    { suffix: '16pm', width: 1320, height: 2868 },
    { suffix: '16pl', width: 1290, height: 2796 },
    { suffix: '16p', width: 1206, height: 2622 },
    { suffix: '16', width: 1179, height: 2556 },
    { suffix: '16e', width: 1170, height: 2532 },

    // --- iPhone 15 Series ---
    { suffix: '15pm', width: 1290, height: 2796 },
    { suffix: '15pl', width: 1290, height: 2796 },
    { suffix: '15p', width: 1179, height: 2556 },
    { suffix: '15', width: 1179, height: 2556 },

    // --- iPhone 14 Series ---
    { suffix: '14pm', width: 1290, height: 2796 },
    { suffix: '14pl', width: 1284, height: 2778 },
    { suffix: '14p', width: 1179, height: 2556 },
    { suffix: '14', width: 1170, height: 2532 },

    // --- iPhone 13 Series ---
    { suffix: '13pm', width: 1284, height: 2778 },
    { suffix: '13p', width: 1170, height: 2532 },
    { suffix: '13', width: 1170, height: 2532 },

    // --- iPhone 12 Series ---
    { suffix: '12pm', width: 1284, height: 2778 },
    { suffix: '12p', width: 1170, height: 2532 },
    { suffix: '12', width: 1170, height: 2532 },

    // --- iPhone 11 Series ---
    { suffix: '11pm', width: 1242, height: 2688 },
    { suffix: '11p', width: 1125, height: 2436 },
    { suffix: '11', width: 828, height: 1792 }
];

const desktopDevices = [
    { suffix: 'pc16x9', width: 3840, height: 2160 }, // 4K (Windows Standard)
    { suffix: 'pc16x10', width: 3456, height: 2234 }  // MacBook Pro 16
];

async function generateWallpapers() {
    // 1. Setup Output Directory
    const outputDir = 'wallpapers';
    if (!fs.existsSync(outputDir)) {
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

    // 4. Loop through languages
    for (const lang of languages) {

        // Determine text content
        const textContent = verse[lang.simple] || verse[lang.fallback];

        // HTML Template
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="${lang.code}">
            <head>
            <link rel="icon" type="image/png" href="/favicon.png">
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
                    top: 9.5vh;
                    
                    width: 85vw; 
                    height: 50vh; 
                    padding-top: 3.75vw;
                    
                    

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
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
                    
                    /* Default large size to test fitting */
                    font-size: 6.2vw; 
                    
                    line-height: 1.4;
                    font-style: italic;
                    text-align: center;
                    padding: 0 2vw;
                    
                    width: 100%;
                    max-height: 100%;
                    
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    
                    overflow: hidden; 
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
                    <div id="translation-text">
                        <span id="text-inner">${textContent}</span>
                    </div>
                    <div class="wallpaper-footer">gita.bhgvd.com</div>
                </div>
            </body>
            </html>
        `;

        // ... (Your existing Mobile logic ends here) ...

        // --- PART 2: DESKTOP WALLPAPERS (Sanskrit + Translation + Simple) ---

        // 1. Prepare Content (Verify 'verse.text' matches your JSON key for Sanskrit)
        const sanskritText = verse.sanskrit;
        const translationText = verse[lang.fallback];
        const simpleText = verse[lang.simple] ? verse[lang.simple] : ''; // Handle missing simple text

        // 2. Desktop HTML Template
        // 2. Desktop HTML Template
        const htmlDesktop = `
            <!DOCTYPE html>
            <html lang="${lang.code}">
            <head>
            <style>
                /* Import Fonts */
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Regular.ttf'); font-weight: 400; }
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-SemiBold.ttf'); font-weight: 600; }
                @font-face { font-family: 'Arya'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/Arya-Bold.ttf'); font-weight: 700; }
                @font-face { font-family: 'Rozha One'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
                @font-face { font-family: 'fonthindi'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/fonthindi.ttf'); }
                @font-face { font-family: 'fontgujarati'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/fontgujarati.ttf'); }
                
                body {
                    background-color: #5d4141;
                    margin: 0;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    
                    /* CHANGED: Align to top, then push down */
                    justify-content: flex-start;
                    
                    /* Adjust this to move the whole block UP or DOWN */
                    /* 28vh is roughly just below the standard Mac Clock */
                    padding-top: 28vh; 
                    
                    overflow: hidden;
                }

                .desktop-container {
                    width: 90vw;
                    
                    /* ADDED: Fixed height to force shrinking if text is too long */
                    height: 50vh; 
                    
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3vh;
                    
                    /* ADDED: Border to see the box */
                   
                }

                .verse-ref {
                    font-family: 'Playfair Display', serif;
                    background-color: #FFF7ED;
                    color: #B45309;
                    padding: 0.8vh 2vh;
                    border-radius: 100px;
                    font-size: 1.5vh;
                    font-weight: 700;
                    font-style: italic;
                    border: 2px solid rgba(180, 83, 9, 0.1);
                    letter-spacing: 2px;
                    margin-bottom: 2vh;
                }

                .sanskrit-text {
                    font-family: 'Arya', sans-serif;
                    font-weight: 700;
                    color: #F9F7F2;
                    font-size: 10vh;
                    line-height: 1.5;
                }

                .translation-text {
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    color: #F9F7F2;
                    font-size: 7vh;
                    line-height: 1.4;
                    font-style: italic;
                }

                .simple-text {
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    color: #F9F7F2;
                    font-size: 4vh;
                    line-height: 1.4;
                    margin-top: 1vh;
                    font-style: italic;
                }

                .footer {
                    font-family: 'Rozha One', serif;
                    font-size: 2.5vh;
                    color: #F9F7F2;
                    opacity: 0.65;
                    letter-spacing: 2px;
                    
                    /* Pushed to bottom of container */
                    margin-top: auto; 
                }
            </style>
            </head>
            <body>
                <div class="desktop-container">
                    <div class="verse-ref">Chapter ${verse.chapter} • Verse ${verse.verse}</div>
                    
                    <div class="sanskrit-text">${sanskritText}</div>
                    
                    <div class="translation-text">${translationText}</div>
                    
                    ${simpleText ? `<div class="simple-text">${simpleText}</div>` : ''}
                    
                    <div class="footer">gita.bhgvd.com</div>
                </div>
            </body>
            </html>
        `;
        


        // [INSERT START] --- ANDROID UNIVERSAL (20:9 Centered + iPhone Style) ---

        // 1. Android Specific Template 
        // Reuses 'textContent' (Simple/Translation) like iPhone, but centers it perfectly for 20:9
        const htmlAndroid = `
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
                    justify-content: center; /* Dead Center Vertical */
                    overflow: hidden;
                    position: relative;
                }

                .android-text-box {
                    position: relative;
                    /* No top offset, we rely on Flexbox centering */
                    
                    width: 85vw; 
                    /* Max height safety for center alignment */
                    max-height: 80vh;
                    
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding-top: 2vw; /* Slight breathing room */
                }

                .verse-pill {
                    position: absolute;
                    top: -6vw; /* Floating above */
                    left: 50%;
                    transform: translateX(-50%);
                    
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    background-color: #FFF7ED;
                    color: #B45309;
                    
                    padding: 1.5vw 4vw;
                    border-radius: 100px;
                    
                    font-size: 3vw;
                    font-weight: 700;
                    font-style: italic;
                    border: 3px solid rgba(180, 83, 9, 0.1);
                    letter-spacing: 2px;
                    z-index: 10;
                    white-space: nowrap;
                    box-shadow: 0 10px 30px -10px rgba(180, 83, 9, 0.1);
                }

                .main-text {
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    color: #2D2D2D;
                    
                    /* Initial Size */
                    font-size: 6.2vw; 
                    
                    line-height: 1.4;
                    font-style: italic;
                    text-align: center;
                    padding: 0 2vw;
                    width: 100%;
                }

                .top-footer {
                    position: absolute;
                    top: -16vw; /* Higher up than verse pill */
                    
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-family: 'Rozha One', serif;
                    font-size: 4.5vw;
                    color: #B45309;
                    opacity: 0.65;
                    letter-spacing: 2px;
                }
            </style>
            </head>
            <body>
                <div class="android-text-box">
                    <div class="top-footer">gita.bhgvd.com</div>
                    <div class="verse-pill">Chapter ${verse.chapter} • Verse ${verse.verse}</div>
                    
                    <div class="main-text" id="android-txt">
                        ${textContent}
                    </div>
                </div>
            </body>
            </html>
        `;

        // ... (Existing Android Phone generation code ends here) ...

        // [INSERT START] --- TABLET WALLPAPERS (iPad & Android Tab) ---
        // Uses the Mobile Light Theme (#F9F7F2) but with constrained width like Desktop

        // [INSERT START] --- TABLET WALLPAPERS (iPad & Android Tab) ---
        // Uses the Mobile Light Theme (#F9F7F2) with footer at the TOP

        // [INSERT START] --- TABLET WALLPAPERS (iPad & Android Tab) ---
        // Uses Mobile Light Theme. Footer is moved closer to the pill (-11vh vs -5vh).

        // [INSERT START] --- TABLET WALLPAPERS (iPad & Android Tab) ---
        // UPDATED: Matches Desktop Style (Dark + Sanskrit) but positioned lower

        // 1. Prepare Content (Copied from Desktop logic)
        const tabSanskrit = verse.sanskrit;
        const tabTranslation = verse[lang.fallback];
        const tabSimple = verse[lang.simple] ? verse[lang.simple] : '';

        const htmlTablet = `
            <!DOCTYPE html>
            <html lang="${lang.code}">
            <head>
            <style>
                /* Import Fonts */
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Regular.ttf'); font-weight: 400; }
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
                @font-face { font-family: 'Playfair Display'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/PlayfairDisplay-SemiBold.ttf'); font-weight: 600; }
                @font-face { font-family: 'Arya'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/Arya-Bold.ttf'); font-weight: 700; }
                @font-face { font-family: 'Rozha One'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
                @font-face { font-family: 'fonthindi'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/fonthindi.ttf'); }
                @font-face { font-family: 'fontgujarati'; src: url('https://xn--gt-ela0o.bhgvd.com/fonts/fontgujarati.ttf'); }
                
                body {
                    background-color: #5d4141; /* Desktop Dark Theme */
                    margin: 0;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start; 
    padding-top: 45vh; /* Adjust this to raise/lower the fixed starting point */
    overflow: hidden;
                }

                .tablet-container {
                    /* Width increased to 70vw (vs Desktop 45vw) because tablets are narrower */
                    width: 70vw; 
                    height: 40vw;
                    text-align: center;
                    display: flex;  
                    flex-direction: column;
                    align-items: center;
                    gap: 3vh;
                    position: relative;

                     
                }

                .verse-ref {
                    font-family: 'Playfair Display', serif;
                    background-color: #FFF7ED;
                    color: #B45309;
                    padding: 0.5vh 1vh;
                    border-radius: 100px;
                    font-size: 0.75vh; 
                    font-weight: 700;
                    font-style: italic;
                    border: 2px solid rgba(180, 83, 9, 0.1);
                    letter-spacing: 2px;
                    margin-top: .25vh;
                }

                .sanskrit-text {
                    font-family: 'Arya', sans-serif;
                    font-weight: 700;
                    color: #F9F7F2;
                    font-size: 2vh; 
                    line-height: 1.5;
                }

                .translation-text {
                    font-family: 'Playfair Display', 'fonthindi', 'fontgujarati', serif;
                    color: #F9F7F2;
                    font-size: 1.5vh;
                    line-height: 1.4;
                    font-style: italic;
                }



                .footer {
                    position: absolute;
                    /* CHANGE: Pin to top instead of bottom */
                    /* Negative value pulls it UP above the Verse Pill */
                    top: -5vh; 
                    bottom: auto; /* Ensure bottom is unset */
                    
                    font-family: 'Rozha One', serif;
                    font-size: 1.5vh;
                    color: #F9F7F2;
                    opacity: 0.65;
                    letter-spacing: 2px;
                    width: 100%;
                    text-align: center;
                }
            </style>
            </head>
            <body>
                <div class="tablet-container">
                    <div class="verse-ref">Chapter ${verse.chapter} • Verse ${verse.verse}</div>
                    
                    <div class="sanskrit-text">${tabSanskrit}</div>
                    
                    <div class="translation-text">${tabTranslation}</div>
                    
                    
                    
                    <div class="footer">gita.bhgvd.com</div>
                </div>
            </body>
            </html>
        `;

        await page.setContent(htmlTablet);
        await page.evaluateHandle('document.fonts.ready');
        // [INSERT THIS BLOCK] --- TABLET SMART SHRINK (UPDATED) ---
        await page.evaluate(() => {
            const container = document.querySelector('.tablet-container');
            const sanskrit = document.querySelector('.sanskrit-text');
            const translation = document.querySelector('.translation-text');
            
            // Variables to control shrinking
            let factor = 1.0;
            const minFactor = 0.5; // Don't shrink below 50%
            const step = 0.05;     // Shrink by 5% each step

            // Base sizes must match your CSS values exactly
            const baseSanskrit = 2.0; // matches .sanskrit-text { font-size: 2vh; }
            const baseTrans = 1.5;    // matches .translation-text { font-size: 1.5vh; }

            // Check if text is spilling out of the 40vw height container
            const isOverflowing = () => {
                return container.scrollHeight > container.clientHeight;
            };

            // Loop: Reduce font size until it fits
            while (isOverflowing() && factor > minFactor) {
                factor -= step;
                if (sanskrit) sanskrit.style.fontSize = (baseSanskrit * factor) + 'vh';
                if (translation) translation.style.fontSize = (baseTrans * factor) + 'vh';
            }
        });
        // [END INSERT]

        // Generate iPads

        // Generate iPads
        for (const device of ipadDevices) {
            await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: 1 });
            const fileName = `${outputDir}/${lang.fileChar}apple${device.suffix}.png`;
            await page.screenshot({ path: fileName });
            console.log(`Generated iPad: ${fileName}`);
        }

        // Generate Android Tablets
        for (const device of androidTablets) {
            await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: 1 });
            const fileName = `${outputDir}/${lang.fileChar}and${device.suffix}.png`;
            await page.screenshot({ path: fileName });
            console.log(`Generated Android Tab: ${fileName}`);
        }
        // [INSERT END]
        await page.setContent(htmlAndroid);
        await page.evaluateHandle('document.fonts.ready');

        // Android Smart Shrink
        await page.evaluate(() => {
            const container = document.getElementById('android-txt');
            const box = document.querySelector('.android-text-box');

            let fontSize = 6.2;
            const minSize = 3.0;
            const step = 0.1;

            // Limit height to 75% of screen to avoid clock/nav bars
            const maxHeight = window.innerHeight * 0.75;

            // Check overflow relative to screen safety or container width
            const isOverflowing = () => {
                return (box.offsetHeight > maxHeight) || (container.scrollWidth > container.clientWidth);
            };

            while (isOverflowing() && fontSize > minSize) {
                fontSize -= step;
                container.style.fontSize = fontSize + 'vw';
            }
        });

        // Screenshot (20:9 Aspect Ratio)
        await page.setViewport({ width: 1440, height: 3200, deviceScaleFactor: 1 });
        const androidFile = `${outputDir}/${lang.fileChar}and20x9.png`;
        await page.screenshot({ path: androidFile });
        console.log(`Generated Android: ${androidFile}`);

        await page.setContent(htmlDesktop);
        await page.evaluateHandle('document.fonts.ready');


        await page.setContent(htmlDesktop);
        await page.evaluateHandle('document.fonts.ready');

        // [INSERT START] --- DESKTOP SMART SHRINK ---
        await page.evaluate(() => {
            const container = document.querySelector('.desktop-container');
            const sanskrit = document.querySelector('.sanskrit-text');
            const translation = document.querySelector('.translation-text');
            const simple = document.querySelector('.simple-text');

            let factor = 1.0;
            const minFactor = 0.5; 
            const step = 0.05;

            // Base sizes (Must match CSS vh values)
            const baseSanskrit = 10.0; 
            const baseTrans = 7.0;
            const baseSimple = 4.0;

            const isOverflowing = () => {
                return container.scrollHeight > container.clientHeight;
            };

            while (isOverflowing() && factor > minFactor) {
                factor -= step;
                if (sanskrit) sanskrit.style.fontSize = (baseSanskrit * factor) + 'vh';
                if (translation) translation.style.fontSize = (baseTrans * factor) + 'vh';
                if (simple) simple.style.fontSize = (baseSimple * factor) + 'vh';
            }
        });
        // [INSERT END]

        // 3. Loop Desktop Devices

        // 3. Loop Desktop Devices
        for (const device of desktopDevices) {
            await page.setViewport({
                width: device.width,
                height: device.height,
                deviceScaleFactor: 1
            });

            // Name format: epc16x9.png
            const fileName = `${outputDir}/${lang.fileChar}${device.suffix}.png`;
            await page.screenshot({ path: fileName });
            console.log(`Generated Desktop: ${fileName}`);
        }

        await page.setContent(htmlContent);
        await page.evaluateHandle('document.fonts.ready');

        // --- SMART SHRINK LOGIC ---
        await page.evaluate(() => {
            const container = document.getElementById('translation-text');

            // 1. Match this to your CSS default (6.2vw)
            let fontSize = 6.2;
            const minSize = 3.0;
            const step = 0.1;

            // 2. Check if it is overflowing at the default size
            if (container.scrollHeight > container.clientHeight ||
                container.scrollWidth > container.clientWidth) {

                // 3. It IS overflowing, so start shrinking
                while (
                    (container.scrollHeight > container.clientHeight ||
                        container.scrollWidth > container.clientWidth) &&
                    fontSize > minSize
                ) {
                    fontSize -= step;
                    container.style.fontSize = fontSize + 'vw';
                }
            }
        });
        // --- END SHRINK LOGIC ---

        // 5. Loop through ALL devices
        for (const device of devices) {
            await page.setViewport({
                width: device.width,
                height: device.height,
                deviceScaleFactor: 1
            });

            const fileName = `${outputDir}/${lang.fileChar}apple${device.suffix}.png`;
            await page.screenshot({ path: fileName });
            console.log(`Generated ${fileName}`);
        }
    }

    await page.close();
    await browser.close();
}


generateWallpapers();