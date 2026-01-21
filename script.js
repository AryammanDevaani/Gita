let gitaData = [];
let currentVerseObj = null;
let warInterval = null;
let stopWarRequested = false;
let chapterObserver = null;
let chaptersObserver = null;

const MY_WEBSITE_URL = "gita.bhgvd.com";
const APP_TITLE = "Śrīmad Bhagavad Gītā";

const chapterTitlesEnglish = [
    "The Distress of Arjuna", "The Path of Knowledge", "The Path of Selfless Action",
    "Wisdom in Action", "The Path of Renunciation", "The Path of Meditation",
    "Knowledge and Realization", "The Imperishable Eternal", "The Royal Secret",
    "The Divine Splendor", "The Vision of the Cosmic Form", "The Path of Devotion",
    "Nature, the Enjoyer, and Consciousness", "The Three Modes of Material Nature",
    "The Supreme Divine Personality", "The Divine and Demoniac Natures",
    "The Three Divisions of Faith", "Liberation and Renunciation"
];

const chapterTitlesSanskrit = [
    "अर्जुनविषादयोग", "सांख्ययोग", "कर्मयोग", "ज्ञानकर्मसंन्यासयोग",
    "कर्मसंन्यासयोग", "ध्यानयोग", "ज्ञानविज्ञानयोग", "अक्षरब्रह्मयोग",
    "राजविद्याराजगुह्ययोग", "विभूतियोग", "विश्वरूपदर्शनयोग", "भक्तियोग",
    "क्षेत्रक्षेत्रज्ञविभागयोग", "गुणत्रयविभागयोग", "पुरुषोत्तमयोग",
    "दैवासुरसंपद्विभागयोग", "श्रद्धात्रयविभागयोग", "मोक्षसंन्यासयोग"
];

const wallpaperDevices = [
    { name: "iPhone 17 Pro Max", code: "17pm" },
    { name: "iPhone 17 Air", code: "17air" },
    { name: "iPhone 17 Pro", code: "17p" },
    { name: "iPhone 17", code: "17" },
    { name: "iPhone 16 Pro Max", code: "16pm" },
    { name: "iPhone 16 Plus", code: "16pl" },
    { name: "iPhone 16 Pro", code: "16p" },
    { name: "iPhone 16", code: "16" },
    { name: "iPhone 16e", code: "16e" },
    { name: "iPhone 15 Pro Max", code: "15pm" },
    { name: "iPhone 15 Plus", code: "15pl" },
    { name: "iPhone 15 Pro", code: "15p" },
    { name: "iPhone 15", code: "15" },
    { name: "iPhone 14 Pro Max", code: "14pm" },
    { name: "iPhone 14 Plus", code: "14pl" },
    { name: "iPhone 14 Pro", code: "14p" },
    { name: "iPhone 14", code: "14" },
    { name: "iPhone 13 Pro Max", code: "13pm" },
    { name: "iPhone 13 Pro", code: "13p" },
    { name: "iPhone 13", code: "13" },
    { name: "iPhone 12 Pro Max", code: "12pm" },
    { name: "iPhone 12 Pro", code: "12p" },
    { name: "iPhone 12", code: "12" },
    { name: "iPhone 11 Pro Max", code: "11pm" },
    { name: "iPhone 11 Pro", code: "11p" },
    { name: "iPhone 11", code: "11" }
];

