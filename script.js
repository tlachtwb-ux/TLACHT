/* ============================================================ */
/* VARIABLES GLOBALES */
/* ============================================================ */
let currentLang = 'es';
let isMobile = window.innerWidth <= 768;

/* ============================================================ */
/* LOADER - PANTALLA DE CARGA */
/* ============================================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    const counter = document.getElementById('counter');
    const loaderImage = document.getElementById('loaderImage');

    loaderImage.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"%3E%3Crect width="180" height="180" fill="%231E3A8A" rx="20"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23E8E2D5" font-family="Cinzel" font-size="24" font-weight="bold"%3ELOGO%3C/text%3E%3C/svg%3E';
    };

    let count = 0;
    const minDuration = 2000;
    const startTime = Date.now();

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / minDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        count = Math.floor(eased * 100);
        counter.textContent = count;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = '100';
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                    initScrollAnimations();
                }, 800);
            }, 400);
        }
    }

    updateCounter();
}

/* ============================================================ */
/* CAMBIO DE IDIOMA */
/* ============================================================ */
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
                if (text) el.textContent = text;
            });

            document.documentElement.lang = lang;
        });
    });
}

/* ============================================================ */
/* HERO PARALLAX - MOUSE HOVER CON ESCALADO ANTI-CORTE */
/* ============================================================ */
/* 
   PROBLEMA: Al mover las capas con translate, los bordes se
   descubren porque la imagen no es más grande que el contenedor.

   SOLUCIÓN: Escalar cada capa un poco más grande (ej: 1.08 = 8% más)
   y centrarla. Así al moverla, hay "margen" extra que evita el corte.

   Escala por capa:
   - back:  1 (5% más grande)
   - mid:   1 (8% más grande)
   - front: 1 (12% más grande)

   Cuanto más se mueve una capa, más grande debe ser la escala.
*/
function initHeroMouseParallax() {
    if (isMobile) return;

    const hero = document.getElementById('hero');
    const backLayer = document.querySelector('.hero-layer-back');
    const midLayer = document.querySelector('.hero-layer-mid');
    const frontLayer = document.querySelector('.hero-layer-front');

    if (!hero || !backLayer || !midLayer || !frontLayer) return;

    /* ============================================================ */
    /* AJUSTA ESTOS VALORES PARA CONTROLAR EL MOVIMIENTO DE CADA CAPA */
    /* ============================================================ */
    // Intensidad de movimiento (px)
    const backIntensity = 3;      // Fondo - MUY POCO
    const midIntensity = 5;       // Media - poco
    const frontIntensity = 14;      // Frontal - un poco más

    // ESCALA anti-corte: cuanto más se mueve, más grande la escala
    const backScale = 1.05;         // Fondo: 5% más grande
    const midScale = 1.08;          // Media: 8% más grande
    const frontScale = 1.12;        // Frontal: 12% más grande

    
    /* ============================================================ */

    // Variables para el cálculo
    let centerX = 0;
    let centerY = 0;

    function updateCenter() {
        const rect = hero.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
    }

    updateCenter();
    window.addEventListener('resize', updateCenter, { passive: true });

    function onMouseMove(e) {
        // Calcular offset desde el centro (normalizado -1 a 1)
        const offsetX = (e.clientX - centerX) / (window.innerWidth / 2);
        const offsetY = (e.clientY - centerY) / (window.innerHeight / 2);

        // Capa de FONDO (C1) - MUY POCO movimiento + escala
        const backX = offsetX * backIntensity;
        const backY = offsetY * backIntensity * 0.6;
        backLayer.style.transform = `translate3d(${backX}px, ${backY}px, 0) scale(${backScale})`;

        // Capa MEDIA (C2) - poco movimiento + escala
        const midX = offsetX * midIntensity;
        const midY = offsetY * midIntensity * 0.6;
        midLayer.style.transform = `translate3d(${midX}px, ${midY}px, 0) scale(${midScale})`;

        // Capa FRONTAL (C3) - más movimiento + mayor escala
        const frontX = offsetX * frontIntensity;
        const frontY = offsetY * frontIntensity * 0.6;
        frontLayer.style.transform = `translate3d(${frontX}px, ${frontY}px, 0) scale(${frontScale})`;
    }

    // Resetear suavemente cuando el mouse sale
    function onMouseLeave() {
        backLayer.style.transform = `translate3d(0, 0, 0) scale(${backScale})`;
        midLayer.style.transform = `translate3d(0, 0, 0) scale(${midScale})`;
        frontLayer.style.transform = `translate3d(0, 0, 0) scale(${frontScale})`;
    }

    // Eventos sobre el HERO
    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true });
    hero.addEventListener('mouseenter', updateCenter, { passive: true });

    // Estado inicial con escala
    backLayer.style.transform = `scale(${backScale})`;
    midLayer.style.transform = `scale(${midScale})`;
    frontLayer.style.transform = `scale(${frontScale})`;
}

