/**
 * 100Fe Landing Page - JavaScript
 * Tracking, interactividad y eventos
 */

const HOTMART_BASE_URL = 'https://pay.hotmart.com/E101603962K?checkoutMode=2';
const ATTRIBUTION_STORAGE_KEY = 'hotmartAttributionParams';

// ================================================================
// UTILIDADES
// ================================================================

/** Log seguro solo en desarrollo */
const log = (message, data = null) => {
    if (data) {
        console.log(`[100Fe] ${message}`, data);
    } else {
        console.log(`[100Fe] ${message}`);
    }
};

const getAttributionParamsFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    const result = {};

    keys.forEach((key) => {
        const value = params.get(key);
        if (value) {
            result[key] = value;
        }
    });

    return result;
};

const persistAttributionParams = () => {
    const current = getAttributionParamsFromUrl();
    if (Object.keys(current).length > 0) {
        localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(current));
        return current;
    }

    const stored = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!stored) return {};

    try {
        return JSON.parse(stored);
    } catch (error) {
        log('No se pudo parsear atribución guardada', error);
        return {};
    }
};

const buildCheckoutUrl = () => {
    const url = new URL(HOTMART_BASE_URL);
    const attribution = persistAttributionParams();

    Object.entries(attribution).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    return url.toString();
};

/** Enviar evento a Meta Pixel */
const trackPixelEvent = (eventName, data = {}) => {
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, data);
        log(`Pixel event tracked: ${eventName}`, data);
    } else {
        log(`Warning: fbq no disponible para evento: ${eventName}`);
    }
};

/** Enviar evento a Google Analytics 4 */
const trackGAEvent = (eventName, data = {}) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
        log(`GA4 event tracked: ${eventName}`, data);
    } else {
        log(`Warning: gtag no disponible para evento: ${eventName}`);
    }
};

// ================================================================
// INICIALIZACIÓN
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    log('Landing page loaded');
    persistAttributionParams();
    
    // Set footer year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Inicializar listeners
    initializeEventListeners();
    
    // Track page view (Meta Pixel ya lo hace automático con ViewContent)
    trackGAEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    log('Event listeners initialized');
});

// ================================================================
// EVENT LISTENERS
// ================================================================

function initializeEventListeners() {
    // CTA Buttons
    const heroCtaButton = document.getElementById('cta-hero');
    const mainCtaButton = document.getElementById('cta-main');
    const pricingCtaButton = document.getElementById('cta-pricing');
    const stickyCtaButton = document.getElementById('cta-sticky');
    
    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', handleCtaClick);
    }
    
    if (mainCtaButton) {
        mainCtaButton.addEventListener('click', handleCtaClick);
    }

    if (pricingCtaButton) {
        pricingCtaButton.addEventListener('click', handleCtaClick);
    }

    if (stickyCtaButton) {
        stickyCtaButton.addEventListener('click', handleCtaClick);
    }
    
    // Scroll tracking
    setupScrollTracking();
    
    // Sticky CTA
    setupStickyCta();
    
    // Testimonial interaction
    setupTestimonialTracking();
}

// ================================================================
// CTA BUTTON HANDLER
// ================================================================

function handleCtaClick(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const originalText = button.textContent;

    // Feedback visual inmediato
    button.textContent = 'Abriendo checkout...';
    button.disabled = true;
    button.style.opacity = '0.8';

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '';
    }, 3000);
    
    log('CTA clicked');
    
    // Track en Meta Pixel como AddToCart (usuario intenta comprar)
    trackPixelEvent('AddToCart', {
        content_name: '100 Ensenanzas Biblicas para Emprender',
        value: 149.64,
        currency: 'MXN'
    });
    
    // Track en GA4
    trackGAEvent('begin_checkout', {
        value: 149.64,
        currency: 'MXN',
        items: [{
            item_name: '100 Ensenanzas Biblicas para Emprender',
            item_category: 'ebook',
            quantity: 1,
            price: 149.64
        }]
    });

    trackGAEvent('select_item', {
        item_list_name: 'checkout_intent',
        items: [{
            item_name: 'Checkout Hotmart',
            item_category: 'ebook',
            quantity: 1
        }]
    });
    
    // Abrir checkout de Hotmart
    const checkoutUrl = buildCheckoutUrl();
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    log('Opening Hotmart checkout');
}

// ================================================================
// STICKY CTA
// ================================================================

function setupStickyCta() {
    const stickyCta = document.getElementById('sticky-cta');
    const hero = document.querySelector('.hero');
    if (!stickyCta || !hero) return;

    const showAfter = () => {
        const heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
            stickyCta.classList.add('is-visible');
            stickyCta.setAttribute('aria-hidden', 'false');
        } else {
            stickyCta.classList.remove('is-visible');
            stickyCta.setAttribute('aria-hidden', 'true');
        }
    };

    window.addEventListener('scroll', showAfter, { passive: true });
}

// ================================================================
// SCROLL TRACKING
// ================================================================

function setupScrollTracking() {
    let scrolledQuarters = new Set();
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight;
        const scrolled = window.scrollY + window.innerHeight;
        const scrollPercent = (scrolled / windowHeight) * 100;
        
        // Track 25%, 50%, 75%, 100% scroll depth
        const quarters = [25, 50, 75, 100];
        
        quarters.forEach(quarter => {
            if (scrollPercent >= quarter && !scrolledQuarters.has(quarter)) {
                scrolledQuarters.add(quarter);
                
                trackGAEvent('scroll', {
                    percent_scrolled: quarter
                });
                
                log(`Page scrolled to ${quarter}%`);
            }
        });
    });
}

// ================================================================
// TESTIMONIAL TRACKING
// ================================================================

function setupTestimonialTracking() {
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonials.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const testimonialName = entry.target.querySelector('.testimonial__name');
                const name = testimonialName ? testimonialName.textContent : 'Unknown';
                
                trackGAEvent('view_item', {
                    items: [{
                        item_name: `Testimonial: ${name}`,
                        item_category: 'testimonial'
                    }]
                });
                
                log(`Testimonial viewed: ${name}`);
                
                // Unobserve after tracking once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    testimonials.forEach(testimonial => observer.observe(testimonial));
}

// ================================================================
// HOTMART WIDGET HANDLER
// ================================================================

/**
 * NOTA: Cuando agregues el script de Hotmart, 
 * ejecutará código cuando el widget esté listo.
 * 
 * Agregar esto en el HTML del widget:
 * 
 * <script type="text/javascript">
 *   window.hotmartCheckoutReady = function() {
 *     window.dispatchEvent(new CustomEvent('hotmart-ready'));
 *   };
 * </script>
 */

window.addEventListener('hotmart-ready', () => {
    log('Hotmart widget is ready');
    
    trackGAEvent('view_item', {
        items: [{
            item_name: '100 Ensenanzas Biblicas para Emprender',
            item_category: 'ebook'
        }]
    });
});

// ================================================================
// PERFORMANCE MONITORING (Opcional)
// ================================================================

// Track Core Web Vitals si está disponible
if ('PerformanceObserver' in window) {
    try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            trackGAEvent('page_view', {
                page_structure: 'lcp_metric',
                value: lastEntry.renderTime || lastEntry.loadTime
            });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    trackGAEvent('page_view', {
                        page_structure: 'cls_metric',
                        value: clsValue
                    });
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
    } catch (e) {
        log('Performance monitoring not available', e);
    }
}

// ================================================================
// UTILS
// ================================================================

/** Utility: Smooth scroll fallback */
if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'auto';
}

/** Utility: Check if element is in viewport */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

log('Script loaded successfully');
