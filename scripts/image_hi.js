const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const data = JSON.parse(fs.readFileSync('content_data_hi.json', 'utf8'));

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            @font-face { font-family: 'HindiFont'; src: url('https://gītā.bhgvd.com/fonts/fonthindi.ttf'); }
            @font-face { font-family: 'Arya'; src: url('https://gītā.bhgvd.com/fonts/Arya-Bold.ttf'); font-weight: 700; }
            @font-face { font-family: 'Rozha One'; src: url('https://gītā.bhgvd.com/fonts/RozhaOne-Regular.ttf'); }
            
            :root { --base-font: 55px; }

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
                gap: 50px;
                PADDING: 20px;
                box-sizing: border-box; 
            }
            .sanskrit {
                font-family: 'Arya', sans-serif;
                color: #F9F7F2;
                font-size: var(--base-font);
                line-height: 1.6;
                white-space: pre; 
                display: block;
                width: 100%;
            }
            .translation {
                font-family: 'HindiFont', sans-serif;
                font-style:italic;
                color: #F9F7F2;
                font-size: calc(var(--base-font) * 0.90);
                line-height: 1.4;
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
                <div class="sanskrit">${data.sanskrit}</div>
                <div class="translation">${data.image_text}</div>
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
        const sanskrit = document.querySelector('.sanskrit');
        const root = document.documentElement;
        let currentSize = 45;
        const isOverflowing = () => {
            return container.scrollHeight > 850 || sanskrit.scrollWidth > sanskrit.clientWidth;
        };
        while (isOverflowing() && currentSize > 12) {
            currentSize -= 0.5;
            root.style.setProperty('--base-font', currentSize + 'px');
        }
    });

    await page.screenshot({ path: 'image_hi.png', type: 'jpeg', quality: 100 });
    await browser.close();
})();