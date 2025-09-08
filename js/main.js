/**
 * Main Portfolio Application
 * Initialization and coordination of all portfolio functionality
 */

class Portfolio {
    constructor() {
        this.isLoaded = false;
        this.components = {};
        this.data = {
            projects: [],
            experience: [],
            skills: []
        };
        
        this.init();
    }

    /**
     * Initialize the entire portfolio application
     */
    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    /**
     * Start the portfolio application
     */
    async start() {
        try {
            // Show loading state
            this.showLoading();
            
            // Load external data (if any)
            await this.loadData();
            
            // Initialize all components
            this.initializeComponents();
            
            // Setup project interactions
            this.setupProjectInteractions();
            
            // Setup form handling
            this.setupContactForm();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Handle page load completion
            this.handlePageLoad();
            
        } catch (error) {
            console.error('Portfolio initialization failed:', error);
            this.handleError('Failed to initialize portfolio', error);
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
    }

    /**
     * Load external data (projects, experience, etc.)
     */
    async loadData() {
        // In a real implementation, you might load from JSON files or an API
        // For now, we'll use the data that's already in the HTML
        
        try {
            // You could uncomment these lines to load from external JSON files:
            // const projectsResponse = await fetch('./data/projects.json');
            // this.data.projects = await projectsResponse.json();
            
            // For now, extract data from existing DOM elements
            this.extractDataFromDOM();
            
        } catch (error) {
            console.warn('Could not load external data, using DOM content:', error);
            this.extractDataFromDOM();
        }
    }

    /**
     * Extract data from existing DOM elements
     */
    extractDataFromDOM() {
        // Extract projects
        const projectElements = document.querySelectorAll('.project');
        this.data.projects = Array.from(projectElements).map((project, index) => ({
            id: `project-${index}`,
            title: project.querySelector('h3')?.textContent || '',
            description: project.querySelector('.project-description')?.textContent || '',
            technologies: project.querySelector('.project-tech')?.textContent || '',
            element: project
        }));

        // Extract experience
        const experienceElements = document.querySelectorAll('.experience-item');
        this.data.experience = Array.from(experienceElements).map((exp, index) => ({
            id: `experience-${index}`,
            date: exp.querySelector('.experience-date')?.textContent || '',
            title: exp.querySelector('h3')?.textContent || '',
            company: exp.querySelector('.experience-company')?.textContent || '',
            description: exp.querySelector('.experience-description')?.textContent || '',
            element: exp
        }));

        // Extract skills
        const skillElements = document.querySelectorAll('.skills-list li');
        this.data.skills = Array.from(skillElements).map((skill, index) => ({
            id: `skill-${index}`,
            name: skill.textContent,
            element: skill
        }));
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        // Components are already initialized by their respective files
        // This is where you could store references if needed
        this.components.cursor = window.customCursor;
        this.components.animations = window.scrollAnimations;
        this.components.navigation = window.navigation;
    }

    /**
     * Setup project interactions and hover effects
     */
    setupProjectInteractions() {
        const projects = document.querySelectorAll('.project');
        
        projects.forEach((project, index) => {
            const visual = project.querySelector('.project-visual');
            const info = project.querySelector('.project-info');
            
            if (!visual || !info) return;

            // Enhanced hover effects
            project.addEventListener('mouseenter', () => {
                this.animateProjectHover(project, true);
            });

            project.addEventListener('mouseleave', () => {
                this.animateProjectHover(project, false);
            });

            // Click to expand/focus (optional enhancement)
            project.addEventListener('click', (e) => {
                if (!e.target.matches('a')) {
                    this.focusProject(project, index);
                }
            });

            // Setup lazy loading for project images (if you add them later)
            this.setupLazyLoading(visual);
        });
    }

    /**
     * Animate project hover effects
     */
    animateProjectHover(project, isHovering) {
        const visual = project.querySelector('.project-visual');
        const info = project.querySelector('.project-info');
        
        if (isHovering) {
            visual.style.transform = 'translateY(-20px) rotate(2deg) scale(1.05)';
            info.style.transform = 'translateY(-10px)';
            project.style.zIndex = '10';
        } else {
            visual.style.transform = 'translateY(0) rotate(0deg) scale(1)';
            info.style.transform = 'translateY(0)';
            project.style.zIndex = '1';
        }
    }

    /**
     * Focus on a specific project (optional feature)
     */
    focusProject(project, index) {
        // Add visual focus to the project
        project.classList.add('focused');
        
        // Remove focus after a delay
        setTimeout(() => {
            project.classList.remove('focused');
        }, 2000);
        
        // You could expand this to show more details, open a modal, etc.
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading(element) {
        // If you add real images later, this will handle lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                }
            });
        });
        
        observer.observe(element);
    }

    /**
     * Setup contact form handling
     */
    setupContactForm() {
        // If you add a contact form later, this will handle it
        const contactLinks = document.querySelectorAll('.contact-link');
        
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Track contact interactions
                this.trackEvent('contact', 'click', href);
                
                // Add visual feedback
                this.showContactFeedback(link);
            });
        });
    }

    /**
     * Show contact interaction feedback
     */
    showContactFeedback(element) {
        const originalText = element.textContent;
        
        // Temporarily change text to show feedback
        if (element.href && element.href.startsWith('mailto:')) {
            element.textContent = 'Opening email...';
            setTimeout(() => {
                element.textContent = originalText;
            }, 1000);
        }
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    console.log('Portfolio loaded in:', loadTime + 'ms');
                    
                    // You could send this data to analytics
                    this.trackEvent('performance', 'page_load_time', Math.round(loadTime));
                }, 0);
            });
        }

        // Monitor scroll performance
        let scrollCount = 0;
        window.addEventListener('scroll', () => {
            scrollCount++;
        }, { passive: true });

        // Report scroll performance every 30 seconds
        setInterval(() => {
            if (scrollCount > 0) {
                console.log('Scroll events in last 30s:', scrollCount);
                scrollCount = 0;
            }
        }, 30000);
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            this.handleError('JavaScript Error', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Unhandled Promise Rejection', e.reason);
        });
    }

    /**
     * Handle errors gracefully
     */
    handleError(message, error) {
        console.error(message, error);
        
        // In production, you might want to:
        // - Send errors to a logging service
        // - Show user-friendly error messages
        // - Gracefully degrade functionality
        
        // For now, just ensure the site still works
        this.ensureBasicFunctionality();
    }

    /**
     * Ensure basic functionality works even if advanced features fail
     */
    ensureBasicFunctionality() {
        // Make sure navigation still works
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.hasAttribute('data-fallback-handler')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                link.setAttribute('data-fallback-handler', 'true');
            }
        });

        // Ensure page is visible
        document.body.style.opacity = '1';
    }

    /**
     * Handle page load completion
     */
    handlePageLoad() {
        window.addEventListener('load', () => {
            // Fade in the page
            document.body.style.opacity = '1';
            document.body.classList.add('loaded');
            
            // Mark as loaded
            this.isLoaded = true;
            
            // Trigger any post-load animations
            this.triggerPostLoadAnimations();
            
            // Setup intersection observers for analytics
            this.setupAnalyticsTracking();
            
            console.log('🎉 Portfolio fully loaded and ready!');
        });
    }

    /**
     * Trigger post-load animations
     */
    triggerPostLoadAnimations() {
        // Add any special animations that should happen after everything loads
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '1';
        }
    }

    /**
     * Setup analytics tracking for section visibility
     */
    setupAnalyticsTracking() {
        const sections = document.querySelectorAll('section[id]');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.trackEvent('section_view', sectionId);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /**
     * Track events (placeholder for analytics)
     */
    trackEvent(category, action, label = '') {
        // In production, you might use Google Analytics, Mixpanel, etc.
        console.log('Track:', category, action, label);
        
        // Example Google Analytics call:
        // gtag('event', action, { event_category: category, event_label: label });
    }

    /**
     * Get portfolio data
     */
    getData() {
        return this.data;
    }

    /**
     * Update portfolio data
     */
    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.refreshComponents();
    }

    /**
     * Refresh all components
     */
    refreshComponents() {
        if (this.components.animations && this.components.animations.refresh) {
            this.components.animations.refresh();
        }
        
        if (this.components.navigation && this.components.navigation.refresh) {
            this.components.navigation.refresh();
        }
    }

    /**
     * Destroy portfolio and cleanup
     */
    destroy() {
        // Cleanup all components
        Object.values(this.components).forEach(component => {
            if (component && component.destroy) {
                component.destroy();
            }
        });
        
        this.components = {};
        this.isLoaded = false;
    }
}

/**
 * Portfolio Utilities
 */
const PortfolioUtils = {
    /**
     * Debounce function calls
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if device is mobile
     */
    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Get random number between min and max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Format date
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long'
        }).format(new Date(date));
    }
};

// Initialize portfolio application
let portfolio;

// Start the portfolio when everything is ready
portfolio = new Portfolio();

// Make portfolio globally accessible for debugging
window.portfolio = portfolio;
window.PortfolioUtils = PortfolioUtils;

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && portfolio) {
        portfolio.refreshComponents();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Portfolio, PortfolioUtils };
}