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
            
            body {
                background-color: #5d4141; 
                margin: 0;
                height: 1350px;
                width: 1080px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .container {
                width: 800px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 40px;
            }

            .sanskrit {
                font-family: 'Arya', sans-serif;
                color: #F9F7F2;
                font-size: 45px;
                line-height: 1.6;
                white-space: pre-wrap;
            }

            .english {
                font-family: 'Playfair Display', serif;
                color: #F9F7F2;
                font-size: 34px;
                line-height: 1.4;
                font-style: italic;
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
                <div class="english">${data.image_english}</div>
                <div class="domain">gita.bhgvd.com</div>
            </div>
        </body>
        </html>
    `;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350 });
    await page.setContent(htmlTemplate);
    await page.evaluateHandle('document.fonts.ready');
    
    await page.screenshot({ path: 'final_render.png' });
    await browser.close();
    console.log("Visual rendered successfully.");
})();