const deviceShortcuts = {
    "17pm": {
        e: "",
        h: "",
        g: ""
    },
    "17air": {
        e: "",
        h: "",
        g: ""
    },
    "17p": {
        e: "",
        h: "",
        g: ""
    },
    "17": {
        e: "https://www.icloud.com/shortcuts/1443c78b7e1948d7ba00c4a549d71525",
        h: "https://www.icloud.com/shortcuts/00cf02efb1004506a866783f302decb0",
        g: "https://www.icloud.com/shortcuts/b2beda274da94a6ab4be80cc916fe4b3"
    },
    "16pm": {
        e: "",
        h: "",
        g: ""
    },
    "16pl": {
        e: "",
        h: "",
        g: ""
    },
    "16p": {
        e: "https://www.icloud.com/shortcuts/f5695e18f8ab4880a98640962e1f748e",
        h: "https://www.icloud.com/shortcuts/39542ad1b2884b4eb1115f316a870438",
        g: "https://www.icloud.com/shortcuts/c06e22e3c1bf4d0bada706a51750f2bf"
    },
    "16": {
        e: "",
        h: "",
        g: ""
    },
    "16e": {
        e: "https://www.icloud.com/shortcuts/f5c3f6457dc64535892c663021fdd693",
        h: "https://www.icloud.com/shortcuts/fad4125246d1404395e577140a3a55b4",
        g: "https://www.icloud.com/shortcuts/73d5fd14b6a54ff7bd9c160d17e33882"
    },
    "15pm": {
        e: "",
        h: "",
        g: ""
    },
    "15pl": {
        e: "",
        h: "",
        g: ""
    },
    "15p": {
        e: "",
        h: "",
        g: ""
    },
    "15": {
        e: "",
        h: "",
        g: ""
    },
    "14pm": {
        e: "",
        h: "",
        g: ""
    },
    "14pl": {
        e: "",
        h: "",
        g: ""
    },
    "14p": {
        e: "",
        h: "",
        g: ""
    },
    "14": {
        e: "",
        h: "",
        g: ""
    },
    "13pm": {
        e: "",
        h: "",
        g: ""
    },
    "13p": {
        e: "",
        h: "",
        g: ""
    },
    "13": {
        e: "",
        h: "",
        g: ""
    },
    "12pm": {
        e: "",
        h: "",
        g: ""
    },
    "12p": {
        e: "",
        h: "",
        g: ""
    },
    "12": {
        e: "https://www.icloud.com/shortcuts/c8589bc7c61c46f18ad7b0150d9f8025",
        h: "https://www.icloud.com/shortcuts/0914f3ae0d644627a1ad0690ebada620",
        g: "https://www.icloud.com/shortcuts/e75edbcd34d54305a69eedaeca5cb1b9"
    },
    "11pm": {
        e: "https://www.icloud.com/shortcuts/22139d1de91f4bf1bae30d1b149806fd",
        h: "https://www.icloud.com/shortcuts/a91d2b2cdbe84643bf283c8f15a2bf31",
        g: "https://www.icloud.com/shortcuts/ec19059925e5463d912b608a6da8e888"
    },
    "11p": {
        e: "https://www.icloud.com/shortcuts/ec8b4b21d4804abc999d28c399344832",
        h: "https://www.icloud.com/shortcuts/9afe05b0241d4b0daf1cd7b2941b540c",
        g: "https://www.icloud.com/shortcuts/496565502392448ba4cf8d710cf7228e"
    },
    "11": {
        e: "https://www.icloud.com/shortcuts/87223bca605e43d7bce3ce3ff238cc2e",
        h: "https://www.icloud.com/shortcuts/f4f14e329aef4b78834f64c6ca1da2d2",
        g: "https://www.icloud.com/shortcuts/db7bd7aee8f1445ab77362cf35562215"
    }
};

const views = {
    home: document.getElementById('view-home'),
    chapters: document.getElementById('view-chapters'),
    reader: document.getElementById('view-reader'),
    install: document.getElementById('view-install'),
    about: document.getElementById('view-about'),
    wallpaper: document.getElementById('view-wallpaper'),
};

const btnHome = document.getElementById('btn-home');
const btnChapters = document.getElementById('btn-chapters');
const btnInstallView = document.getElementById('btn-install-view');
const btnAbout = document.getElementById('btn-about');
const btnWallpaper = document.getElementById('btn-wallpaper');
const btnShare = document.getElementById('btn-share');
const navInstallBtn = document.getElementById('btn-install-view');
const btnChaptersBack = document.getElementById('btn-chapters-back');
const verseRefBtn = document.getElementById('verse-reference');

window.addEventListener('DOMContentLoaded', async () => {
    startWarLoop();

    try {
        const response = await fetch('gita.json');
        if (!response.ok) throw new Error("File not found");
        const rawData = await response.json();

        gitaData = rawData.map(item => {
            let cleanSanskrit = (item.text || item.shloka || item.sanskrit || "")
                .replace(/[0-9.|]+$/g, '').trim();

            if (cleanSanskrit && !cleanSanskrit.endsWith("।") && !cleanSanskrit.endsWith("॥")) {
                cleanSanskrit += " ।।";
            }

            return {
                chapter: item.chapter || item.chapter_number || 1,
                verse: item.verse || item.verse_number || 1,
                sanskrit: cleanSanskrit,
                english: (item.translationEnglish || item.translation || "Meaning unavailable.").trim(),
                hindi: item.translationHindi || item.hindi || "हिंदी अनुवाद उपलब्ध नहीं है।",
                gujarati: item.translationGujarati || item.gujarati || "ગુજરાતી અનુવાદ ઉપલબ્ધ નથી."
            };
        });

        gitaData.sort((a, b) => {
            if (a.chapter === b.chapter) return a.verse - b.verse;
            return a.chapter - b.chapter;
        });

        renderChapterList();
        stopWarRequested = true;

    } catch (error) {
        console.error("Fetch failed, War continues:", error);
    }
});

