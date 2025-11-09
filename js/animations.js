/**
 * IZZAD.STUDIO - ANIMATIONS MODULE
 * Handles scroll-triggered animations, parallax, and microinteractions
 */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    
    const config = {
        animationThreshold: 0.15, // Percentage of element visible before animation
        parallaxIntensity: 0.3,   // Parallax effect strength (0-1)
        navHideThreshold: 100,    // Scroll distance before hiding nav
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // ==========================================
    // STATE
    // ==========================================
    
    let state = {
        lastScrollY: 0,
        ticking: false,
        observers: []
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    /**
     * Initialize animation module
     */
    function init() {
        if (config.reducedMotion) {
            console.log('Reduced motion preference detected - animations simplified');
            return;
        }

        setupScrollAnimations();
        setupParallax();
        setupNavigationBehavior();
        setupMicrointeractions();
        setupSmoothScroll();
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    
    /**
     * Setup Intersection Observer for scroll-triggered animations
     */
    function setupScrollAnimations() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Remove will-change after animation completes for performance
                    setTimeout(() => {
                        entry.target.classList.add('animation-complete');
                    }, 800);
                }
            });
        }, {
            threshold: config.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with animation classes
        const animationClasses = [
            '.fade-in-scroll',
            '.slide-in-left',
            '.slide-in-right',
            '.scale-in-scroll',
            '.stagger-item'
        ];

        animationClasses.forEach(className => {
            document.querySelectorAll(className).forEach(element => {
                animationObserver.observe(element);
            });
        });

        state.observers.push(animationObserver);

        // Auto-add animation classes to sections
        autoAddAnimationClasses();
    }

    /**
     * Automatically add animation classes to section content
     */
    function autoAddAnimationClasses() {
        // Animate section headers
        document.querySelectorAll('.section-title').forEach(title => {
            if (!title.classList.contains('fade-in-scroll')) {
                title.classList.add('fade-in-scroll');
            }
        });

        document.querySelectorAll('.section-subtitle').forEach(subtitle => {
            if (!subtitle.classList.contains('fade-in-scroll')) {
                subtitle.classList.add('fade-in-scroll');
            }
        });

        // Animate interlude text
        document.querySelectorAll('.interlude__text').forEach(text => {
            if (!text.classList.contains('visible')) {
                // Trigger animation after slight delay
                setTimeout(() => {
                    text.classList.add('visible');
                }, 500);
            }
        });

        // Animate photography section elements
        document.querySelectorAll('.photography__title, .photography__subtitle').forEach(el => {
            if (!el.classList.contains('fade-in-scroll')) {
                el.classList.add('fade-in-scroll');
            }
        });

        document.querySelectorAll('.photo-book, .photography__caption').forEach(el => {
            if (!el.classList.contains('scale-in-scroll')) {
                el.classList.add('scale-in-scroll');
            }
        });

        // Re-observe new elements
        if (state.observers[0]) {
            document.querySelectorAll('.fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in-scroll').forEach(el => {
                state.observers[0].observe(el);
            });
        }
    }

    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    
    /**
     * Setup subtle parallax scrolling effects
     */
    function setupParallax() {
        if (config.reducedMotion) return;

        const parallaxElements = document.querySelectorAll('.hero__container');

        window.addEventListener('scroll', () => {
            if (!state.ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax(parallaxElements);
                    state.ticking = false;
                });
                state.ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Update parallax element positions
     * @param {NodeList} elements - Elements to apply parallax
     */
    function updateParallax(elements) {
        const scrolled = window.pageYOffset;

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // Only apply parallax when element is in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = scrolled * config.parallaxIntensity;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // ==========================================
    // NAVIGATION BEHAVIOR
    // ==========================================
    
    /**
     * Setup navigation show/hide on scroll
     */
    function setupNavigationBehavior() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (!state.ticking) {
                window.requestAnimationFrame(() => {
                    handleNavigationScroll(nav);
                    state.ticking = false;
                });
                state.ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle navigation visibility on scroll
     * @param {HTMLElement} nav - Navigation element
     */
    function handleNavigationScroll(nav) {
        const currentScrollY = window.pageYOffset;

        // Don't hide nav if at top of page
        if (currentScrollY < config.navHideThreshold) {
            nav.classList.remove('nav--hidden');
            nav.classList.add('nav--visible');
        } 
        // Hide nav when scrolling down
        else if (currentScrollY > state.lastScrollY && currentScrollY > config.navHideThreshold) {
            nav.classList.add('nav--hidden');
            nav.classList.remove('nav--visible');
        } 
        // Show nav when scrolling up
        else if (currentScrollY < state.lastScrollY) {
            nav.classList.remove('nav--hidden');
            nav.classList.add('nav--visible');
        }

        state.lastScrollY = currentScrollY;
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    
    /**
     * Setup smooth scroll for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignore empty hash links
                if (href === '#' || href === '#!') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                if (mobileMenu?.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger?.classList.remove('active');
                }

                // Smooth scroll to target
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            });
        });
    }

    // ==========================================
    // MICROINTERACTIONS
    // ==========================================
    
    /**
     * Setup various microinteractions
     */
    function setupMicrointeractions() {
        setupButtonRipple();
        setupHoverEffects();
        setupFormInteractions();
    }

    /**
     * Add ripple effect to buttons
     */
    function setupButtonRipple() {
        const buttons = document.querySelectorAll('.hero__cta, .form-submit');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    width: 10px;
                    height: 10px;
                    left: ${x}px;
                    top: ${y}px;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: rippleEffect 0.6s ease-out;
                `;

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation to document
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Enhanced hover effects
     */
    function setupHoverEffects() {
        // Gallery items enhanced hover
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform';
            });

            item.addEventListener('mouseleave', function() {
                this.style.willChange = 'auto';
            });
        });

        // Process steps hover effect
        document.querySelectorAll('.process-step').forEach(step => {
            step.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform';
            });

            step.addEventListener('mouseleave', function() {
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 300);
            });
        });
    }

    /**
     * Form input interactions
     */
    function setupFormInteractions() {
        const inputs = document.querySelectorAll('.form-input');

        inputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                // Validate on blur
                if (this.value.trim() !== '') {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            });

            // Real-time validation feedback
            input.addEventListener('input', function() {
                const formGroup = this.parentElement;
                
                if (this.validity.valid) {
                    formGroup.classList.remove('error');
                }
            });
        });
    }

    // ==========================================
    // LOADING ANIMATIONS
    // ==========================================
    
    /**
     * Animate page load
     */
    function setupPageLoadAnimation() {
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
            
            // Trigger hero animations
            const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                }, index * 150);
            });
        });
    }

    // ==========================================
    // PERFORMANCE OPTIMIZATION
    // ==========================================
    
    /**
     * Clean up observers on page unload
     */
    function cleanup() {
        state.observers.forEach(observer => observer.disconnect());
        state.observers = [];
    }

    window.addEventListener('beforeunload', cleanup);

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean}
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Debounce function for performance
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function}
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for performance
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function}
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================
    // PUBLIC API
    // ==========================================
    
    window.IzzadAnimations = {
        init,
        setupScrollAnimations,
        setupParallax,
        isInViewport,
        debounce,
        throttle
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
