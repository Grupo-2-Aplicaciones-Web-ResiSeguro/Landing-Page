const LanguageModule = (function() {
    const translations = {
        es: {
            'brand': 'ResiCare',
            'nav-home': 'Inicio',
            'nav-benefits': 'Beneficios',
            'nav-plans': 'Planes',
            'nav-testimonials': 'Testimonios',
            'nav-team': 'Equipo',
            'nav-login': 'Iniciar Sesión',
            'nav-register': 'Registrarse',
            'nav-logout': 'Cerrar Sesión',
            'hero-title': 'Protege lo que más importa durante tu vida universitaria',
            'hero-subtitle': 'Microseguro rápido y accesible diseñado específicamente para estudiantes y padres. Registro simple, reclamos con foto y soporte digital confiable.',
            'hero-feature-1': 'Reclamos instantáneos',
            'hero-feature-2': 'Protección completa',
            'hero-feature-3': '100% digital',
            'hero-cta-primary': 'Ver Planes',
            'hero-cta-secondary': 'Conocer Beneficios',
            'floating-card-1-title': 'Reclamo Aprobado',
            'floating-card-1-desc': 'Tu laptop fue reemplazada en 24 horas',
            'floating-card-2-title': 'Ahorro Total',
            'floating-card-2-desc': 'S/ 1,200 ahorrados en protección',
            'stat-students': 'Estudiantes protegidos',
            'stat-response': 'Tiempo de respuesta',
            'stat-satisfaction': 'Satisfacción',
            'benefits-title': '¿Por qué elegir ResiCare?',
            'benefits-subtitle': 'Diseñamos cada beneficio pensando en las necesidades reales de los estudiantes universitarios y sus familias.',
            'benefit-1-title': 'Precios Accesibles',
            'benefit-1-desc': 'Planes diseñados especialmente para presupuestos estudiantiles, con límites de cobertura claros y sin costos ocultos.',
            'benefit-2-title': 'Reclamos con Foto',
            'benefit-2-desc': 'Envía una foto y los detalles del incidente. Obtén decisiones automáticas para reclamos menores o revisión humana cuando sea necesario.',
            'benefit-3-title': 'Tranquilidad Digital',
            'benefit-3-desc': 'Gestiona pólizas, reclamos y contacta con soporte a través de nuestra app y portal web las 24 horas del día.',
            'benefit-4-title': 'Respuesta Rápida',
            'benefit-4-desc': 'Procesamiento de reclamos en menos de 48 horas para incidentes menores, con notificaciones en tiempo real.',
            'benefit-5-title': 'Soporte Especializado',
            'benefit-5-desc': 'Equipo de soporte que entiende las necesidades específicas de estudiantes universitarios y sus familias.',
            'benefit-6-title': 'Confianza Garantizada',
            'benefit-6-desc': 'Respaldados por tecnología segura y procesos transparentes que puedes verificar en cada paso.',
            'plans-title': 'Planes diseñados para ti',
            'plans-subtitle': 'Elige el plan que mejor se adapte a tus necesidades y presupuesto. Todos incluyen nuestra garantía de satisfacción.',
            'plan-basic-name': 'Plan Básico',
            'plan-basic-desc': 'Protección esencial para estudiantes que inician su vida universitaria.',
            'plan-premium-name': 'Plan Premium',
            'plan-premium-desc': 'Cobertura completa con límites más altos y procesamiento prioritario.',
            'plan-family-name': 'Plan Familiar',
            'plan-family-desc': 'Protección extendida para toda la familia con múltiples beneficiarios.',
            'plan-price-period': '/ mes',
            'plan-popular': 'Más Popular',
            'plan-cta': 'Elegir Plan',
            'plan-basic-feature-1': 'Protección contra robos menores',
            'plan-basic-feature-2': 'Reclamos con foto',
            'plan-basic-feature-3': 'Soporte de teleconsulta básico',
            'plan-basic-feature-4': 'Cobertura hasta S/ 2,000',
            'plan-basic-feature-5': 'App móvil incluida',
            'plan-premium-feature-1': 'Todo lo del Plan Básico',
            'plan-premium-feature-2': 'Límites más altos por incidente',
            'plan-premium-feature-3': 'Procesamiento prioritario',
            'plan-premium-feature-4': 'Reembolso por daños parciales',
            'plan-premium-feature-5': 'Cobertura hasta S/ 5,000',
            'plan-premium-feature-6': 'Soporte 24/7 prioritario',
            'plan-family-feature-1': 'Todo lo del Plan Premium',
            'plan-family-feature-2': 'Hasta 4 beneficiarios',
            'plan-family-feature-3': 'Cobertura hasta S/ 10,000',
            'plan-family-feature-4': 'Gestor de cuenta personal',
            'plan-family-feature-5': 'Descuentos en renovación',
            'plan-family-feature-6': 'Cobertura internacional',
            'simulator-title': 'Simulador de Prima',
            'simulator-description': 'Calcula el costo de tu protección personalizada',
            'simulator-item-value': 'Valor del artículo (S/)',
            'simulator-item-help': 'Entre S/ 100 y S/ 15,000',
            'simulator-plan': 'Selecciona tu plan',
            'simulator-plan-help': 'Elige el plan que mejor se adapte a ti',
            'simulator-duration': 'Duración (meses)',
            'simulator-duration-help': 'De 1 a 12 meses',
            'simulator-calculate': 'Calcular',
            'simulator-reset': 'Limpiar',
            'testimonials-title': 'Lo que dicen nuestros usuarios',
            'testimonials-subtitle': 'Miles de estudiantes y padres ya confían en ResiCare para proteger lo que más valoran.',
            'testimonial-1-quote': 'Presenté un reclamo por mi laptop robada y fue procesado en menos de 24 horas. El proceso fue súper fácil, solo tomé fotos y llené un formulario simple. ¡Increíble servicio!',
            'testimonial-1-name': 'María Rodríguez',
            'testimonial-1-role': 'Estudiante de Ingeniería - UPC',
            'testimonial-2-quote': 'Como padre, me da mucha tranquilidad saber que mis hijos están protegidos mientras estudian. Los precios son muy razonables y el servicio al cliente es excelente.',
            'testimonial-2-name': 'José Silva',
            'testimonial-2-role': 'Padre de familia',
            'testimonial-3-quote': 'La aplicación es súper intuitiva y el registro fue muy rápido. Me encanta poder gestionar todo desde mi celular y recibir notificaciones en tiempo real.',
            'testimonial-3-name': 'Lucía Castro',
            'testimonial-3-role': 'Estudiante de Medicina - UNMSM',
            'cta-title': '¿Listo para proteger tu futuro?',
            'cta-subtitle': 'Únete a miles de estudiantes que ya protegen sus pertenencias con ResiCare. Comienza hoy mismo con nuestro plan más popular.',
            'cta-primary': 'Comenzar Ahora',
            'cta-secondary': 'Conocer al Equipo',
            'team-title': 'Nuestro Equipo',
            'team-subtitle': 'Conoce a los innovadores detrás de ResiCare, comprometidos con transformar la protección para estudiantes.',
            'team-jude-role': 'Developer',
            'team-jude-description': 'Responsable, proactivo y colaborador, aporta ideas útiles y cumple con sus tareas a tiempo.',
            'team-hector-role': 'Developer',
            'team-hector-description': 'Especialista en desarrollo y tecnología del equipo.',
            'team-jose-role': 'Developer',
            'team-jose-description': 'Comprometido y creativo, busca soluciones, valora la comunicación y el trabajo en equipo.',
            'team-vanessa-role': 'Developer',
            'team-vanessa-description': 'Estudiante responsable, adaptable y confiable, con conocimientos en programación y desarrollo web/apps.',
            'team-carlo-role': 'Developer',
            'team-carlo-description': 'Responsable, organizado y dispuesto a colaborar para lograr un buen trabajo en equipo.',
            'team-values-title': 'Nuestros Valores',
            'team-value-1-title': 'Empatía',
            'team-value-1-description': 'Entendemos las necesidades reales de los estudiantes y sus familias.',
            'team-value-2-title': 'Innovación',
            'team-value-2-description': 'Creamos soluciones tecnológicas que simplifican y mejoran la protección.',
            'team-value-3-title': 'Confianza',
            'team-value-3-description': 'Construimos relaciones sólidas basadas en transparencia y compromiso.',
            'team-value-4-title': 'Comunidad',
            'team-value-4-description': 'Formamos parte de la comunidad estudiantil y trabajamos para su bienestar.',
            'footer-description': 'Microseguro innovador diseñado específicamente para estudiantes universitarios y sus familias. Protección accesible, rápida y confiable.',
            'footer-product-title': 'Producto',
            'footer-benefits': 'Beneficios',
            'footer-plans': 'Planes',
            'footer-app': 'Descargar App',
            'footer-simulator': 'Simulador',
            'footer-company-title': 'Compañía',
            'footer-about': 'Sobre Nosotros',
            'footer-terms': 'Términos y Condiciones',
            'footer-privacy': 'Política de Privacidad',
            'footer-contact': 'Contacto',
            'footer-support-title': 'Soporte',
            'footer-help': 'Centro de Ayuda',
            'footer-claims': 'Hacer Reclamo',
            'footer-chat': 'Chat en Vivo',
            'footer-phone': '+51989752595',
            'footer-copyright': '© 2025 ResiSeguro. Todos los derechos reservados. | Diseñado con ❤️ para estudiantes',
            'modal-login-title': 'Iniciar Sesión',
            'modal-contact-title': 'Contacto',
            'modal-claim-title': 'Hacer Reclamo',
            'modal-subscription-title': 'Suscripción al Plan',
            'form-name': 'Nombre completo',
            'form-email': 'Correo electrónico',
            'form-phone': 'Teléfono',
            'form-message': 'Mensaje',
            'form-send': 'Enviar',
            'form-cancel': 'Cancelar',
            'form-close': 'Cerrar',
            'btn-subscribe': 'Suscribirse',
            'btn-learn-more': 'Conocer más',
            'btn-contact': 'Contactar',
            'btn-call': 'Llamar',
            'btn-whatsapp': 'WhatsApp',
            'btn-email': 'Email'
        },
        en: {
            'brand': 'ResiCare',
            'nav-home': 'Home',
            'nav-benefits': 'Benefits',
            'nav-plans': 'Plans',
            'nav-testimonials': 'Testimonials',
            'nav-team': 'Team',
            'nav-login': 'Sign In',
            'nav-register': 'Sign Up',
            'nav-logout': 'Sign Out',
            'hero-title': 'Protect what matters most during your university life',
            'hero-subtitle': 'Fast and accessible microinsurance designed specifically for students and parents. Simple registration, photo claims, and reliable digital support.',
            'hero-feature-1': 'Instant claims',
            'hero-feature-2': 'Complete protection',
            'hero-feature-3': '100% digital',
            'hero-cta-primary': 'View Plans',
            'hero-cta-secondary': 'Learn Benefits',
            'floating-card-1-title': 'Claim Approved',
            'floating-card-1-desc': 'Your laptop was replaced in 24 hours',
            'floating-card-2-title': 'Total Savings',
            'floating-card-2-desc': 'S/ 1,200 saved on protection',
            'stat-students': 'Students protected',
            'stat-response': 'Response time',
            'stat-satisfaction': 'Satisfaction',
            'benefits-title': 'Why choose ResiCare?',
            'benefits-subtitle': 'We design every benefit thinking about the real needs of university students and their families.',
            'benefit-1-title': 'Affordable Prices',
            'benefit-1-desc': 'Plans designed especially for student budgets, with clear coverage limits and no hidden costs.',
            'benefit-2-title': 'Photo Claims',
            'benefit-2-desc': 'Send a photo and incident details. Get automatic decisions for minor claims or human review when needed.',
            'benefit-3-title': 'Digital Peace of Mind',
            'benefit-3-desc': 'Manage policies, claims, and contact support through our app and web portal 24 hours a day.',
            'benefit-4-title': 'Fast Response',
            'benefit-4-desc': 'Claim processing in less than 48 hours for minor incidents, with real-time notifications.',
            'benefit-5-title': 'Specialized Support',
            'benefit-5-desc': 'Support team that understands the specific needs of university students and their families.',
            'benefit-6-title': 'Guaranteed Trust',
            'benefit-6-desc': 'Backed by secure technology and transparent processes you can verify at every step.',
            'plans-title': 'Plans designed for you',
            'plans-subtitle': 'Choose the plan that best fits your needs and budget. All include our satisfaction guarantee.',
            'plan-basic-name': 'Basic Plan',
            'plan-basic-desc': 'Essential protection for students starting their university life.',
            'plan-premium-name': 'Premium Plan',
            'plan-premium-desc': 'Complete coverage with higher limits and priority processing.',
            'plan-family-name': 'Family Plan',
            'plan-family-desc': 'Extended protection for the whole family with multiple beneficiaries.',
            'plan-price-period': '/ month',
            'plan-popular': 'Most Popular',
            'plan-cta': 'Choose Plan',
            'plan-basic-feature-1': 'Protection against minor theft',
            'plan-basic-feature-2': 'Photo claims',
            'plan-basic-feature-3': 'Basic teleconsult support',
            'plan-basic-feature-4': 'Coverage up to S/ 2,000',
            'plan-basic-feature-5': 'Mobile app included',
            'plan-premium-feature-1': 'Everything in Basic Plan',
            'plan-premium-feature-2': 'Higher limits per incident',
            'plan-premium-feature-3': 'Priority processing',
            'plan-premium-feature-4': 'Partial damage reimbursement',
            'plan-premium-feature-5': 'Coverage up to S/ 5,000',
            'plan-premium-feature-6': 'Priority 24/7 support',
            'plan-family-feature-1': 'Everything in Premium Plan',
            'plan-family-feature-2': 'Up to 4 beneficiaries',
            'plan-family-feature-3': 'Coverage up to S/ 10,000',
            'plan-family-feature-4': 'Personal account manager',
            'plan-family-feature-5': 'Renewal discounts',
            'plan-family-feature-6': 'International coverage',
            'simulator-title': 'Premium Simulator',
            'simulator-description': 'Calculate the cost of your personalized protection',
            'simulator-item-value': 'Item value (S/)',
            'simulator-item-help': 'Between S/ 100 and S/ 15,000',
            'simulator-plan': 'Select your plan',
            'simulator-plan-help': 'Choose the plan that best fits you',
            'simulator-duration': 'Duration (months)',
            'simulator-duration-help': 'From 1 to 12 months',
            'simulator-calculate': 'Calculate',
            'simulator-reset': 'Clear',
            'testimonials-title': 'What our users say',
            'testimonials-subtitle': 'Thousands of students and parents already trust ResiCare to protect what they value most.',
            'testimonial-1-quote': 'I filed a claim for my stolen laptop and it was processed in less than 24 hours. The process was super easy, I just took photos and filled out a simple form. Amazing service!',
            'testimonial-1-name': 'María Rodríguez',
            'testimonial-1-role': 'Engineering Student - UPC',
            'testimonial-2-quote': 'As a father, it gives me great peace of mind knowing my children are protected while studying. The prices are very reasonable and customer service is excellent.',
            'testimonial-2-name': 'José Silva',
            'testimonial-2-role': 'Father of family',
            'testimonial-3-quote': 'The app is super intuitive and registration was very quick. I love being able to manage everything from my phone and receive real-time notifications.',
            'testimonial-3-name': 'Lucía Castro',
            'testimonial-3-role': 'Medical Student - UNMSM',
            'cta-title': 'Ready to protect your future?',
            'cta-subtitle': 'Join thousands of students who already protect their belongings with ResiCare. Start today with our most popular plan.',
            'cta-primary': 'Get Started Now',
            'cta-secondary': 'Meet the Team',
            'team-title': 'Our Team',
            'team-subtitle': 'Meet the innovators behind ResiCare, committed to transforming protection for students.',
            'team-jude-role': 'Developer',
            'team-jude-description': 'Responsible, proactive and collaborative, contributes useful ideas and completes tasks on time.',
            'team-hector-role': 'Developer',
            'team-hector-description': 'Development and technology specialist of the team.',
            'team-jose-role': 'Developer',
            'team-jose-description': 'Committed and creative, seeks solutions, values communication and teamwork.',
            'team-vanessa-role': 'Developer',
            'team-vanessa-description': 'Responsible, adaptable and reliable student, with knowledge in programming and web/app development.',
            'team-carlo-role': 'Developer',
            'team-carlo-description': 'Responsible, organized and willing to collaborate to achieve good teamwork.',
            'team-values-title': 'Our Values',
            'team-value-1-title': 'Empathy',
            'team-value-1-description': 'We understand the real needs of students and their families.',
            'team-value-2-title': 'Innovation',
            'team-value-2-description': 'We create technological solutions that simplify and improve protection.',
            'team-value-3-title': 'Trust',
            'team-value-3-description': 'We build solid relationships based on transparency and commitment.',
            'team-value-4-title': 'Community',
            'team-value-4-description': 'We are part of the student community and work for their well-being.',
            'footer-description': 'Innovative microinsurance designed specifically for university students and their families. Accessible, fast and reliable protection.',
            'footer-product-title': 'Product',
            'footer-benefits': 'Benefits',
            'footer-plans': 'Plans',
            'footer-app': 'Download App',
            'footer-simulator': 'Simulator',
            'footer-company-title': 'Company',
            'footer-about': 'About Us',
            'footer-terms': 'Terms & Conditions',
            'footer-privacy': 'Privacy Policy',
            'footer-contact': 'Contact',
            'footer-support-title': 'Support',
            'footer-help': 'Help Center',
            'footer-claims': 'Make Claim',
            'footer-chat': 'Live Chat',
            'footer-phone': '+51989752595',
            'footer-copyright': '© 2025 ResiSeguro. All rights reserved. | Designed with ❤️ for students',
            'modal-login-title': 'Sign In',
            'modal-contact-title': 'Contact',
            'modal-claim-title': 'Make Claim',
            'modal-subscription-title': 'Plan Subscription',
            'form-name': 'Full name',
            'form-email': 'Email address',
            'form-phone': 'Phone',
            'form-message': 'Message',
            'form-send': 'Send',
            'form-cancel': 'Cancel',
            'form-close': 'Close',
            'btn-subscribe': 'Subscribe',
            'btn-learn-more': 'Learn more',
            'btn-contact': 'Contact',
            'btn-call': 'Call',
            'btn-whatsapp': 'WhatsApp',
            'btn-email': 'Email'
        }
    };
    let currentLanguage = Utils.getCurrentLanguage();
    function updatePageLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
    
    function updateLanguageButtons(lang) {
        DOMHelpers.queryAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = DOMHelpers.query(`[onclick*="'${lang}'"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    function translateElement(element, key, lang) {
        const translation = translations[lang] && translations[lang][key];
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
    }
    
    function translatePage(lang) {
        if (!translations[lang]) {
            console.warn(`Language '${lang}' not supported`);
            return false;
        }
        DOMHelpers.queryAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            translateElement(element, key, lang);
        });
        DOMHelpers.queryAll('select option[data-translate]').forEach(option => {
            const key = option.getAttribute('data-translate');
            translateElement(option, key, lang);
        });
        
        return true;
    }
    return {
        init() {
            this.setLanguage(currentLanguage);
            EventBus.on(EVENTS.languageChanged, (data) => {
            });
        },
        setLanguage(lang) {
            if (!translations[lang]) {
                console.warn(`Language '${lang}' not supported. Falling back to default.`);
                lang = APP_CONFIG.defaultLanguage;
            }
            
            const oldLanguage = currentLanguage;
            currentLanguage = lang;
            updatePageLanguage(lang);
            updateLanguageButtons(lang);
            if (translatePage(lang)) {
                StorageHelpers.set(STORAGE_KEYS.language, lang);
                EventBus.emit(EVENTS.languageChanged, {
                    language: lang,
                    previousLanguage: oldLanguage
                });
            }
        },
        getCurrentLanguage() {
            return currentLanguage;
        },
        translate(key, lang = currentLanguage) {
            return translations[lang] && translations[lang][key] || key;
        },
        addTranslations(lang, newTranslations) {
            if (!translations[lang]) {
                translations[lang] = {};
            }
            Object.assign(translations[lang], newTranslations);
        },
        getSupportedLanguages() {
            return Object.keys(translations);
        },
        isLanguageSupported(lang) {
            return translations.hasOwnProperty(lang);
        },
        getBrowserLanguage() {
            const lang = navigator.language || navigator.userLanguage;
            return lang.slice(0, 2);
        },
        formatCurrency(amount) {
            const currency = currentLanguage === 'en' ? 'S/' : 'S/';
            return StringHelpers.formatCurrency(amount, currency);
        }
    };
})();

ModuleHelpers.autoInit(LanguageModule);