function startWarLoop() {
    const loader = document.getElementById('war-loader');
    const content = document.getElementById('verse-content');

    if (content) content.classList.add('hidden');
    if (loader) {
        loader.classList.remove('hidden');
        loader.innerHTML = '';
        loader.style.opacity = '1';
    }

    const fireVolley = () => {
        if (stopWarRequested) {
            clearInterval(warInterval);
            revealSuccess();
            return;
        }

        if (loader) {
            for (let i = 0; i < 100; i++) {
                fireProjectile(loader, 'left');
            }
            for (let i = 0; i < 5; i++) {
                fireProjectile(loader, 'right');
            }
        }
    };

    fireVolley();
    warInterval = setInterval(fireVolley, 2200);
}

function calculateBoxMetrics(targetElement, translations) {
    const ghost = targetElement.cloneNode(true);
    ghost.style.position = 'absolute';
    ghost.style.top = '-9999px';
    ghost.style.left = '-9999px';
    ghost.style.visibility = 'hidden';
    ghost.style.height = 'auto';
    ghost.style.width = targetElement.offsetWidth + 'px';
    ghost.style.padding = window.getComputedStyle(targetElement).padding;
    ghost.style.fontSize = '1.4rem';
    ghost.classList.remove('hidden');

    document.body.appendChild(ghost);

    const baseSize = 1.4;
    const maxSize = 2.4;

    ghost.textContent = translations.english;
    const hEng = ghost.offsetHeight;

    ghost.textContent = translations.hindi;
    const hHin = ghost.offsetHeight;

    ghost.textContent = translations.gujarati;
    const hGuj = ghost.offsetHeight;

    const maxHeight = Math.max(hEng, hHin, hGuj);

    function getOptimalSize(height) {
        if (height >= maxHeight) return baseSize + 'rem';
        let ratio = maxHeight / height;
        let newSize = baseSize * Math.sqrt(ratio);
        if (newSize > maxSize) newSize = maxSize;
        return newSize.toFixed(2) + 'rem';
    }

    const fsEng = getOptimalSize(hEng);
    const fsHin = getOptimalSize(hHin);
    const fsGuj = getOptimalSize(hGuj);

    document.body.removeChild(ghost);

    return {
        height: maxHeight + 'px',
        fs: {
            english: fsEng,
            hindi: fsHin,
            gujarati: fsGuj
        }
    };
}


