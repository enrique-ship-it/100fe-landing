/**
 * 100Fe Landing Page - JavaScript
 * Tracking, interactividad y eventos
 */

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
    
    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', handleCtaClick);
    }
    
    if (mainCtaButton) {
        mainCtaButton.addEventListener('click', handleCtaClick);
    }
    
    // Scroll tracking
    setupScrollTracking();
    
    // Testimonial interaction
    setupTestimonialTracking();
}

// ================================================================
// CTA BUTTON HANDLER
// ================================================================

function handleCtaClick(event) {
    event.preventDefault();
    
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
    
    // Abrir checkout de Hotmart
    window.open('https://pay.hotmart.com/E101603962K?checkoutMode=2', '_blank');
    log('Opening Hotmart checkout');
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