/* ============================================================ */
/* SECCIÓN 3 - PARALLAX SCROLL (TEXTO RELLENO + CAPAS IGUALES) */
/* ============================================================ */
function initSection3Parallax() {
    const section = document.getElementById('parallax-text');
    const scrollingText = document.getElementById('scrollingText');
    const bgLayer = document.querySelector('.pt-background');
    const fgLayer = document.querySelector('.pt-foreground');

    if (!section || !scrollingText) return;

    let ticking = false;

    function updateParallax() {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionHeight = rect.height;

        const offset = viewportHeight * 0.2;
        const scrollProgress = Math.max(0, Math.min(1, 
            (-rect.top + offset) / (sectionHeight + viewportHeight - offset)
        ));

        if (rect.bottom > 0 && rect.top < viewportHeight) {
            if (bgLayer) {
                const bgSpeed = parseFloat(bgLayer.dataset.speed) || 0.3;
                const bgOffset = scrollProgress * bgSpeed * 200 - 50;
                bgLayer.style.transform = `translate3d(0, ${bgOffset}px, 0)`;
            }

            const textRange = 800;
            const textOffset = scrollProgress * textRange - 150;
            scrollingText.style.transform = `translate3d(${-textOffset}px, 0, 0)`;

            if (fgLayer) {
                const fgSpeed = parseFloat(fgLayer.dataset.speed) || 0.9;
                const fgOffset = scrollProgress * fgSpeed * 200 - 50;
                fgLayer.style.transform = `translate3d(0, ${fgOffset}px, 0)`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    updateParallax();
}

/* ============================================================ */
/* SCROLL ANIMATIONS - REVEAL ON SCROLL */
/* ============================================================ */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

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
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
    document.querySelectorAll('.section-title').forEach(title => observer.observe(title));
    document.querySelectorAll('.about-text').forEach(text => observer.observe(text));

    const socialLinks = document.querySelector('.social-links');
    const contactEmail = document.querySelector('.contact-email');
    if (socialLinks) observer.observe(socialLinks);
    if (contactEmail) observer.observe(contactEmail);
}

/* ============================================================ */
/* SMOOTH SCROLL PARA LINKS INTERNOS */
/* ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================================ */
/* DETECTAR MÓVIL Y AJUSTAR */
/* ============================================================ */
function checkMobile() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Solo resetear el parallax del HERO en móvil
        document.querySelectorAll('.hero-layer-back, .hero-layer-mid, .hero-layer-front').forEach(layer => {
            layer.style.transform = '';
        });
        // NO resetear pt-layer ni scrollingText - el parallax de texto funciona en móvil
    } else if (wasMobile && !isMobile) {
        initHeroMouseParallax();
        initSection3Parallax();
    }
}

/* ============================================================ */
/* INICIALIZACIÓN */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initLanguageSwitcher();
    initSmoothScroll();
    checkMobile();

    // Hero parallax solo en desktop
    if (!isMobile) {
        initHeroMouseParallax();
    }
    // Parallax de texto funciona en TODOS los dispositivos
    initSection3Parallax();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkMobile, 250);
    });
});