function revealSuccess() {
    const loader = document.getElementById('war-loader');
    const content = document.getElementById('verse-content');

    if (loader) {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }

    if (gitaData.length > 0) {
        const randomIndex = Math.floor(Math.random() * gitaData.length);
        const verse = gitaData[randomIndex];
        currentVerseObj = verse;

        document.getElementById('sanskrit-text').textContent = verse.sanskrit;
        const textElem = document.getElementById('translation-text');

        document.getElementById('verse-reference').textContent = `Chapter ${verse.chapter} • Verse ${verse.verse}`;

        if (content) {
            content.classList.remove('hidden');

            const metrics = calculateBoxMetrics(textElem, verse);

            textElem.style.height = metrics.height;
            textElem.style.display = 'flex';
            textElem.style.alignItems = 'center';
            textElem.style.justifyContent = 'center';

            textElem.dataset.fsEng = metrics.fs.english;
            textElem.dataset.fsHin = metrics.fs.hindi;
            textElem.dataset.fsGuj = metrics.fs.gujarati;

            textElem.textContent = verse.english;
            textElem.style.fontSize = metrics.fs.english;
            textElem.dataset.lang = "english";

            textElem.classList.remove('fading-out');

            content.animate([
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
        }
    }
}

function fireProjectile(container, side) {
    if (!container) return;

    const arrow = document.createElement('div');
    arrow.classList.add('war-arrow');
    arrow.classList.add(side === 'left' ? 'arrow-left' : 'arrow-right');
    if (side === 'right') arrow.classList.add('arrow-hero');

    arrow.innerHTML = `
        <svg viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10H78" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M75 3L98 10L75 17L78 10L75 3Z" fill="currentColor"/>
            <path d="M5 2L25 10L5 10V2Z" fill="currentColor"/>
            <path d="M5 18L25 10L5 1V18Z" fill="currentColor"/>
        </svg>
    `;

    const w = window.innerWidth;
    const h = window.innerHeight;

    let startX = side === 'left' ? -150 : w + 150;
    let startY = h - (Math.random() * (h * 0.5));
    let endX = side === 'left' ? w + 150 : -150;
    let endY = (h * 0.2) + (Math.random() * (h * 0.5));

    let peakHeight = h * 0.1;
    let controlX = (startX + endX) / 2;
    let controlY = -peakHeight + (Math.random() * 100);

    const pathString = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
    arrow.style.offsetPath = `path('${pathString}')`;

    const scale = 0.8 + (Math.random() * 0.4);
    arrow.style.transform = `scale(${scale})`;
    arrow.style.zIndex = Math.floor(scale * 100);

    container.appendChild(arrow);

    const duration = 1500 + (Math.random() * 500);

    const animation = arrow.animate([
        { offsetDistance: '0%' },
        { offsetDistance: '100%' }
    ], {
        duration: duration,
        easing: 'linear',
        fill: 'forwards'
    });

    animation.finished.then(() => {
        arrow.remove();
    });
}

if (btnHome) {
    btnHome.onclick = () => {
        const isHomeActive = !views.home.classList.contains('hidden');
        if (isHomeActive) {
            smoothScrollTop(1000);
        } else {
            switchView('home');
        }
    };
}

if (btnChapters) {
    btnChapters.onclick = () => {
        const isReading = !views.reader.classList.contains('hidden');
        const isChaptersActive = !views.chapters.classList.contains('hidden');

        if (isReading || isChaptersActive) {
            smoothScrollTop(1000);
        } else {
            switchView('chapters');
        }
    };
}

if (btnChaptersBack) {
    btnChaptersBack.onclick = () => {
        smoothScrollTop(1000);
    };
}

if (verseRefBtn) {
    verseRefBtn.onclick = () => {
        if (currentVerseObj) {
            openChapter(currentVerseObj.chapter, currentVerseObj.verse);
        }
    };
}

if (btnInstallView) {
    btnInstallView.onclick = () => {
        const isInstallActive = !views.install.classList.contains('hidden');
        if (isInstallActive) {
            smoothScrollTop(1000);
        } else {
            switchView('install');
        }
    };
}

if (btnAbout) {
    btnAbout.onclick = () => {
        const isAboutActive = !views.about.classList.contains('hidden');
        if (isAboutActive) {
            smoothScrollTop(1000);
        } else {
            switchView('about');
        }
    };
}

if (btnWallpaper) {
    btnWallpaper.onclick = () => {
        const isWallpaperActive = !views.wallpaper.classList.contains('hidden');
        if (isWallpaperActive) {
            smoothScrollTop(1000);
        } else {
            switchView('wallpaper');
        }
    };
}

function switchView(viewName) {
    Object.values(views).forEach(el => {
        if (el) el.classList.add('hidden');
    });

    if (views[viewName]) views[viewName].classList.remove('hidden');

    [btnHome, btnChapters, btnInstallView, btnAbout, btnWallpaper].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });

    if (chapterObserver) chapterObserver.disconnect();
    if (chaptersObserver) chaptersObserver.disconnect();

    if (viewName === 'home') {
        btnHome.classList.add('active');
    } else if (viewName === 'chapters' || viewName === 'reader') {
        btnChapters.classList.add('active');
        btnChapters.textContent = "Chapters";

        if (viewName === 'chapters') {
            const header = document.getElementById('chapters-sticky-header');
            const sentinel = document.getElementById('chapters-sentinel');

            if (header && sentinel) {
                chaptersObserver = new IntersectionObserver((entries) => {
                    if (entries[0].intersectionRatio === 0) {
                        header.classList.add('stuck');
                    } else {
                        header.classList.remove('stuck');
                    }
                }, { threshold: [0, 1] });
                chaptersObserver.observe(sentinel);
            }
        }

    } else if (viewName === 'install') {
        btnInstallView.classList.add('active');
        updateInstallView();
    } else if (viewName === 'about') {
        btnAbout.classList.add('active');
    } else if (viewName === 'wallpaper') {
        btnWallpaper.classList.add('active');
        initWallpaperView();
    }

    fadeContent();
    window.scrollTo(0, 0);
}

function fadeContent() {
    const main = document.querySelector('main:not(.hidden)');
    if (!main) return;

    main.style.opacity = '0';
    main.style.transform = 'translateY(10px)';

    void main.offsetWidth;

    main.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
    }, 50);
}

function showRandomVerse() {
    stopWarRequested = false;
    startWarLoop();

    setTimeout(() => {
        if (gitaData.length > 0) {
            stopWarRequested = true;
        }
    }, 2000);
}

