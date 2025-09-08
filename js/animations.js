/**
 * Scroll Animations and Visual Effects
 * Handles intersection observers, scroll-triggered animations, and text effects
 */

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observers = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize all animation systems
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupScrollObserver();
        this.setupHeaderEffect();
        this.setupParallaxEffects();
        this.setupTextAnimations();
        this.setupStaggeredAnimations();
        this.handleReducedMotion();
        
        this.isInitialized = true;
    }

    /**
     * Setup intersection observer for fade-in animations
     */
    setupScrollObserver() {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger any custom callbacks
                    const callback = entry.target.dataset.callback;
                    if (callback && this[callback]) {
                        this[callback](entry.target);
                    }
                }
            });
        }, this.observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            fadeInObserver.observe(el);
        });

        // Observe section titles separately for special effects
        document.querySelectorAll('.section-title').forEach(el => {
            fadeInObserver.observe(el);
        });

        this.observers.set('fadeIn', fadeInObserver);
    }

    /**
     * Setup header scroll effects
     */
    setupHeaderEffect() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (scrollY > lastScrollY && scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Setup parallax effects
     */
    setupParallaxEffects() {
        const heroScroll = document.querySelector('.hero-scroll');
        const projectVisuals = document.querySelectorAll('.project-visual');

        if (heroScroll || projectVisuals.length > 0) {
            let ticking = false;

            const updateParallax = () => {
                const scrolled = window.scrollY;
                
                // Hero scroll indicator parallax
                if (heroScroll) {
                    const heroSection = document.querySelector('.hero');
                    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
                    
                    if (scrolled < heroHeight) {
                        const parallaxValue = scrolled * 0.5;
                        heroScroll.style.transform = `translateY(${parallaxValue}px)`;
                        
                        // Fade out as user scrolls
                        const opacity = Math.max(0, 1 - (scrolled / heroHeight));
                        heroScroll.style.opacity = opacity;
                    }
                }

                // Project visuals subtle parallax
                projectVisuals.forEach((visual, index) => {
                    const rect = visual.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        const parallaxValue = (window.innerHeight - rect.top) * 0.1;
                        visual.style.transform = `translateY(${parallaxValue}px)`;
                    }
                });

                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestTick, { passive: true });
        }
    }

    /**
     * Setup text animations
     */
    setupTextAnimations() {
        // Animate hero title on load
        this.animateHeroText();
        
        // Setup typewriter effects for other elements
        this.setupTypewriterEffects();
    }

    /**
     * Animate hero title with letter-by-letter reveal
     */
    animateHeroText() {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        // Wait for page load to start animation
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.animateText(heroTitle, 80);
            }, 500);
        });
    }

    /**
     * Animate text letter by letter
     */
    animateText(element, delay = 50) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = '';
        
        let letterIndex = 0;
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            
            [...word].forEach((char) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'letter';
                span.style.animationDelay = `${letterIndex * delay}ms`;
                wordSpan.appendChild(span);
                letterIndex++;
            });
            
            element.appendChild(wordSpan);
            
            // Add space after word (except last word)
            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.className = 'letter';
                space.style.animationDelay = `${letterIndex * delay}ms`;
                element.appendChild(space);
                letterIndex++;
            }
        });
    }

    /**
     * Setup typewriter effects for specific elements
     */
    setupTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 100;
            
            // Setup intersection observer for this element
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeWriter(entry.target, text, speed);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    /**
     * Typewriter effect
     */
    typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    /**
     * Setup staggered animations for lists and grids
     */
    setupStaggeredAnimations() {
        // Skills list staggered animation
        const skillsList = document.querySelector('.skills-list');
        if (skillsList) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const items = entry.target.querySelectorAll('li');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateX(0)';
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            // Hide items initially
            skillsList.querySelectorAll('li').forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.6s ease';
            });
            
            observer.observe(skillsList);
        }

        // Experience items staggered animation
        const experienceItems = document.querySelectorAll('.experience-item');
        experienceItems.forEach((item, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            // Set initial state
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.8s ease';
            
            observer.observe(item);
        });
    }

    /**
     * Handle reduced motion preference
     */
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const disableAnimations = () => {
            document.body.classList.add('reduce-motion');
            
            // Immediately show all fade-in elements
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });
            
            // Stop all observers
            this.observers.forEach(observer => observer.disconnect());
        };
        
        if (prefersReducedMotion.matches) {
            disableAnimations();
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                disableAnimations();
            }
        });
    }

    /**
     * Callback for when projects section becomes visible
     */
    animateProjects(element) {
        const projects = element.querySelectorAll('.project');
        projects.forEach((project, index) => {
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    /**
     * Refresh all observers (useful for dynamic content)
     */
    refresh() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.isInitialized = false;
        this.init();
    }

    /**
     * Destroy all observers and cleanup
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.isInitialized = false;
    }
}

/**
 * Animation Utilities
 */
const AnimationUtils = {
    /**
     * Animate number counting up
     */
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const counter = () => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start < target) {
                requestAnimationFrame(counter);
            } else {
                element.textContent = target;
            }
        };
        
        counter();
    },

    /**
     * Create reveal animation for text
     */
    revealText(element, direction = 'up') {
        const directions = {
            up: 'translateY(100%)',
            down: 'translateY(-100%)',
            left: 'translateX(100%)',
            right: 'translateX(-100%)'
        };

        element.style.overflow = 'hidden';
        element.style.position = 'relative';
        
        const textContent = element.textContent;
        element.innerHTML = `<span style="
            display: inline-block;
            transform: ${directions[direction]};
            transition: transform 0.8s ease;
        ">${textContent}</span>`;
        
        // Trigger animation
        setTimeout(() => {
            element.querySelector('span').style.transform = 'translate(0)';
        }, 100);
    },

    /**
     * Create wave animation for text
     */
    waveText(element, delay = 100) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.animation = `wave 1s ease ${index * delay}ms infinite`;
            element.appendChild(span);
        });
        
        // Add wave keyframes if not already added
        if (!document.querySelector('#wave-keyframes')) {
            const style = document.createElement('style');
            style.id = 'wave-keyframes';
            style.textContent = `
                @keyframes wave {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Initialize animations when DOM is loaded
let scrollAnimations;

document.addEventListener('DOMContentLoaded', () => {
    scrollAnimations = new ScrollAnimations();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && scrollAnimations) {
        scrollAnimations.refresh();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollAnimations, AnimationUtils };
}