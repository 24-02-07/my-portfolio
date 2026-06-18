/**
 * Vinut Piradi Portfolio - ECE Minimalist Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMouseSpotlight();
    initScrollReveal();
    initStatsCountUp();
    initContactForm();
});

/* ==========================================================================
   Navigation Menu & Header Scroll Modifications
   ========================================================================== */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header transparency changes on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile nav toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('open');
            if (navMenu) navMenu.classList.remove('open');
        });
    });

    // Highlight menu links active states based on scroll position
    const sections = document.querySelectorAll('main#hero, section');
    const navObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Trigger when section occupies the active view
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });
}

/* ==========================================================================
   Global Mouse Spotlight Tracker
   ========================================================================== */
function initMouseSpotlight() {
    // Set mouse coordinates dynamically on document root
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
}



/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -12% 0px', // Trigger when elements enter viewport
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/* ==========================================================================
   Contact Form Validation & Toast Simulator
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');
    if (!contactForm || !toastContainer) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform basic input validation
        const nameVal = document.getElementById('form-name').value.trim();
        const emailVal = document.getElementById('form-email').value.trim();
        const messageVal = document.getElementById('form-message').value.trim();

        if (nameVal && emailVal && messageVal) {
            // Success response triggers
            showToast('Message sent successfully! Thank you.', 'success');
            contactForm.reset();

            // Clear inputs float values cleanup
            const inputs = contactForm.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.value = '';
            });
        } else {
            showToast('Please fill out all fields before submitting.', 'error');
        }
    });

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        if (type === 'error') {
            toast.style.borderColor = '#ff4d4d';
        }
        
        // Crisp inline SVG icons for notifications
        const successIcon = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="toast-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        const errorIcon = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="toast-icon" style="color:#ff4d4d"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        
        toast.innerHTML = `
            ${type === 'error' ? errorIcon : successIcon}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger presentation reveal
        setTimeout(() => {
            toast.classList.add('show');
        }, 80);

        // Slide out animations triggers
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }
}

/* ==========================================================================
   Statistics Count-Up Animation
   ========================================================================== */
function initStatsCountUp() {
    const stats = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const rawVal = target.getAttribute('data-target');
                const targetVal = parseInt(rawVal, 10);
                const suffix = rawVal.replace(/[0-9]/g, '');
                let currentVal = 0;
                const duration = 1200;
                const steps = Math.min(targetVal, 60);
                const stepValue = targetVal / steps;
                const stepTime = duration / steps;
                let step = 0;

                const timer = setInterval(() => {
                    step++;
                    currentVal = Math.min(Math.round(stepValue * step), targetVal);
                    target.textContent = currentVal + suffix;
                    if (currentVal >= targetVal) {
                        clearInterval(timer);
                    }
                }, stepTime);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.1 });

    stats.forEach(stat => {
        const val = stat.textContent.trim();
        stat.setAttribute('data-target', val);
        stat.textContent = '0' + val.replace(/[0-9]/g, '');
        observer.observe(stat);
    });
}
