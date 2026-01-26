const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const data = JSON.parse(fs.readFileSync('session_data.json', 'utf8'));

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            @font-face { font-family: 'Playfair Display'; src: url('https://gītā.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
            @font-face { font-family: 'Arya'; src: url('https://gītā.bhgvd.com/fonts/Arya-Bold.ttf'); font-weight: 700; }
            @font-face { font-family: 'Rozha One'; src: url('https://gītā.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
            
            :root {
                /* We control this one value to shrink everything */
                --base-font: 55px; 
            }

            body {
                background-color: #0c4140; 
                margin: 0;
                height: 1080px;
                width: 1080px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .container {
                width: 1075px;
                height: 850px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center; 
                align-items: center;    
                gap: 40px;
                padding: 10px; 
                box-sizing: border-box; 
            }

            .sanskrit {
                font-family: 'Arya', sans-serif;
                color: #F9F7F2;
                /* Ratio: 100% of base */
                font-size: var(--base-font);
                line-height: 1.5;
                white-space: pre-wrap;
            }

            .english {
                font-family: 'Playfair Display', serif;
                color: #F9F7F2;
                /* Ratio: ~75% of base */
                font-size: calc(var(--base-font) * 0.75);
                line-height: 1.4;
                font-style: italic;
            }

            .domain {
                margin-top: 20px;
                font-family: 'Rozha One', serif;
                /* Ratio: ~53% of base */
                font-size: calc(var(--base-font) * 0.53);
                color: #F9F7F2;
                opacity: 0.6;
                letter-spacing: 2px;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="sanskrit">${data.sanskrit}</div>
                <div class="english">${data.image_english}</div>
                <div class="domain">gita.bhgvd.com</div>
            </div>
        </body>
        </html>
    `;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });
    
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    // Smart Shrink Logic using the CSS Variable
    await page.evaluate(() => {
        const container = document.querySelector('.container');
        const root = document.documentElement;
        let currentSize = 45; // Matches the initial --base-font

        // Shrink the base size until the container no longer overflows
        while (container.scrollHeight > 850 && currentSize > 15) {
            currentSize -= 1;
            root.style.setProperty('--base-font', currentSize + 'px');
        }
    });

    await page.screenshot({ path: 'final_render.png', type: 'jpeg', quality: 100 });
    await browser.close();
    console.log("Rendered with proportional scaling.");
})();