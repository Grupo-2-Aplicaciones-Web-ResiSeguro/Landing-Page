const AnimationModule = (function() {
    let isInitialized = false;
    let observers = [];
    let animatedElements = new Set();

    const animationConfig = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        staggerDelay: 100,
        defaultDuration: 800
    };
    function createIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                    animateElement(entry.target);
                    animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: animationConfig.threshold,
            rootMargin: animationConfig.rootMargin
        });
        
        observers.push(observer);
        return observer;
    }
    
    function animateElement(element) {
        const delay = getStaggerDelay(element);
        
        if (delay > 0) {
            setTimeout(() => {
                element.classList.add('animate');
                triggerCustomAnimation(element);
            }, delay);
        } else {
            element.classList.add('animate');
            triggerCustomAnimation(element);
        }
    }
    
    function getStaggerDelay(element) {
        const staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];
        
        for (let i = 0; i < staggerClasses.length; i++) {
            if (element.classList.contains(staggerClasses[i])) {
                return (i + 1) * animationConfig.staggerDelay;
            }
        }
        
        return 0;
    }
    
    function triggerCustomAnimation(element) {
        const animationType = element.dataset.animation;
        
        switch (animationType) {
            case 'counter':
                animateCounter(element);
                break;
            case 'progress':
                animateProgress(element);
                break;
            case 'typewriter':
                animateTypewriter(element);
                break;
            default:
                break;
        }
    }
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (element.dataset.format === 'currency') {
                element.textContent = StringHelpers.formatCurrency(Math.floor(current));
            } else if (element.dataset.format === 'percentage') {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = StringHelpers.formatNumber(Math.floor(current));
            }
        }, 16);
    }
    
    function animateProgress(element) {
        const target = parseInt(element.dataset.target) || 100;
        const duration = parseInt(element.dataset.duration) || 1500;
        const progressBar = element.querySelector('.progress-bar');
        
        if (progressBar) {
            progressBar.style.transition = `width ${duration}ms ease-out`;
            progressBar.style.width = target + '%';
        }
    }
    
    function animateTypewriter(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }, speed);
    }
    
    function setupFloatingAnimations() {
        const floatingCards = DOMHelpers.queryAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    function setupHoverAnimations() {
        const cards = DOMHelpers.queryAll('.benefit-card, .plan-card, .testimonial-card');
        
        cards.forEach(card => {
            DOMHelpers.addEvent(card, 'mouseenter', () => {
                if (!Utils.isTouchDevice()) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
                }
            });
            
            DOMHelpers.addEvent(card, 'mouseleave', () => {
                if (!Utils.isTouchDevice()) {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }
    
    function setupButtonAnimations() {
        const buttons = DOMHelpers.queryAll('.btn');
        
        buttons.forEach(button => {
            DOMHelpers.addEvent(button, 'click', (e) => {
                if (button.classList.contains('btn-primary')) {
                    createRippleEffect(e, button);
                }
            });
            if (!Utils.isTouchDevice()) {
                DOMHelpers.addEvent(button, 'mouseenter', () => {
                    if (!button.disabled) {
                        button.style.transform = 'translateY(-2px)';
                        button.style.transition = 'all 0.2s ease';
                    }
                });
                
                DOMHelpers.addEvent(button, 'mouseleave', () => {
                    button.style.transform = 'translateY(0)';
                });
            }
        });
    }
    
    function createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(${x}px, ${y}px) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function setupScrollProgressIndicator() {
        const progressBar = DOMHelpers.createElement('div', {
            id: 'scroll-progress',
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--primary), var(--secondary));
                z-index: 9999;
                transition: width 0.25s ease;
            `
        });
        
        document.body.appendChild(progressBar);
        DOMHelpers.addEvent(window, 'scroll', Utils.throttle(() => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        }, 10));
    }
    
    function setupParallaxEffects() {
        const parallaxElements = DOMHelpers.queryAll('[data-parallax]');
        
        if (parallaxElements.length > 0 && !Utils.isMobile()) {
            DOMHelpers.addEvent(window, 'scroll', Utils.throttle(() => {
                const scrollTop = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.parallax) || 0.5;
                    const yPos = -(scrollTop * speed);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            }, 16));
        }
    }
    
    function addCSSAnimations() {
        if (!DOMHelpers.query('#animation-styles')) {
            const styles = DOMHelpers.createElement('style', {
                id: 'animation-styles',
                innerHTML: `
                    @keyframes ripple {
                        to {
                            transform: translate(var(--x, 0), var(--y, 0)) scale(4);
                            opacity: 0;
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    
                    @keyframes bounce {
                        0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
                        40%, 43% { transform: translate3d(0, -30px, 0); }
                        70% { transform: translate3d(0, -15px, 0); }
                        90% { transform: translate3d(0, -4px, 0); }
                    }
                    
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                        20%, 40%, 60%, 80% { transform: translateX(10px); }
                    }
                    
                    .animate-pulse { animation: pulse 2s infinite; }
                    .animate-bounce { animation: bounce 1s infinite; }
                    .animate-shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite; }
                `
            });
            
            document.head.appendChild(styles);
        }
    }
    
    function handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = DOMHelpers.createElement('style', {
                innerHTML: `
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                    
                    .floating-card {
                        animation: none !important;
                    }
                `
            });
            
            document.head.appendChild(style);
        }
    }
    return {
        init() {
            if (isInitialized) return;
            
            handleReducedMotion();
            addCSSAnimations();
            const observer = createIntersectionObserver();
            DOMHelpers.queryAll('.fade-in').forEach(element => {
                observer.observe(element);
            });
            setupFloatingAnimations();
            setupHoverAnimations();
            setupButtonAnimations();
            setupScrollProgressIndicator();
            setupParallaxEffects();
            
            isInitialized = true;
        },
        animateElement(element, animationType = 'fadeIn') {
            if (!element) return;
            
            element.dataset.animation = animationType;
            animateElement(element);
        },
        addRipple(event, element) {
            createRippleEffect(event, element);
        },
        animateCounter(element, target, duration = 2000) {
            if (!element) return;
            
            element.dataset.target = target;
            element.dataset.duration = duration;
            animateCounter(element);
        },
        addEntranceAnimation(element, animationType = 'fadeInUp', delay = 0) {
            if (!element) return;
            
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        },
        addLoadingAnimation(element) {
            if (!element) return;
            
            element.classList.add('animate-pulse');
        },
        removeLoadingAnimation(element) {
            if (!element) return;
            
            element.classList.remove('animate-pulse');
        },
        shakeElement(element) {
            if (!element) return;
            
            element.classList.add('animate-shake');
            setTimeout(() => {
                element.classList.remove('animate-shake');
            }, 820);
        },
        destroy() {
            observers.forEach(observer => observer.disconnect());
            observers = [];
            animatedElements.clear();
            isInitialized = false;
        },
        refresh() {
            const observer = observers[0];
            if (observer) {
                DOMHelpers.queryAll('.fade-in:not(.animate)').forEach(element => {
                    if (!animatedElements.has(element)) {
                        observer.observe(element);
                    }
                });
            }
        }
    };
})();

ModuleHelpers.autoInit(AnimationModule);