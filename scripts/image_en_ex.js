const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Read the structured data
    const data = JSON.parse(fs.readFileSync('content_data_en.json', 'utf8'));

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            @font-face { font-family: 'Playfair Display'; src: url('https://gītā.bhgvd.com/fonts/PlayfairDisplay-Italic.ttf'); font-style: italic; }
            @font-face { font-family: 'Arya'; src: url('https://gītā.bhgvd.com/fonts/Arya-Bold.ttf'); font-weight: 700; }
            @font-face { font-family: 'Rozha One'; src: url('https://gītā.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
            
            :root { --base-font: 50px; } /* Slightly smaller start base for explanations */

            body {
                background-color: #093030; 
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
                PADDING: 20px;
                box-sizing: border-box; 
            }

            /* Using Arya for the Header (Chapter X, Verse Y) */

            /* Using Playfair for the Explanation Body */
            .content {
                font-family: 'Playfair Display', serif;
                color: #F9F7F2;
                font-size: calc(var(--base-font) * 0.85);
                line-height: 1.5;
                font-style: italic;
                text-align: center;
            }

            .domain {
                margin-top: 20px;
                font-family: 'Rozha One', serif;
                font-size: 30px;
                color: #F9F7F2;
                opacity: 0.6;
                letter-spacing: 2px;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="content">${data.explanation}</div>
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

    await page.evaluate(() => {
        const container = document.querySelector('.container');
        const content = document.querySelector('.content');
        const root = document.documentElement;
        let currentSize = 50;

        const isOverflowing = () => {
            return container.scrollHeight > 850 || content.scrollWidth > container.clientWidth;
        };

        // Resize loop to fit long explanations
        while (isOverflowing() && currentSize > 15) {
            currentSize -= 0.5;
            root.style.setProperty('--base-font', currentSize + 'px');
        }
    });

    // Save as image_en_ex.png
    await page.screenshot({ path: 'image_en_ex.png', type: 'jpeg', quality: 100 });
    await browser.close();
    console.log("English Explanation Rendered.");
})();