function renderChapterList() {
    const grid = document.getElementById('chapter-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 1; i <= 18; i++) {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `
            <div style="font-size: 0.8rem; color: #B45309; font-family: var(--font-english); font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">Chapter ${i}</div>
            <h3 style="margin-bottom: 0.5rem;">${chapterTitlesSanskrit[i - 1]}</h3>
            <p>${chapterTitlesEnglish[i - 1]}</p>
        `;
        card.onclick = () => openChapter(i);
        grid.appendChild(card);
    }
}

window.handleReaderBack = function () {
    const header = document.getElementById('sticky-header');

    if (header && header.classList.contains('stuck')) {
        smoothScrollTop(1000);
    } else {
        switchView('chapters');
    }
};

function openChapter(chapterNum, highlightVerse = null) {
    const chapterVerses = gitaData.filter(v => v.chapter == chapterNum);
    const container = document.getElementById('reader-content');
    const sanskritName = chapterTitlesSanskrit[chapterNum - 1];
    const englishMeaning = chapterTitlesEnglish[chapterNum - 1];

    if (chapterObserver) {
        chapterObserver.disconnect();
    }

    container.innerHTML = `
        <div id="sentinel" style="position:absolute; top:0; height:1px; width:100%;"></div>

        <div id="sticky-header" class="reader-header">
            <button id="btn-reader-back" onclick="handleReaderBack()" class="back-link" aria-label="Back / Top">
                ←
            </button>
            <div class="reader-header-text">
                <span class="reader-header-sub">Chapter ${chapterNum}</span>
                <span class="reader-header-title">${sanskritName}</span>
                <p style="color: #666; font-family: var(--font-english); font-style:italic;">
                ${englishMeaning}
            </p>
            </div>
        </div>
    `;

    chapterVerses.forEach(v => {
        const div = document.createElement('div');
        div.className = 'verse-block';
        div.id = `verse-${v.verse}`;

        div.innerHTML = `
            <button class="verse-pill" 
                    aria-label="Share Verse ${v.verse}"
                    onclick="captureVerseImage(this, ${v.chapter}, ${v.verse})">
                <svg class="share-icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span>Verse ${v.verse}</span>
            </button>

            <p class="sanskrit-verse-line">${v.sanskrit}</p>
            <p class="chapter-translation"
               onclick="handleChapterClick(this)"
               data-lang="english"
               data-english="${v.english.replace(/"/g, '&quot;')}"
               data-hindi="${v.hindi.replace(/"/g, '&quot;')}"
               data-gujarati="${v.gujarati.replace(/"/g, '&quot;')}">
               ${v.english}
            </p>
        `;
        container.appendChild(div);
    });

    switchView('reader');

    const verseBlocks = document.querySelectorAll('.verse-block .chapter-translation');
    verseBlocks.forEach(el => {
        const data = {
            english: el.dataset.english,
            hindi: el.dataset.hindi,
            gujarati: el.dataset.gujarati
        };
        const metrics = calculateBoxMetrics(el, data);
        el.style.height = metrics.height;
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';

        el.dataset.fsEng = metrics.fs.english;
        el.dataset.fsHin = metrics.fs.hindi;
        el.dataset.fsGuj = metrics.fs.gujarati;

        el.style.fontSize = metrics.fs.english;
        el.classList.remove('fading-out');
    });

    if (highlightVerse) {
        setTimeout(() => {
            const targetEl = document.getElementById(`verse-${highlightVerse}`);
            if (targetEl) {
                const header = document.querySelector('.reader-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight - 120;
                smoothScrollTo(offsetPosition, 3000);
            }
        }, 100);
    }

    const header = document.getElementById('sticky-header');
    const sentinel = document.getElementById('sentinel');

    chapterObserver = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio === 0) {
            header.classList.add('stuck');
        } else {
            header.classList.remove('stuck');
        }
    }, { threshold: [0, 1] });

    chapterObserver.observe(sentinel);
}

window.captureVerseImage = async function (btnElement, chapter, verse) {
    const originalContent = btnElement.innerHTML;
    btnElement.classList.add('loading');

    const verseObj = gitaData.find(v => v.chapter == chapter && v.verse == verse);
    if (!verseObj) {
        btnElement.classList.remove('loading');
        return;
    }

    const sanskrit = verseObj.sanskrit;
    const english = verseObj.english;

    const headerText = `${APP_TITLE} \u00A0|\u00A0 Chapter ${chapter} • Verse ${verse}`;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.zIndex = '-100';
    tempContainer.style.backgroundColor = '#F9F7F2';

    tempContainer.innerHTML = `
        <div id="temp-share-wrapper" style="width: 550px; padding: 3rem 2rem 3rem 2rem; border-radius: 20px; text-align: center; font-family: 'Playfair Display', serif; background-color: #F9F7F2;">
            <div style="margin-bottom: 3rem;">
                <span style="background-color: #FFF7ED; color: #B45309; padding: 0.6rem 1.5rem; border-radius: 100px; font-size: 0.9rem; font-weight: 700; font-style: italic; border: 1px solid rgba(180, 83, 9, 0.1); display: inline-block;">
                    ${headerText}
                </span>
            </div>
            <h1 style="font-family: 'Arya', sans-serif; font-size: 2.8rem; line-height: 1.5; color: #2D2D2D; font-weight: 400; margin: 2rem auto; white-space: pre-wrap;">${sanskrit}</h1>
            <p style="font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #666666; line-height: 1.8; margin: 0 auto; font-style: italic; white-space: pre-line;">${english}</p>
            <div style="font-family: 'Rozha One', serif; color: #B45309; font-size: 1.25rem; margin-top: 3rem; opacity: 0.7;">${MY_WEBSITE_URL}</div>
        </div>
    `;

    document.body.appendChild(tempContainer);

    try {
        const canvas = await html2canvas(tempContainer.querySelector('#temp-share-wrapper'), {
            scale: 2,
            useCORS: true,
            backgroundColor: "#F9F7F2"
        });

        const dataURL = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataURL)).blob();
        const file = new File([blob], 'Verse.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: APP_TITLE });
        } else {
            const a = document.createElement('a');
            a.download = 'Verse.png';
            a.href = dataURL;
            a.click();
        }
    } catch (err) {
        console.error("Share failed", err);
    } finally {
        document.body.removeChild(tempContainer);
        btnElement.classList.remove('loading');
    }
};

if (btnShare) {
    btnShare.addEventListener('click', async () => {
        const originalIcon = btnShare.innerHTML;
        btnShare.classList.add('loading');
        const cardToCapture = document.getElementById('shareable-card-wrapper');
        const verseRefSpan = document.getElementById('verse-reference');
        const originalRefText = verseRefSpan.textContent;

        try {
            const canvas = await html2canvas(cardToCapture, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#F9F7F2",
                windowWidth: 800,
                onclone: (clonedDoc) => {
                    const footer = clonedDoc.querySelector('.card-footer');
                    const ref = clonedDoc.getElementById('verse-reference');
                    const wrapper = clonedDoc.getElementById('shareable-card-wrapper');
                    const text = clonedDoc.getElementById('translation-text');

                    if (footer) {
                        footer.style.display = 'block';
                        footer.textContent = MY_WEBSITE_URL;
                    }
                    if (ref) {
                        ref.textContent = `${APP_TITLE} \u00A0|\u00A0 ${originalRefText}`;
                    }
                    if (wrapper) {
                        wrapper.style.width = "550px";
                        wrapper.style.margin = "0 auto";
                        wrapper.style.border = "0px solid #B45309";
                        wrapper.style.borderRadius = "20px";
                        wrapper.style.paddingBottom = "3rem";
                    }
                    if (text) {
                        text.style.height = 'auto';
                        text.style.display = 'block';
                    }
                }
            });

            const dataURL = canvas.toDataURL('image/png');
            const blob = await (await fetch(dataURL)).blob();
            const file = new File([blob], 'Verse.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: APP_TITLE });
            } else {
                const a = document.createElement('a');
                a.download = 'Verse.png';
                a.href = dataURL;
                a.click();
            }
        } catch (err) {
            console.error("Share failed", err);
        } finally {
            btnShare.classList.remove('loading');
            btnShare.innerHTML = originalIcon;
        }
    });
}

const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
const iosInstructions = document.getElementById('instructions-ios');
const androidInstructions = document.getElementById('instructions-android');
const successMsg = document.getElementById('install-success');
const desktopSafariInstructions = document.getElementById('instructions-desktop-safari');
const desktopChromeInstructions = document.getElementById('instructions-desktop-chrome');

function updateInstallView() {
    // 1. Hide everything initially
    if (iosInstructions) iosInstructions.classList.add('hidden');
    if (androidInstructions) androidInstructions.classList.add('hidden');
    if (desktopSafariInstructions) desktopSafariInstructions.classList.add('hidden');
    if (desktopChromeInstructions) desktopChromeInstructions.classList.add('hidden');
    if (successMsg) successMsg.classList.add('hidden');

    // 2. Check logic
    if (isStandalone) {
        if (successMsg) successMsg.classList.remove('hidden');
    } else if (isMobileDevice) {
        // Mobile Logic
        if (isIos) {
            if (iosInstructions) iosInstructions.classList.remove('hidden');
        } else {
            if (androidInstructions) androidInstructions.classList.remove('hidden');
        }
    } else {
        // Desktop Logic
        const ua = navigator.userAgent;
        // Detect Safari: It has "Safari" in UA but NOT "Chrome" (Chrome puts 'Safari' in its UA too)
        const isDesktopSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);

        if (isDesktopSafari) {
            if (desktopSafariInstructions) desktopSafariInstructions.classList.remove('hidden');
        } else {
            // Default to Chrome instructions for Chrome, Edge, Brave, Firefox, etc.
            if (desktopChromeInstructions) desktopChromeInstructions.classList.remove('hidden');
        }
    }
}

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (navInstallBtn) {
    // OLD LOGIC:
    // if (isMobileDevice && !isStandalone) { ... }

    // NEW LOGIC: Show on both Mobile and Desktop if not already installed
    if (!isStandalone) {
        navInstallBtn.style.display = 'block';
    } else {
        navInstallBtn.style.display = 'none';
    }
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('btn-submit-form');
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBRZqOEoZnnBZB1AYdT7jCLhAzwFIiBN_3Rzd_ethhEfvTDbxl1wFV326l4E-Udkwiqg/exec";

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        submitBtn.style.opacity = "0.75";
        formStatus.style.display = "none";

        const formData = new FormData(contactForm);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
                contactForm.reset();
                submitBtn.textContent = "Sent!";
                submitBtn.style.backgroundColor = "green";

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send";
                    submitBtn.style.backgroundColor = "var(--accent-gold)";
                    submitBtn.style.opacity = "1";
                    formStatus.style.display = "none";
                }, 3000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = "Try Again";
                submitBtn.style.opacity = "1";

                formStatus.textContent = "Something went wrong. Please try again.";
                formStatus.style.color = "red";
                formStatus.style.display = "block";
            });
    });
}

const homeTextElem = document.getElementById('translation-text');
if (homeTextElem) {
    homeTextElem.addEventListener('click', () => {
        if (!currentVerseObj) return;
        switchLanguage(homeTextElem, currentVerseObj);
    });
}

window.handleChapterClick = function (el) {
    const verseData = {
        english: el.dataset.english,
        hindi: el.dataset.hindi,
        gujarati: el.dataset.gujarati
    };
    switchLanguage(el, verseData);
};

function switchLanguage(element, dataObj) {
    element.classList.add('fading-out');

    setTimeout(() => {
        const currentLang = element.dataset.lang || "english";
        let nextLang, nextText, nextFs;

        if (currentLang === "english") {
            nextLang = "hindi";
            nextText = dataObj.hindi;
            nextFs = element.dataset.fsHin;
        } else if (currentLang === "hindi") {
            nextLang = "gujarati";
            nextText = dataObj.gujarati;
            nextFs = element.dataset.fsGuj;
        } else {
            nextLang = "english";
            nextText = dataObj.english;
            nextFs = element.dataset.fsEng;
        }

        element.textContent = nextText;
        element.dataset.lang = nextLang;
        element.style.fontSize = nextFs;

        element.classList.remove('fading-out');

    }, 600);
}

function smoothScrollTop(duration = 5000) {
    const start = window.scrollY;
    const startTime = performance.now();

    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 5);

        window.scroll(0, start * (1 - ease));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

function smoothScrollTo(target, duration) {
    const start = window.scrollY;
    const change = target - start;
    const startTime = performance.now();

    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Ease-out Quintic (power of 5) for ultra-smooth deceleration
        const ease = 1 - Math.pow(1 - progress, 5);

        window.scrollTo(0, start + (change * ease));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    requestAnimationFrame(animation);
}

// --- WALLPAPER VIEW LOGIC ---
// --- WALLPAPER VIEW LOGIC ---
function initWallpaperView() {
    const androidView = document.getElementById('wallpaper-android');
    const iosView = document.getElementById('wallpaper-ios');
    const windowsView = document.getElementById('wallpaper-windows');
    const macView = document.getElementById('wallpaper-mac');
    
    // iPhone Elements
    const deviceSelect = document.getElementById('wp-device');
    const langSelect = document.getElementById('wp-lang');
    const shortcutContainer = document.getElementById('shortcut-container');
    const btnGetShortcut = document.getElementById('btn-get-shortcut');
    const stepNameSpan = document.getElementById('shortcut-step-name');

    // Windows Elements
    const winRatioSelect = document.getElementById('win-ratio');
    const winLangSelect = document.getElementById('win-lang');
    const winDownloadArea = document.getElementById('win-download-area');
    const btnWinDownload = document.getElementById('btn-win-download');

    // 1. Reset all views
    if (iosView) iosView.classList.add('hidden');
    if (androidView) androidView.classList.add('hidden');
    if (windowsView) windowsView.classList.add('hidden');
    if (macView) macView.classList.add('hidden');

    // 2. Device Detection
    const ua = navigator.userAgent;
    const isIphone = /iPhone/i.test(ua) && !window.MSStream;
    const isWindows = /Win/i.test(ua);
    const isMac = /Mac/i.test(ua) && !/iPhone|iPod|iPad/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    // --- LOGIC: iPhone ---
    if (isIphone) {
        if (iosView) iosView.classList.remove('hidden');
        if (deviceSelect && deviceSelect.options.length <= 1) {
            wallpaperDevices.forEach(dev => {
                const links = deviceShortcuts[dev.code];
                if (links && (links.e || links.h || links.g)) {
                    deviceSelect.add(new Option(dev.name, dev.code));
                }
            });
        }
    } 
    // --- LOGIC: Windows ---
    else if (isWindows) {
        if (windowsView) windowsView.classList.remove('hidden');
        
        // Auto-detect Aspect Ratio
        if (winRatioSelect) {
            const ratio = window.screen.width / window.screen.height;
            // 16:10 is 1.6, 16:9 is 1.77
            if (ratio < 1.7) {
                winRatioSelect.value = "16x10";
            } else {
                winRatioSelect.value = "16x9";
            }
        }
    } 
    // --- LOGIC: Mac ---
    else if (isMac) {
        if (macView) macView.classList.remove('hidden');
    } 
    // --- LOGIC: Android/Other ---
    // --- LOGIC: Android/Other ---
    else {
        if (androidView) {
            androidView.classList.remove('hidden');
            
            // Inject the Interface if it's empty
            if (!document.getElementById('and-lang')) {
                androidView.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: var(--shadow-soft);">
                    <h3 style="font-family: var(--font-english); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 1.5rem; font-style: italic;">
                        For Android
                    </h3>

                    <div style="text-align: left; margin-bottom: 1.5rem;">
                        <label for="and-lang" style="display: block; font-family: var(--font-english); font-size: 0.9rem; margin-bottom: 0.5rem; font-style:italic; color: var(--text-secondary);">
                            Select Language
                        </label>
                        <select id="and-lang" style="width: 100%; padding: 0.8rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-family: 'Courier New', Courier, monospace; letter-spacing: -0.1em; font-size: 1rem; background: #fff; appearance: none;">
                            <option value="" disabled selected>Languages</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Gujarati">Gujarati</option>
                        </select>
                    </div>

                    <div id="and-actions" class="hidden" style="animation: fadeIn 0.5s ease; text-align: left;">
                        
                        <div style="background: #F9F7F2; border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(180, 83, 9, 0.1);">
                            <h4 style="font-family: var(--font-english); font-style:italic; color: #B45309; margin: 0 0 0.5rem 0;">
                                Automate Daily
                            </h4>
                            <p style="font-family: var(--font-english); font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.5;">
                                Download the MacroDroid file to automatically update your wallpaper every morning.
                            </p>
                            
                            <a id="btn-and-macro" href="#" download
                               style="display: block; text-align: center; text-decoration: none; background-color: var(--accent-gold); color: #fff; border: none; padding: 1rem; border-radius: 8px; font-family: var(--font-english); font-weight: 700; font-size: 1rem; cursor: pointer; transition: opacity 0.2s;">
                                DOWNLOAD MACRO
                            </a>
                        </div>
                        
                    </div>
                </div>
                `;
                
                // Logic
                const andLang = document.getElementById('and-lang');
                const andActions = document.getElementById('and-actions');
                const btnMacro = document.getElementById('btn-and-macro');
                
                if (andLang) {
                    andLang.onchange = () => {
                        const langName = andLang.value; // "English", "Hindi", "Gujarati"
                        if (langName) {
                            andActions.classList.remove('hidden');
                            
                            // LINK FORMAT: /Gita-English.mdr
                            // You must upload these 3 files to your repository
                            btnMacro.href = `/Gita-${langName}.mdr`;
                            
                            // Optional: Update button text to confirm selection
                            btnMacro.textContent = `DOWNLOAD ${langName.toUpperCase()} MACRO`;
                        }
                    };
                }
            }
        }
    }

    // --- HANDLER: iPhone Selection ---
    const updateIphoneLink = () => {
        const dev = deviceSelect.value;
        const lang = langSelect.value;
        
        // Update Lang dropdown based on device (simplified for brevity)
        // (You can keep your detailed updateLanguageOptions logic here if preferred)
        
        if (dev && lang) {
            shortcutContainer.classList.remove('hidden');
            stepNameSpan.textContent = `${lang}Apple${dev}`;
            const links = deviceShortcuts[dev];
            btnGetShortcut.href = links ? links[lang] : "#";
        } else {
            shortcutContainer.classList.add('hidden');
        }
    };
    
    // Update Language Options for iPhone
    const updateIphoneLangs = () => {
         const devVal = deviceSelect.value;
         const links = deviceShortcuts[devVal];
         while (langSelect.options.length > 1) langSelect.remove(1);
         if (links) {
             if (links.e) langSelect.add(new Option("English", "e"));
             if (links.h) langSelect.add(new Option("Hindi", "h"));
             if (links.g) langSelect.add(new Option("Gujarati", "g"));
         }
         langSelect.value = "";
         shortcutContainer.classList.add('hidden');
    }

    // --- HANDLER: Windows Selection ---
    const updateWindowsLink = () => {
        const ratio = winRatioSelect.value;
        const lang = winLangSelect.value;

        if (ratio && lang) {
            winDownloadArea.classList.remove('hidden');
            // Filename format: win-e-16x9.zip
            const filename = `win-${lang}-${ratio}.zip`;
            btnWinDownload.href = `/${filename}`;
        } else {
            winDownloadArea.classList.add('hidden');
        }
    };

    // --- EVENT LISTENERS ---
    if (deviceSelect) deviceSelect.onchange = updateIphoneLangs;
    if (langSelect) langSelect.onchange = updateIphoneLink;

    if (winRatioSelect) winRatioSelect.onchange = updateWindowsLink;
    if (winLangSelect) winLangSelect.onchange = updateWindowsLink;
}