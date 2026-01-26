const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // 1. Load the verse data picked by the Python script
    const verse = JSON.parse(fs.readFileSync('todays_verse.json', 'utf8'));

    // 2. Map your JSON keys to the template variables
    const tabSanskrit = verse.sanskrit;
    const tabTranslation = verse.english; // Or verse.threadsEnglish depending on preference

    const htmlTablet = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            /* Import Fonts */
            @font-face { font-family: 'Playfair Display'; src: url('https://gītā.bhgvd.com/fonts/PlayfairDisplay-Regular.ttf'); font-weight: 400; }
            @font-face { font-family: 'Playfair Display'; src: url('https://gītā.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
            @font-face { font-family: 'Playfair Display'; src: url('https://gītā.bhgvd.com/fonts/PlayfairDisplay-SemiBold.ttf'); font-weight: 600; }
            @font-face { font-family: 'Arya'; src: url('https://gītā.bhgvd.com/fonts/Arya-Bold.ttf'); font-weight: 700; }
            @font-face { font-family: 'Rozha One'; src: url('https://gītā.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
            
            body {
                background-color: #5d4141; 
                margin: 0;
                height: 1350px; /* Locked to Instagram Portrait Height */
                width: 1080px;  /* Locked to Instagram Portrait Width */
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start; 
                padding-top: 550px; /* Adjusting for 1350px height */
                overflow: hidden;
            }

            .tablet-container {
                width: 800px; 
                height: 500px;
                text-align: center;
                display: flex;  
                flex-direction: column;
                align-items: center;
                gap: 30px;
                position: relative;
            }

            .verse-ref {
                font-family: 'Playfair Display', serif;
                background-color: #FFF7ED;
                color: #B45309;
                padding: 10px 20px;
                border-radius: 100px;
                font-size: 18px; 
                font-weight: 700;
                font-style: italic;
                border: 2px solid rgba(180, 83, 9, 0.1);
                letter-spacing: 2px;
            }

            .sanskrit-text {
                font-family: 'Arya', sans-serif;
                font-weight: 700;
                color: #F9F7F2;
                font-size: 42px; 
                line-height: 1.5;
                white-space: pre-wrap;
            }

            .translation-text {
                font-family: 'Playfair Display', serif;
                color: #F9F7F2;
                font-size: 32px;
                line-height: 1.4;
                font-style: italic;
            }

            .footer {
                position: absolute;
                top: -80px; 
                font-family: 'Rozha One', serif;
                font-size: 32px;
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
                <div class="footer">gita.bhgvd.com</div>
                <div class="verse-ref">Chapter ${verse.chapter} • Verse ${verse.verse}</div>
                <div class="sanskrit-text">${tabSanskrit}</div>
                <div class="translation-text">${tabTranslation}</div>
            </div>
        </body>
        </html>
    `;

    // 3. Launch Puppeteer to "Take a Picture" of the HTML
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set the viewport to exactly Instagram Portrait size
    await page.setViewport({ width: 1080, height: 1350 });

    // Set the HTML content
    await page.setContent(htmlTablet);

    // Wait for fonts to load so text looks right
    await page.evaluateHandle('document.fonts.ready');

    // Run your Smart Shrink logic
    await page.evaluate(() => {
        const container = document.querySelector('.tablet-container');
        const sanskrit = document.querySelector('.sanskrit-text');
        const translation = document.querySelector('.translation-text');
        
        let factor = 1.0;
        const minFactor = 0.5;
        const step = 0.05;

        const baseSanskrit = 42; 
        const baseTrans = 32;    

        const isOverflowing = () => container.scrollHeight > container.clientHeight;

        while (isOverflowing() && factor > minFactor) {
            factor -= step;
            if (sanskrit) sanskrit.style.fontSize = (baseSanskrit * factor) + 'px';
            if (translation) translation.style.fontSize = (baseTrans * factor) + 'px';
        }
    });

    // 4. Save the screenshot as our daily post image
    await page.screenshot({ path: 'daily_post.png' });

    await browser.close();
    console.log("HTML Image generated successfully.");
})();