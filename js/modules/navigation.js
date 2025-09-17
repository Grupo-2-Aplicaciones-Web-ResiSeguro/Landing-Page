const NavigationModule = (function() {
    let isMenuOpen = false;
    let lastScrollY = 0;
    let headerHeight = 0;
    let elements = {};

    function cacheElements() {
        elements = {
            header: DOMHelpers.query('#header'),
            navMenu: DOMHelpers.query('#nav-menu'),
            mobileToggle: DOMHelpers.query('.mobile-toggle'),
            mobileOverlay: DOMHelpers.query('#mobile-menu-overlay'),
            navLinks: DOMHelpers.queryAll('.nav-link'),
            scrollLinks: DOMHelpers.queryAll('a[href^="#"]')
        };
        
        if (elements.header) {
            headerHeight = elements.header.offsetHeight;
        }
    }
    
    function setupEventListeners() {
        if (elements.mobileToggle) {
            DOMHelpers.addEvent(elements.mobileToggle, 'click', handleMobileToggle);
        }

        if (elements.mobileOverlay) {
            DOMHelpers.addEvent(elements.mobileOverlay, 'click', closeMobileMenu);
        }

        DOMHelpers.addEvent(document, 'keydown', handleKeyDown);
        DOMHelpers.addEvent(window, 'scroll', Utils.throttle(handleScroll, 10));
        DOMHelpers.addEvent(window, 'resize', Utils.debounce(handleResize, 300));

        elements.navLinks.forEach(link => {
            DOMHelpers.addEvent(link, 'click', handleNavLinkClick);
        });

        elements.scrollLinks.forEach(link => {
            DOMHelpers.addEvent(link, 'click', handleSmoothScrollClick);
        });
    }
    
    function handleMobileToggle(e) {
        e.preventDefault();
        e.stopPropagation();


        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {

        if (!elements.navMenu || !elements.mobileOverlay) {
            return;
        }

        isMenuOpen = true;
        
        // Update toggle button
        if (elements.mobileToggle) {
            elements.mobileToggle.setAttribute('aria-expanded', 'true');
            elements.mobileToggle.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        }
        
        // Show menu and overlay
        elements.navMenu.classList.add('active');
        elements.mobileOverlay.classList.add('active');


        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        const firstLink = elements.navMenu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }

        // Emit event
        EventBus.emit(EVENTS.mobileMenuOpened);
    }
    
    function closeMobileMenu() {
        if (!isMenuOpen) return;
        
        isMenuOpen = false;
        
        // Update toggle button
        if (elements.mobileToggle) {
            elements.mobileToggle.setAttribute('aria-expanded', 'false');
            elements.mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        }
        
        // Hide menu and overlay
        if (elements.navMenu) {
            elements.navMenu.classList.remove('active');
        }
        if (elements.mobileOverlay) {
            elements.mobileOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        if (elements.mobileToggle) {
            elements.mobileToggle.focus();
        }
        
        // Emit event
        EventBus.emit(EVENTS.mobileMenuClosed);
    }
    
    function handleKeyDown(e) {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
        
        // Handle arrow keys in mobile menu
        if (isMenuOpen && elements.navMenu) {
            const focusableElements = elements.navMenu.querySelectorAll('a, button');
            const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (focusedIndex + 1) % focusableElements.length;
                focusableElements[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : focusableElements.length - 1;
                focusableElements[prevIndex].focus();
            }
        }
    }
    
    function handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        // Header background on scroll
        if (elements.header) {
            if (currentScrollY > 100) {
                elements.header.style.background = 'rgba(255, 255, 255, 0.98)';
                elements.header.style.boxShadow = 'var(--shadow-md)';
            } else {
                elements.header.style.background = 'rgba(255, 255, 255, 0.95)';
                elements.header.style.boxShadow = 'none';
            }
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        // Close mobile menu on scroll (mobile only)
        if (isMenuOpen && Utils.isMobile()) {
            closeMobileMenu();
        }
        
        lastScrollY = currentScrollY;
    }
    
    function handleResize() {
        // Close mobile menu if screen becomes larger
        if (!Utils.isMobile() && isMenuOpen) {
            closeMobileMenu();
        }
        
        // Update header height
        if (elements.header) {
            headerHeight = elements.header.offsetHeight;
        }
    }
    
    function handleNavLinkClick(e) {
        // Close mobile menu when navigation link is clicked
        if (isMenuOpen) {
            closeMobileMenu();
        }
        
        // Add small delay to allow menu to close before scrolling
        if (e.target.getAttribute('href').startsWith('#')) {
            setTimeout(() => {
                handleSmoothScrollClick(e);
            }, 100);
        }
    }
    
    function handleSmoothScrollClick(e) {
        const href = e.target.getAttribute('href');
        
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = DOMHelpers.query(`#${targetId}`);
        
        if (targetElement) {
            scrollToElement(targetElement);
            
            // Update URL without triggering scroll
            if (history.pushState) {
                history.pushState(null, null, href);
            }
            
            // Focus management for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            setTimeout(() => {
                targetElement.removeAttribute('tabindex');
            }, 1000);
        }
    }
    
    function scrollToElement(element, offset = headerHeight + 20) {
        if (!element) return;
        
        const elementPosition = DOMHelpers.getOffset(element).top;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        });
    }
    
    function updateActiveNavLink() {
        const sections = DOMHelpers.queryAll('section[id]');
        const scrollPosition = window.pageYOffset + headerHeight + 100;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = DOMHelpers.getOffset(section).top;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update active nav link
        elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    function setupIntersectionObserver() {
        // Enhanced intersection observer for better performance
        const observerOptions = {
            root: null,
            rootMargin: `-${headerHeight}px 0px -60% 0px`,
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    
                    // Update navigation
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        // Observe all sections
        DOMHelpers.queryAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Public API
    return {
        /**
         * Initialize the navigation module
         */
        init() {
            cacheElements();
            setupEventListeners();
            setupIntersectionObserver();
            
        },
        
        /**
         * Toggle mobile menu
         */
        toggleMobileMenu() {
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        },
        
        /**
         * Open mobile menu
         */
        openMobileMenu: openMobileMenu,
        
        /**
         * Close mobile menu
         */
        closeMobileMenu: closeMobileMenu,
        
        /**
         * Check if mobile menu is open
         */
        isMobileMenuOpen() {
            return isMenuOpen;
        },
        
        /**
         * Scroll to a specific section
         */
        scrollToSection(sectionId, offset) {
            const element = DOMHelpers.query(`#${sectionId}`);
            if (element) {
                scrollToElement(element, offset);
            }
        },
        
        /**
         * Smooth scroll to element
         */
        scrollToElement(element, offset) {
            scrollToElement(element, offset);
        },
        
        /**
         * Get header height
         */
        getHeaderHeight() {
            return headerHeight;
        },
        
        /**
         * Update active navigation state
         */
        updateActiveState() {
            updateActiveNavLink();
        },
        
        /**
         * Refresh cached elements (useful after DOM changes)
         */
        refresh() {
            cacheElements();
        }
    };
})();

// Auto-initialize when DOM is ready
ModuleHelpers.autoInit(NavigationModule);