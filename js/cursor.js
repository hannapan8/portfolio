/**
 * Custom Cursor Functionality
 * Handles smooth cursor movement and hover effects
 */

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isHovering = false;
        
        // Check if cursor exists and device supports hover
        if (!this.cursor || !this.supportsHover()) {
            return;
        }
        
        this.init();
    }

    /**
     * Check if device supports hover (not touch-only)
     */
    supportsHover() {
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    /**
     * Initialize cursor functionality
     */
    init() {
        this.bindEvents();
        this.animate();
        this.setupHoverElements();
    }

    /**
     * Bind mouse events
     */
    bindEvents() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        // Show cursor when mouse enters window
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });

        // Handle cursor visibility on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.cursor.style.opacity = '0.5';
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.cursor.style.opacity = '1';
            }, 150);
        });
    }

    /**
     * Setup hover effects for interactive elements
     */
    setupHoverElements() {
        // Define elements that should trigger hover effect
        const hoverElements = [
            'a',
            'button',
            '.project-visual',
            '.project-link',
            '.contact-link',
            '.nav-links a',
            '.logo',
            '.skills-list li'
        ];

        // Apply hover effects to each element type
        hoverElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.addHoverEffect(element);
            });
        });

        // Special hover effects for different element types
        this.setupSpecialHovers();
    }

    /**
     * Add hover effect to an element
     */
    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            this.setHoverState(true);
        });

        element.addEventListener('mouseleave', () => {
            this.setHoverState(false);
        });

        // Handle focus for accessibility
        element.addEventListener('focus', () => {
            this.setHoverState(true);
        });

        element.addEventListener('blur', () => {
            this.setHoverState(false);
        });
    }

    /**
     * Setup special hover effects for specific elements
     */
    setupSpecialHovers() {
        // Project visuals - larger hover effect
        document.querySelectorAll('.project-visual').forEach(visual => {
            visual.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursor.style.transform = 'scale(3)';
                this.cursor.style.mixBlendMode = 'normal';
                this.cursor.style.background = 'rgba(17, 17, 17, 0.1)';
            });

            visual.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.mixBlendMode = 'difference';
                this.cursor.style.background = '';
            });
        });

        // Navigation links - subtle effect
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.style.borderWidth = '2px';
            });

            link.addEventListener('mouseleave', () => {
                this.cursor.style.borderWidth = '1px';
            });
        });

        // Contact section - inverted colors
        const contactSection = document.querySelector('.contact');
        if (contactSection) {
            contactSection.addEventListener('mouseenter', () => {
                this.cursor.style.borderColor = '#ffffff';
                this.cursor.style.mixBlendMode = 'normal';
            });

            contactSection.addEventListener('mouseleave', () => {
                this.cursor.style.borderColor = '#111111';
                this.cursor.style.mixBlendMode = 'difference';
            });
        }
    }

    /**
     * Set hover state
     */
    setHoverState(hovering) {
        this.isHovering = hovering;
        
        if (hovering) {
            this.cursor.classList.add('hover');
        } else {
            this.cursor.classList.remove('hover');
            // Reset any special styles
            this.cursor.style.transform = '';
            this.cursor.style.borderWidth = '1px';
        }
    }

    /**
     * Animate cursor movement with smooth following
     */
    animate() {
        // Smooth following with easing
        const ease = 0.15;
        const dx = this.mouseX - this.cursorX;
        const dy = this.mouseY - this.cursorY;
        
        this.cursorX += dx * ease;
        this.cursorY += dy * ease;

        // Apply position
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';

        // Add slight rotation based on movement
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        
        if (this.isHovering) {
            this.cursor.style.transform = `rotate(${rotation * 0.1}deg) scale(2)`;
        }

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    /**
     * Update hover elements (useful for dynamically added content)
     */
    updateHoverElements() {
        this.setupHoverElements();
    }

    /**
     * Destroy cursor (cleanup)
     */
    destroy() {
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }
        
        // Remove event listeners would go here if needed
        // For this implementation, we'll let garbage collection handle it
    }
}

/**
 * Cursor Utilities
 */
const CursorUtils = {
    /**
     * Create text cursor effect
     */
    createTextCursor(text) {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        // Store original content
        const originalHTML = cursor.innerHTML;
        
        // Add text
        cursor.innerHTML = `<span style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
        ">${text}</span>`;
        
        cursor.style.width = 'auto';
        cursor.style.height = 'auto';
        cursor.style.padding = '5px 10px';
        cursor.style.borderRadius = '15px';
        
        // Return cleanup function
        return () => {
            cursor.innerHTML = originalHTML;
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.padding = '';
            cursor.style.borderRadius = '50%';
        };
    },

    /**
     * Create magnetic cursor effect
     */
    createMagneticEffect(element, strength = 0.3) {
        let cleanup;

        element.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseMoveHandler = (e) => {
                const deltaX = (e.clientX - centerX) * strength;
                const deltaY = (e.clientY - centerY) * strength;
                
                this.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            
            cleanup = () => {
                document.removeEventListener('mousemove', mouseMoveHandler);
                this.style.transform = '';
            };
        });

        element.addEventListener('mouseleave', () => {
            if (cleanup) cleanup();
        });
    }
};

// Initialize cursor when DOM is loaded
let customCursor;

document.addEventListener('DOMContentLoaded', () => {
    customCursor = new CustomCursor();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize cursor if needed
    if (customCursor && !customCursor.supportsHover()) {
        customCursor.destroy();
    } else if (!customCursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        customCursor = new CustomCursor();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CustomCursor, CursorUtils };
}