const DOMHelpers = {
    query(selector, context = document) {
        if (!selector || typeof selector !== 'string' || selector.trim() === '') {
            console.warn('Empty or invalid selector provided');
            return null;
        }

        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn('Invalid selector:', selector);
            return null;
        }
    },

    queryAll(selector, context = document) {
        if (!selector || typeof selector !== 'string' || selector.trim() === '') {
            console.warn('Empty or invalid selector provided');
            return [];
        }

        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (e) {
            console.warn('Invalid selector:', selector);
            return [];
        }
    },

    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });

        if (content) {
            element.textContent = content;
        }

        return element;
    },

    addEvent(element, event, handler, options = {}) {
        if (!element || typeof handler !== 'function') return;

        element.addEventListener(event, handler, options);

        return () => element.removeEventListener(event, handler, options);
    },

    isInViewport(element, threshold = 0) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    },

    scrollToElement(element, offset = 0) {
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    getOffset(element) {
        if (!element) return { top: 0, left: 0 };

        let top = 0;
        let left = 0;

        while (element) {
            top += element.offsetTop;
            left += element.offsetLeft;
            element = element.offsetParent;
        }

        return { top, left };
    }
};

const StringHelpers = {
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    slugify(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    truncate(str, length = 100, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.substring(0, length).trim() + suffix;
    },

    formatCurrency(amount, currency = 'S/', decimals = 2) {
        if (isNaN(amount)) return `${currency}0.00`;
        return `${currency}${Number(amount).toFixed(decimals)}`;
    },

    formatNumber(num, separator = ',') {
        if (isNaN(num)) return '0';
        return Number(num).toLocaleString('es-PE');
    },

    interpolate(str, data = {}) {
        if (!str) return '';
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return data.hasOwnProperty(key) ? data[key] : match;
        });
    },

    generateId(prefix = 'id', length = 8) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = prefix + '_';

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }
};

const ValidationHelpers = {
    isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },

    isValidPhone(phone) {
        const pattern = /^[\+]?[0-9\-\(\)\s]+$/;
        return pattern.test(phone) && phone.replace(/\D/g, '').length >= 9;
    },

    isRequired(value) {
        return value !== null && value !== undefined && String(value).trim() !== '';
    },

    hasValidLength(str, min = 0, max = Infinity) {
        const length = str ? str.length : 0;
        return length >= min && length <= max;
    },

    isInRange(num, min = -Infinity, max = Infinity) {
        const value = Number(num);
        return !isNaN(value) && value >= min && value <= max;
    },

    isValidFileSize(file, maxSize = 5 * 1024 * 1024) {
        return file && file.size <= maxSize;
    },

    isValidFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
        return file && allowedTypes.includes(file.type);
    }
};

const StorageHelpers = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Error writing to localStorage:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Error removing from localStorage:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.warn('Error clearing localStorage:', e);
            return false;
        }
    }
};

