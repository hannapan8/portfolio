// /**
//  * Navigation Functionality
//  * Handles smooth scrolling, active navigation highlighting, and navigation interactions
//  */

// class Navigation {
//     constructor() {
//         this.sections = document.querySelectorAll('section[id]');
//         this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
//         this.currentSection = '';
//         this.isScrolling = false;
//         this.scrollTimeout = null;
        
//         this.init();
//     }

//     /**
//      * Initialize navigation functionality
//      */
//     init() {
//         this.setupSmoothScroll();
//         this.setupActiveNavigation();
//         this.setupKeyboardNavigation();
//         this.setupMobileNavigation();
//         this.handleHashChange();
//     }

//     /**
//      * Setup smooth scrolling for navigation links
//      */
//     setupSmoothScroll() {
//         // Handle all anchor links
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', (e) => {
//                 e.preventDefault();
                
//                 const targetId = anchor.getAttribute('href');
//                 const targetElement = document.querySelector(targetId);
                
//                 if (targetElement) {
//                     this.scrollToElement(targetElement, targetId);
//                 }
//             });
//         });

//         // Handle CTA button in hero
//         const ctaBtn = document.querySelector('.cta-btn');
//         if (ctaBtn) {
//             ctaBtn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const target = document.querySelector('#work') || document.querySelector('#projects');
//                 if (target) {
//                     this.scrollToElement(target, '#work');
//                 }
//             });
//         }
//     }

//     /**
//      * Smooth scroll to element with offset for fixed header
//      */
//     scrollToElement(element, hash = '') {
//         const header = document.querySelector('header');
//         const headerHeight = header ? header.offsetHeight : 0;
//         const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
//         const offsetPosition = elementPosition - headerHeight - 20; // 20px extra padding

//         // Set scrolling state
//         this.isScrolling = true;
        
//         // Update URL hash if provided
//         if (hash && hash !== window.location.hash) {
//             history.pushState(null, null, hash);
//         }

//         // Perform smooth scroll
//         window.scrollTo({
//             top: offsetPosition,
//             behavior: 'smooth'
//         });

//         // Reset scrolling state after animation
//         setTimeout(() => {
//             this.isScrolling = false;
//         }, 1000);
//     }

//     /**
//      * Setup active navigation highlighting
//      */
//     setupActiveNavigation() {
//         // Throttled scroll handler for performance
//         let ticking = false;
        
//         const updateActiveNavigation = () => {
//             if (this.isScrolling) {
//                 ticking = false;
//                 return;
//             }

//             const scrollPosition = window.scrollY + 200; // Offset for better UX
//             let currentSection = '';

//             // Find current section
//             this.sections.forEach(section => {
//                 const sectionTop = section.offsetTop;
//                 const sectionBottom = sectionTop + section.offsetHeight;
                
//                 if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
//                     currentSection = section.getAttribute('id');
//                 }
//             });

//             // Handle hero section specially (when at top of page)
//             if (window.scrollY < 100) {
//                 currentSection = 'home';
//             }

//             // Update navigation if section changed
//             if (currentSection !== this.currentSection) {
//                 this.updateActiveLink(currentSection);
//                 this.currentSection = currentSection;
//             }

//             ticking = false;
//         };

//         const requestTick = () => {
//             if (!ticking) {
//                 requestAnimationFrame(updateActiveNavigation);
//                 ticking = true;
//             }
//         };

//         window.addEventListener('scroll', requestTick, { passive: true });
        
//         // Initial check
//         updateActiveNavigation();
//     }

//     /**
//      * Update active navigation link
//      */
//     updateActiveLink(sectionId) {
//         // Remove active class from all links
//         this.navLinks.forEach(link => {
//             link.classList.remove('active');
//         });

//         // Add active class to current section link
//         if (sectionId) {
//             const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
//             if (activeLink) {
//                 activeLink.classList.add('active');
//             }
//         }
//     }

