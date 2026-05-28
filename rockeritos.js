/* ============================================================ */
/* PROJECT.JS — Lógica de la plantilla de proyecto              */
/* ============================================================ */

/* ============================================================ */
/* CAMBIO DE IDIOMA (igual que en index)                        */
/* ============================================================ */
let currentLang = 'es';

function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang === currentLang) return;

            currentLang = lang;
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('[data-es][data-en]').forEach(el => {
                const text = el.dataset[lang];
                if (text !== undefined) {
                    // Permite HTML (para las categorías con <br>)
                    el.innerHTML = text;
                }
            });

            document.documentElement.lang = lang;
        });
    });
}

/* ============================================================ */
/* CARRUSEL — con soporte touch/swipe para móvil                */
/* ============================================================ */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const slides = track.querySelectorAll('.slide');
    const total = slides.length;
    let current = 0;

    // Crear dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Teclado (accesibilidad)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch / swipe para móvil
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            goTo(diff > 0 ? current + 1 : current - 1);
        }
    }, { passive: true });
}

/* ============================================================ */
/* SCROLL REVEAL — slide up al entrar en viewport               */
/* ============================================================ */
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                if (entry.boundingClientRect.y > 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
    });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

/* ============================================================ */
/* INICIALIZACIÓN                                               */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initCarousel();
    initRevealAnimations();
});
