/**
 * IZZAD.STUDIO - MAIN JAVASCRIPT
 * Core functionality, form validation, and mobile navigation
 */

(function() {
    'use strict';

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    /**
     * Initialize main functionality
     */
    function init() {
        setupMobileMenu();
        setupAccessibility();
        console.log('🎨 izzad — art gallery initialized');
    }

    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================
    
    /**
     * Setup mobile menu toggle
     */
    function setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const menuLinks = document.querySelectorAll('.nav-links a');

        if (!hamburger || !navLinks) return;

        // Toggle menu
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when clicking on links
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================
    
    /**
     * Setup contact form validation and submission
     */
    function setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                // Clear error on input
                const formGroup = input.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                }
            });
        });

        // Form submission
        form.addEventListener('submit', handleFormSubmit);
    }

    /**
     * Validate individual form field
     * @param {HTMLInputElement} field - Input field to validate
     * @returns {boolean} - Whether field is valid
     */
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        let errorMessage = '';

        // Required check
        if (field.hasAttribute('required') && !field.value.trim()) {
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Name validation (no numbers or special chars)
        else if (field.name === 'name' && field.value.trim()) {
            const nameRegex = /^[a-zA-Z\s'-]+$/;
            if (!nameRegex.test(field.value.trim())) {
                errorMessage = 'Please enter a valid name';
            }
        }
        // Message length validation
        else if (field.name === 'message' && field.value.trim()) {
            if (field.value.trim().length < 10) {
                errorMessage = 'Message must be at least 10 characters';
            }
        }

        // Display error or clear it
        if (errorMessage) {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
            field.setAttribute('aria-invalid', 'true');
            return false;
        } else {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
            field.setAttribute('aria-invalid', 'false');
            return true;
        }
    }

    /**
     * Validate entire form
     * @param {HTMLFormElement} form - Form to validate
     * @returns {boolean} - Whether form is valid
     */
    function validateForm(form) {
        const inputs = form.querySelectorAll('.form-input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    async function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('.form-submit');
        const successMessage = form.querySelector('.form-success');

        // Validate form
        if (!validateForm(form)) {
            // Focus first error field
            const firstError = form.querySelector('.form-group.error .form-input');
            if (firstError) firstError.focus();
            return;
        }

        // Collect form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await submitFormData(formData);

            // Show success message
            successMessage.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
            successMessage.classList.add('show');

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);

            // Track form submission (if analytics is set up)
            trackFormSubmission(formData);

        } catch (error) {
            // Show error message
            successMessage.textContent = 'Oops! Something went wrong. Please try again or email us directly.';
            successMessage.style.backgroundColor = '#dc2626';
            successMessage.classList.add('show');

            setTimeout(() => {
                successMessage.classList.remove('show');
                successMessage.style.backgroundColor = '';
            }, 5000);

            console.error('Form submission error:', error);
        } finally {
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    /**
     * Submit form data to backend
     * @param {Object} data - Form data
     * @returns {Promise}
     */
    async function submitFormData(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In production, replace with actual API endpoint:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
        */

        // For now, log to console
        console.log('Form submitted:', data);
        return { success: true };
    }

    /**
     * Track form submission for analytics
     * @param {Object} data - Form data
     */
    function trackFormSubmission(data) {
        // Google Analytics example:
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                event_category: 'Contact',
                event_label: 'Contact Form'
            });
        }

        // Facebook Pixel example:
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }

        console.log('Form submission tracked');
    }

    // ==========================================
    // ACCESSIBILITY
    // ==========================================
    
    /**
     * Setup accessibility features
     */
    function setupAccessibility() {
        // Add skip to main content link
        addSkipLink();

        // Improve focus visibility
        enhanceFocusIndicators();

        // Setup keyboard navigation hints
        setupKeyboardHints();

        // Detect and announce page changes for screen readers
        announcePageChanges();
    }

    /**
     * Add skip to main content link for keyboard users
     */
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#portfolio';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Enhance focus indicators for better visibility
     */
    function enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid #000;
                outline-offset: 2px;
            }

            .nav-links a:focus-visible,
            .portfolio-item:focus-visible {
                outline: 3px solid #fff;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup keyboard navigation hints
     */
    function setupKeyboardHints() {
        // Add keyboard hints to interactive elements
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.setAttribute('title', 'Press Enter or Space to view project');
        });

        // Add hint for modal carousel
        const modal = document.getElementById('portfolioModal');
        if (modal) {
            modal.setAttribute('data-keyboard-hint', 'Use Arrow keys to navigate, Escape to close');
        }
    }

    /**
     * Announce page changes to screen readers
     */
    function announcePageChanges() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'announcements';
        document.body.appendChild(liveRegion);
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    /**
     * Detect if user is on mobile device
     * @returns {boolean}
     */
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Get viewport dimensions
     * @returns {Object} - Width and height
     */
    function getViewportSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    }

    /**
     * Check if browser supports certain features
     * @returns {Object} - Feature support flags
     */
    function checkBrowserSupport() {
        return {
            intersectionObserver: 'IntersectionObserver' in window,
            webp: checkWebPSupport(),
            touch: 'ontouchstart' in window
        };
    }

    /**
     * Check WebP support
     * @returns {boolean}
     */
    function checkWebPSupport() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }

    /**
     * Log environment info for debugging
     */
    function logEnvironmentInfo() {
        const support = checkBrowserSupport();
        const viewport = getViewportSize();

        console.group('🎨 Izzad.Studio Environment');
        console.log('Mobile:', isMobile());
        console.log('Viewport:', viewport);
        console.log('Browser Support:', support);
        console.log('Reduced Motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        console.groupEnd();
    }

    // ==========================================
    // ERROR HANDLING
    // ==========================================
    
    /**
     * Global error handler
     */
    window.addEventListener('error', (event) => {
        console.error('JavaScript Error:', event.error);
        // In production, send to error tracking service
    });

    /**
     * Handle unhandled promise rejections
     */
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        // In production, send to error tracking service
    });

    // ==========================================
    // PERFORMANCE MONITORING
    // ==========================================
    
    /**
     * Log page load performance
     */
    window.addEventListener('load', () => {
        // Wait for performance data to be available
        setTimeout(() => {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;

                console.group('⚡ Performance Metrics');
                console.log('Page Load Time:', loadTime + 'ms');
                console.log('DOM Ready Time:', domReadyTime + 'ms');
                console.groupEnd();
            }
        }, 0);
    });

    // ==========================================
    // PUBLIC API
    // ==========================================
    
    window.IzzadStudio = {
        init,
        validateForm,
        isMobile,
        getViewportSize,
        checkBrowserSupport
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            logEnvironmentInfo();
        });
    } else {
        init();
        logEnvironmentInfo();
    }

})();