//     /**
//      * Setup keyboard navigation
//      */
//     setupKeyboardNavigation() {
//         document.addEventListener('keydown', (e) => {
//             // Handle arrow keys for section navigation
//             if (e.ctrlKey || e.metaKey) {
//                 let targetSection = null;

//                 switch (e.key) {
//                     case 'ArrowUp':
//                         e.preventDefault();
//                         targetSection = this.getPreviousSection();
//                         break;
//                     case 'ArrowDown':
//                         e.preventDefault();
//                         targetSection = this.getNextSection();
//                         break;
//                     case 'Home':
//                         e.preventDefault();
//                         targetSection = document.querySelector('#home');
//                         break;
//                     case 'End':
//                         e.preventDefault();
//                         targetSection = document.querySelector('#contact');
//                         break;
//                 }

//                 if (targetSection) {
//                     this.scrollToElement(targetSection, `#${targetSection.id}`);
//                 }
//             }

//             // Handle escape key to go to top
//             if (e.key === 'Escape') {
//                 const homeSection = document.querySelector('#home');
//                 if (homeSection) {
//                     this.scrollToElement(homeSection, '#home');
//                 }
//             }
//         });

//         // Handle tab navigation through nav links
//         this.navLinks.forEach((link, index) => {
//             link.addEventListener('keydown', (e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault();
//                     link.click();
//                 }
//             });
//         });
//     }

//     /**
//      * Get previous section relative to current
//      */
//     getPreviousSection() {
//         const sectionsArray = Array.from(this.sections);
//         const currentIndex = sectionsArray.findIndex(section => 
//             section.getAttribute('id') === this.currentSection
//         );
        
//         if (currentIndex > 0) {
//             return sectionsArray[currentIndex - 1];
//         }
//         return sectionsArray[0]; // Go to first section
//     }

//     /**
//      * Get next section relative to current
//      */
//     getNextSection() {
//         const sectionsArray = Array.from(this.sections);
//         const currentIndex = sectionsArray.findIndex(section => 
//             section.getAttribute('id') === this.currentSection
//         );
        
//         if (currentIndex < sectionsArray.length - 1) {
//             return sectionsArray[currentIndex + 1];
//         }
//         return sectionsArray[sectionsArray.length - 1]; // Stay at last section
//     }

//     /**
//      * Setup mobile navigation (if hamburger menu is added later)
//      */
//     setupMobileNavigation() {
//         // This is prepared for when you add mobile navigation
//         const mobileToggle = document.querySelector('.mobile-nav-toggle');
//         const navMenu = document.querySelector('.nav-links');
        
//         if (mobileToggle && navMenu) {
//             mobileToggle.addEventListener('click', () => {
//                 navMenu.classList.toggle('active');
//                 mobileToggle.classList.toggle('active');
//             });

//             // Close mobile nav when clicking a link
//             this.navLinks.forEach(link => {
//                 link.addEventListener('click', () => {
//                     navMenu.classList.remove('active');
//                     mobileToggle.classList.remove('active');
//                 });
//             });

//             // Close mobile nav when clicking outside
//             document.addEventListener('click', (e) => {
//                 if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
//                     navMenu.classList.remove('active');
//                     mobileToggle.classList.remove('active');
//                 }
//             });
//         }
//     }

//     /**
//      * Handle hash changes (browser back/forward buttons)
//      */
//     handleHashChange() {
//         const handleHash = () => {
//             const hash = window.location.hash;
//             if (hash) {
//                 const targetElement = document.querySelector(hash);
//                 if (targetElement) {
//                     // Small delay to ensure page is loaded
//                     setTimeout(() => {
//                         this.scrollToElement(targetElement);
//                     }, 100);
//                 }
//             }
//         };

//         // Handle initial hash on page load
//         window.addEventListener('load', handleHash);
        
//         // Handle hash changes
//         window.addEventListener('hashchange', handleHash);
//     }

//     /**
//      * Get section information
//      */
//     getSectionInfo() {
//         return {
//             current: this.currentSection,
//             all: Array.from(this.sections).map(section => ({
//                 id: section.getAttribute('id'),
//                 title: section.querySelector('h1, h2, .section-title')?.textContent || section.getAttribute('id'),
//                 position: section.offsetTop
//             }))
//         };
//     }