const URLHelpers = {
    getParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    setParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    },

    removeParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.replaceState({}, '', url);
    },

    buildQuery(params = {}) {
        return Object.entries(params)
            .filter(([key, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }
};

const Utils = {
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    isMobile() {
        return window.innerWidth <= BREAKPOINTS.md || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    getCurrentLanguage() {
        return StorageHelpers.get(STORAGE_KEYS.language) ||
               navigator.language.slice(0, 2) ||
               APP_CONFIG.defaultLanguage;
    },

    formatDate(date, locale = 'es-PE') {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString(locale);
    },

    generateWhatsAppURL(phone, message = '') {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },

    generateMailtoURL(email, subject = '', body = '') {
        const params = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        const queryString = params.length > 0 ? '?' + params.join('&') : '';
        return `mailto:${email}${queryString}`;
    },

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

};

const ModuleHelpers = {
    autoInit(moduleObject) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => moduleObject.init());
        } else {
            moduleObject.init();
        }
    },

    injectStyles(moduleId, cssContent) {
        const styleId = `${moduleId}-styles`;
        if (!DOMHelpers.query(`#${styleId}`)) {
            const styles = DOMHelpers.createElement('style', {
                id: styleId,
                innerHTML: cssContent
            });
            document.head.appendChild(styles);
        }
    },

    createModal(id, content, options = {}) {
        if (typeof ModalsModule !== 'undefined') {
            const modal = ModalsModule.create('custom', {
                id,
                temporary: true,
                ...options
            });
            if (modal) {
                ModalsModule.updateContent(id, content);
            }
            return modal;
        }
        return null;
    },

    createModalActions(actions = []) {
        const defaultActions = [
            { text: this.translate('cancel'), class: 'btn btn-ghost', action: 'close' },
            { text: this.translate('confirm'), class: 'btn btn-primary', action: 'submit' }
        ];

        const finalActions = actions.length ? actions : defaultActions;

        return `
            <div class="modal-actions">
                ${finalActions.map(action => `
                    <button class="${action.class}"
                            onclick="${action.action === 'close' ? 'this.closest(\'.modal-overlay\').remove()' : action.onclick || ''}">
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
    },

    validateField(field, rules = {}) {
        const value = field.value?.trim();
        const errors = [];

        if (rules.required && !ValidationHelpers.isRequired(value)) {
            errors.push(this.translate('required_field'));
        }

        if (rules.email && value && !ValidationHelpers.isValidEmail(value)) {
            errors.push(this.translate('invalid_email'));
        }

        if (rules.phone && value && !ValidationHelpers.isValidPhone(value)) {
            errors.push(this.translate('invalid_phone'));
        }

        if (rules.minLength && value && !ValidationHelpers.hasValidLength(value, rules.minLength)) {
            errors.push(`Mínimo ${rules.minLength} caracteres`);
        }

        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        field.classList.remove('error');

        if (errors.length > 0) {
            field.classList.add('error');
            const errorDiv = DOMHelpers.createElement('div', {
                className: 'field-error',
                innerHTML: errors[0]
            });
            field.parentNode.appendChild(errorDiv);
            return false;
        }

        return true;
    },

    translate(key, customTranslations = {}) {
        const lang = typeof LanguageModule !== 'undefined'
            ? LanguageModule.getCurrentLanguage()
            : 'es';

        const commonTranslations = {
            'close': { es: 'Cerrar', en: 'Close' },
            'cancel': { es: 'Cancelar', en: 'Cancel' },
            'confirm': { es: 'Confirmar', en: 'Confirm' },
            'save': { es: 'Guardar', en: 'Save' },
            'edit': { es: 'Editar', en: 'Edit' },
            'delete': { es: 'Eliminar', en: 'Delete' },
            'loading': { es: 'Cargando...', en: 'Loading...' },
            'error': { es: 'Error', en: 'Error' },
            'success': { es: 'Éxito', en: 'Success' },
            'warning': { es: 'Advertencia', en: 'Warning' },
            'info': { es: 'Información', en: 'Information' },
            'required_field': { es: 'Este campo es obligatorio', en: 'This field is required' },
            'invalid_email': { es: 'Email inválido', en: 'Invalid email' },
            'invalid_phone': { es: 'Teléfono inválido', en: 'Invalid phone' },
            'submit': { es: 'Enviar', en: 'Submit' },
            'send': { es: 'Enviar', en: 'Send' },
            'continue': { es: 'Continuar', en: 'Continue' }
        };

        const translations = { ...commonTranslations, ...customTranslations };
        return translations[key] ? translations[key][lang] : key;
    }
};

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}

const EventBus = new EventEmitter();

if (typeof window !== 'undefined') {
    window.DOMHelpers = DOMHelpers;
    window.StringHelpers = StringHelpers;
    window.ValidationHelpers = ValidationHelpers;
    window.StorageHelpers = StorageHelpers;
    window.URLHelpers = URLHelpers;
    window.Utils = Utils;
    window.ModuleHelpers = ModuleHelpers;
    window.EventBus = EventBus;
}