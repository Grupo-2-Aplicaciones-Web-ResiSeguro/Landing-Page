const APP_CONFIG = {
    name: 'ResiCare',
    version: '1.0.0',
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    apiUrl: 'https://api.resicare.com',
    maxFileSize: 5 * 1024 * 1024,
};
const CONTACT_INFO = {
    phone: '+51989752595',
    email: 'contacto@resicare.example',
    whatsapp: '51989752595',
    address: 'Lima, Perú',
    socialMedia: {
        facebook: 'https://facebook.com/resicare',
        instagram: 'https://instagram.com/resicare',
        twitter: 'https://twitter.com/resicare',
        linkedin: 'https://linkedin.com/company/resicare'
    }
};
const PLANS = {
    basic: {
        id: 'basic',
        price: 9.90,
        maxCoverage: 2000,
        features: [
            'plan-basic-feature-1',
            'plan-basic-feature-2',
            'plan-basic-feature-3',
            'plan-basic-feature-4',
            'plan-basic-feature-5'
        ]
    },
    premium: {
        id: 'premium',
        price: 24.90,
        maxCoverage: 5000,
        features: [
            'plan-premium-feature-1',
            'plan-premium-feature-2',
            'plan-premium-feature-3',
            'plan-premium-feature-4',
            'plan-premium-feature-5',
            'plan-premium-feature-6'
        ]
    },
    family: {
        id: 'family',
        price: 39.90,
        maxCoverage: 10000,
        features: [
            'plan-family-feature-1',
            'plan-family-feature-2',
            'plan-family-feature-3',
            'plan-family-feature-4',
            'plan-family-feature-5',
            'plan-family-feature-6'
        ]
    }
};
const SIMULATOR_CONFIG = {
    minItemValue: 100,
    maxItemValue: 15000,
    riskSurchargeRate: 0.02,
    minDuration: 1,
    maxDuration: 12,
    currency: 'S/',
    defaultValues: {
        itemValue: 1000,
        plan: 'premium',
        duration: 6
    }
};
const ANIMATION_CONFIG = {
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    animationDelay: {
        stagger1: 100,
        stagger2: 200,
        stagger3: 300,
        stagger4: 400
    },
    transitionDurations: {
        fast: 150,
        normal: 300,
        slow: 500
    }
};
const VALIDATION_RULES = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Por favor ingresa un email válido'
    },
    phone: {
        pattern: /^[\+]?[0-9\-\(\)\s]+$/,
        message: 'Por favor ingresa un teléfono válido'
    },
    name: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El nombre debe contener solo letras'
    },
    itemValue: {
        min: SIMULATOR_CONFIG.minItemValue,
        max: SIMULATOR_CONFIG.maxItemValue,
        message: `El valor debe estar entre ${SIMULATOR_CONFIG.currency}${SIMULATOR_CONFIG.minItemValue} y ${SIMULATOR_CONFIG.currency}${SIMULATOR_CONFIG.maxItemValue}`
    }
};
const MODAL_CONFIG = {
    animationDuration: 300,
    backdropClose: true,
    escapeClose: true,
    focusTrap: true
};
const ERROR_MESSAGES = {
    es: {
        required: 'Este campo es obligatorio',
        email: 'Por favor ingresa un email válido',
        phone: 'Por favor ingresa un teléfono válido',
        minLength: 'Este campo debe tener al menos {min} caracteres',
        maxLength: 'Este campo no puede tener más de {max} caracteres',
        fileSize: 'El archivo es demasiado grande. Máximo 5MB',
        fileType: 'Tipo de archivo no válido',
        network: 'Error de conexión. Por favor intenta nuevamente',
        generic: 'Ha ocurrido un error. Por favor intenta nuevamente'
    },
    en: {
        required: 'This field is required',
        email: 'Please enter a valid email',
        phone: 'Please enter a valid phone number',
        minLength: 'This field must have at least {min} characters',
        maxLength: 'This field cannot have more than {max} characters',
        fileSize: 'File is too large. Maximum 5MB',
        fileType: 'Invalid file type',
        network: 'Connection error. Please try again',
        generic: 'An error has occurred. Please try again'
    }
};
const SUCCESS_MESSAGES = {
    es: {
        subscription: '¡Suscripción exitosa! Te contactaremos pronto.',
        claim: '¡Reclamo enviado! Recibirás una respuesta en 24-48 horas.',
        contact: '¡Mensaje enviado! Te responderemos pronto.',
        newsletter: '¡Te has suscrito al newsletter!'
    },
    en: {
        subscription: 'Subscription successful! We will contact you soon.',
        claim: 'Claim submitted! You will receive a response in 24-48 hours.',
        contact: 'Message sent! We will respond soon.',
        newsletter: 'You have subscribed to the newsletter!'
    }
};
const STORAGE_KEYS = {
    language: 'resicare_language',
    theme: 'resicare_theme',
    userPreferences: 'resicare_user_preferences',
    simulatorData: 'resicare_simulator_data'
};
const EVENTS = {
    languageChanged: 'languageChanged',
    modalOpened: 'modalOpened',
    modalClosed: 'modalClosed',
    formSubmitted: 'formSubmitted',
    planSelected: 'planSelected',
    simulatorCalculated: 'simulatorCalculated'
};
const CSS_CLASSES = {
    active: 'active',
    hidden: 'hidden',
    fadeIn: 'fade-in',
    animate: 'animate',
    loading: 'loading',
    error: 'error',
    success: 'success',
    disabled: 'disabled'
};
const BREAKPOINTS = {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1440
};
const Z_INDEX = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
};