//     /**
//      * Scroll to section by ID
//      */
//     goToSection(sectionId) {
//         const targetElement = document.querySelector(`#${sectionId}`);
//         if (targetElement) {
//             this.scrollToElement(targetElement, `#${sectionId}`);
//         }
//     }

//     /**
//      * Add navigation progress indicator
//      */
//     addProgressIndicator() {
//         // Create progress bar
//         const progressBar = document.createElement('div');
//         progressBar.className = 'scroll-progress';
//         progressBar.style.cssText = `
//             position: fixed;
//             top: 0;
//             left: 0;
//             width: 0%;
//             height: 2px;
//             background: var(--text-primary);
//             z-index: 9999;
//             transition: width 0.1s ease;
//         `;
        
//         document.body.appendChild(progressBar);

//         // Update progress on scroll
//         window.addEventListener('scroll', () => {
//             const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
//             progressBar.style.width = Math.min(scrollPercent, 100) + '%';
//         }, { passive: true });
//     }

//     /**
//      * Destroy navigation (cleanup)
//      */
//     destroy() {
//         // Remove event listeners if needed
//         // This would be more comprehensive in a production app
//         this.sections = [];
//         this.navLinks = [];
//         this.currentSection = '';
//     }
// }

// /**
//  * Navigation Utilities
//  */
// const NavigationUtils = {
//     /**
//      * Create breadcrumb navigation
//      */
//     createBreadcrumb() {
//         const nav = document.querySelector('nav');
//         if (!nav) return;

//         const breadcrumb = document.createElement('div');
//         breadcrumb.className = 'breadcrumb';
//         breadcrumb.style.cssText = `
//             position: absolute;
//             top: 100%;
//             left: 0;
//             font-size: 0.8rem;
//             color: var(--text-muted);
//             opacity: 0;
//             transition: opacity 0.3s ease;
//         `;

//         nav.appendChild(breadcrumb);

//         // Update breadcrumb based on current section
//         const updateBreadcrumb = (sectionId) => {
//             const sectionTitles = {
//                 'home': 'Home',
//                 'about': 'About Me',
//                 'work': 'My Work',
//                 'experience': 'Experience',
//                 'contact': 'Contact'
//             };

//             breadcrumb.textContent = sectionTitles[sectionId] || '';
//             breadcrumb.style.opacity = sectionId ? '1' : '0';
//         };

//         return updateBreadcrumb;
//     },

//     /**
//      * Add keyboard shortcuts helper
//      */
//     showKeyboardShortcuts() {
//         const shortcuts = [
//             'Ctrl/Cmd + ↑/↓: Navigate sections',
//             'Ctrl/Cmd + Home: Go to top',
//             'Ctrl/Cmd + End: Go to contact',
//             'Esc: Return to top'
//         ];

//         console.info('🎹 Keyboard Shortcuts:\n' + shortcuts.join('\n'));
//     },

//     /**
//      * Create section skip links for accessibility
//      */
//     createSkipLinks() {
//         const skipLinks = document.createElement('nav');
//         skipLinks.className = 'skip-links';
//         skipLinks.setAttribute('aria-label', 'Skip navigation');
//         skipLinks.style.cssText = `
//             position: absolute;
//             top: -100px;
//             left: 0;
//             z-index: 10000;
//         `;

//         const sections = document.querySelectorAll('section[id]');
//         sections.forEach(section => {
//             const link = document.createElement('a');
//             link.href = `#${section.id}`;
//             link.textContent = `Skip to ${section.id}`;
//             link.style.cssText = `
//                 display: block;
//                 padding: 0.5rem 1rem;
//                 background: var(--bg-primary);
//                 color: var(--text-primary);
//                 text-decoration: none;
//                 border: 1px solid var(--border);
//             `;

//             // Show on focus
//             link.addEventListener('focus', () => {
//                 skipLinks.style.top = '0';
//             });

//             link.addEventListener('blur', () => {
//                 skipLinks.style.top = '-100px';
//             });

//             skipLinks.appendChild(link);
//         });

//         document.body.insertBefore(skipLinks, document.body.firstChild);
//     }
// };

// // Initialize navigation when DOM is loaded
// let navigation;

// document.addEventListener('DOMContentLoaded', () => {
//     navigation = new Navigation();
    
//     // Show keyboard shortcuts in console for power users
//     NavigationUtils.showKeyboardShortcuts();
    
//     // Create accessibility skip links
//     NavigationUtils.createSkipLinks();
// });

// // Export for use in other modules
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = { Navigation, NavigationUtils };
// }

/**
 * Navigation and Scroll Management
 * Handles smooth scrolling, active navigation, and scroll-based interactions
 */

class Navigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        this.currentSection = '';
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.throttleDelay = 16; // ~60fps
        
        this.init();
    }

    /**
     * Initialize navigation functionality
     */
    init() {
        this.setupSmoothScroll();
        this.setupActiveNavigation();
        this.setupScrollSpy();
        this.setupKeyboardNavigation();
        this.setupMobileNavigation();
        this.handleURLHash();
    }

    /**
     * Setup smooth scrolling for all anchor links
     */
    setupSmoothScroll() {
        // Handle all hash links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement, anchor);
                }
            });
        });

        // Handle logo click - scroll to top
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }

    /**
     * Smooth scroll to element with offset for fixed header
     */
    scrollToElement(element, triggerLink = null) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerHeight - 20; // Extra 20px padding

        // Set scrolling flag
        this.isScrolling = true;
        
        // Update active link immediately
        if (triggerLink) {
            this.updateActiveLink(triggerLink);
        }

        // Perform smooth scroll
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Clear scrolling flag after animation completes
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);

        // Update URL hash without jumping
        if (element.id) {
            history.pushState(null, null, `#${element.id}`);
        }
    }

    /**
     * Scroll to top smoothly
     */
    scrollToTop() {
        this.isScrolling = true;
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Update URL
        history.pushState(null, null, window.location.pathname);
        
        // Clear active nav
        this.navLinks.forEach(link => link.classList.remove('active'));

        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    /**
     * Setup scroll spy for active navigation highlighting
     */
    setupScrollSpy() {
        let ticking = false;

        const updateActiveNavigation = () => {
            if (this.isScrolling) {
                ticking = false;
                return;
            }

            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            let currentSection = '';

            // Check if we're at the very top
            if (scrollPosition < 100) {
                currentSection = 'home';
            }
            // Check if we're at the very bottom
            else if (scrollPosition + windowHeight >= documentHeight - 100) {
                const lastSection = this.sections[this.sections.length - 1];
                currentSection = lastSection ? lastSection.getAttribute('id') : '';
            }
            // Normal scroll spy logic
            else {
                this.sections.forEach(section => {
                    const sectionTop = section.offsetTop - 200; // Offset for header
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSection = section.getAttribute('id');
                    }
                });
            }

            // Update active navigation if section changed
            if (currentSection && currentSection !== this.currentSection) {
                this.currentSection = currentSection;
                this.updateActiveNavigation(currentSection);
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveNavigation);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Update active navigation highlighting
     */
    setupActiveNavigation() {
        // Initialize with first section
        const firstNavLink = this.navLinks[0];
        if (firstNavLink) {
            firstNavLink.classList.add('active');
            this.currentSection = firstNavLink.getAttribute('href').slice(1);
        }
    }

    /**
     * Update active navigation link
     */
    updateActiveNavigation(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Update active link directly (for immediate feedback)
     */
    updateActiveLink(clickedLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle arrow keys for navigation
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateToPrevSection();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateToNextSection();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.scrollToTop();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.scrollToBottom();
                        break;
                }
            }
            
            // Handle escape key
            if (e.key === 'Escape') {
                // Close any open mobile menu, etc.
                this.closeMobileMenu();
            }
        });

        // Handle tab navigation for accessibility
        this.navLinks.forEach(link => {
            link.addEventListener('focus', () => {
                link.style.outline = '2px solid var(--text-primary)';
                link.style.outlineOffset = '2px';
            });

            link.addEventListener('blur', () => {
                link.style.outline = '';
                link.style.outlineOffset = '';
            });
        });
    }

    /**
     * Navigate to previous section
     */
    navigateToPrevSection() {
        const currentIndex = Array.from(this.sections).findIndex(
            section => section.getAttribute('id') === this.currentSection
        );
        
        if (currentIndex > 0) {
            const prevSection = this.sections[currentIndex - 1];
            this.scrollToElement(prevSection);
        } else {
            this.scrollToTop();
        }
    }

    /**
     * Navigate to next section
     */
    navigateToNextSection() {
        const currentIndex = Array.from(this.sections).findIndex(
            section => section.getAttribute('id') === this.currentSection
        );
        
        if (currentIndex < this.sections.length - 1) {
            const nextSection = this.sections[currentIndex + 1];
            this.scrollToElement(nextSection);
        } else {
            this.scrollToBottom();
        }
    }

    /**
     * Scroll to bottom of page
     */
    scrollToBottom() {
        this.isScrolling = true;
        
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });

        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    /**
     * Setup mobile navigation (for future mobile menu implementation)
     */
    setupMobileNavigation() {
        // Mobile menu toggle functionality
        const createMobileMenuToggle = () => {
            const header = document.querySelector('header nav');
            if (!header || window.innerWidth > 768) return;

            // Check if toggle already exists
            if (document.querySelector('.mobile-menu-toggle')) return;

            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                display: block;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
            `;

            const navLinks = document.querySelector('.nav-links');
            
            toggle.addEventListener('click', () => {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            });

            header.appendChild(toggle);
        };

        // Create mobile menu on small screens
        createMobileMenuToggle();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const toggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (window.innerWidth > 768) {
                // Desktop view
                if (toggle) toggle.remove();
                if (navLinks) {
                    navLinks.style.display = '';
                    navLinks.style.flexDirection = '';
                    navLinks.style.position = '';
                    navLinks.style.top = '';
                    navLinks.style.left = '';
                    navLinks.style.right = '';
                    navLinks.style.background = '';
                    navLinks.style.padding = '';
                    navLinks.style.boxShadow = '';
                }
            } else {
                // Mobile view
                createMobileMenuToggle();
            }
        });
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    }

    /**
     * Handle URL hash on page load
     */
    handleURLHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                // Delay to ensure page is fully loaded
                setTimeout(() => {
                    this.scrollToElement(targetElement);
                }, 100);
            }
        }
    }

    /**
     * Get current section
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Manually set active section (useful for external calls)
     */
    setActiveSection(sectionId) {
        this.currentSection = sectionId;
        this.updateActiveNavigation(sectionId);
    }

    /**
     * Refresh navigation (useful for dynamic content)
     */
    refresh() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        this.setupSmoothScroll();
    }

    /**
     * Destroy navigation and cleanup
     */
    destroy() {
        // Remove event listeners and cleanup
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle) toggle.remove();
        
        // Reset nav links styles
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.cssText = '';
        }
    }
}

/**
 * Navigation Utilities
 */
const NavigationUtils = {
    /**
     * Scroll to element with custom offset
     */
    scrollTo(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Get scroll progress as percentage
     */
    getScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        return (scrollTop / docHeight) * 100;
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Get closest section to current scroll position
     */
    getClosestSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200; // Offset for header
        
        let closestSection = sections[0];
        let closestDistance = Math.abs(sections[0].offsetTop - scrollPosition);
        
        sections.forEach(section => {
            const distance = Math.abs(section.offsetTop - scrollPosition);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });
        
        return closestSection;
    }
};

// Initialize navigation when DOM is loaded
let navigation;

document.addEventListener('DOMContentLoaded', () => {
    navigation = new Navigation();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    if (hash && navigation) {
        const element = document.querySelector(hash);
        if (element) {
            navigation.scrollToElement(element);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Navigation, NavigationUtils };
}