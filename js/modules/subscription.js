const SubscriptionModule = (function() {
    let selectedPlan = null;
    let subscriptionData = {};
    
    // Private methods
    function updatePlanSummary(planId, price) {
        const planInfo = PLANS[planId] || Object.values(PLANS).find(p => p.price === price);
        
        if (!planInfo) return;
        
        const lang = LanguageModule.getCurrentLanguage();
        const planNameEl = DOMHelpers.query('#selected-plan-name');
        const planPriceEl = DOMHelpers.query('#selected-plan-price');
        const planDescEl = DOMHelpers.query('#selected-plan-description');
        
        if (planNameEl) {
            planNameEl.textContent = LanguageModule.translate(`plan-${planInfo.id}-name`);
        }
        
        if (planPriceEl) {
            planPriceEl.innerHTML = `
                <span class="plan-price">${StringHelpers.formatCurrency(planInfo.price)}</span>
                <span class="plan-period">${LanguageModule.translate('plan-price-period')}</span>
            `;
        }
        
        if (planDescEl) {
            planDescEl.textContent = LanguageModule.translate(`plan-${planInfo.id}-desc`);
        }
        
        selectedPlan = planInfo;
    }
    
    function validateSubscriptionForm(formData) {
        const errors = [];
        const lang = LanguageModule.getCurrentLanguage();
        
        // Name validation
        const name = formData.get('name');
        if (!ValidationHelpers.isRequired(name)) {
            errors.push({ field: 'name', message: ERROR_MESSAGES[lang].required });
        } else if (!ValidationHelpers.hasValidLength(name, 2, 50)) {
            errors.push({ field: 'name', message: StringHelpers.interpolate(ERROR_MESSAGES[lang].minLength, { min: 2 }) });
        }
        
        // Email validation
        const email = formData.get('email');
        if (!ValidationHelpers.isRequired(email)) {
            errors.push({ field: 'email', message: ERROR_MESSAGES[lang].required });
        } else if (!ValidationHelpers.isValidEmail(email)) {
            errors.push({ field: 'email', message: ERROR_MESSAGES[lang].email });
        }
        
        // Phone validation
        const phone = formData.get('phone');
        if (!ValidationHelpers.isRequired(phone)) {
            errors.push({ field: 'phone', message: ERROR_MESSAGES[lang].required });
        } else if (!ValidationHelpers.isValidPhone(phone)) {
            errors.push({ field: 'phone', message: ERROR_MESSAGES[lang].phone });
        }
        
        // Document validation
        const document = formData.get('document');
        if (!ValidationHelpers.isRequired(document)) {
            errors.push({ field: 'document', message: ERROR_MESSAGES[lang].required });
        } else if (!ValidationHelpers.hasValidLength(document, 8, 12)) {
            errors.push({ field: 'document', message: 'Documento debe tener entre 8 y 12 caracteres' });
        }
        
        // Birth date validation
        const birthdate = formData.get('birthdate');
        if (!ValidationHelpers.isRequired(birthdate)) {
            errors.push({ field: 'birthdate', message: ERROR_MESSAGES[lang].required });
        } else {
            const age = calculateAge(new Date(birthdate));
            if (age < 18) {
                errors.push({ field: 'birthdate', message: 'Debes ser mayor de 18 años' });
            } else if (age > 80) {
                errors.push({ field: 'birthdate', message: 'La edad máxima permitida es 80 años' });
            }
        }
        
        // Terms validation
        const terms = formData.get('terms');
        if (!terms) {
            errors.push({ field: 'terms', message: 'Debes aceptar los términos y condiciones' });
        }
        
        // Privacy validation
        const privacy = formData.get('privacy');
        if (!privacy) {
            errors.push({ field: 'privacy', message: 'Debes aceptar la política de privacidad' });
        }
        
        return errors;
    }
    
    function calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    function processSubscription(formData) {
        return new Promise((resolve, reject) => {
            // Simulate payment processing
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate for demo
                
                if (success) {
                    const subscription = {
                        id: `SUB-${Date.now()}`,
                        planId: selectedPlan.id,
                        planName: selectedPlan.id,
                        price: selectedPlan.price,
                        customerData: {
                            name: formData.get('name'),
                            email: formData.get('email'),
                            phone: formData.get('phone'),
                            document: formData.get('document'),
                            birthdate: formData.get('birthdate')
                        },
                        status: 'active',
                        startDate: new Date().toISOString(),
                        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    };
                    
                    resolve(subscription);
                } else {
                    reject(new Error('Error procesando el pago. Por favor intenta nuevamente.'));
                }
            }, 2500);
        });
    }
    
    function showPaymentSimulation() {
        const lang = LanguageModule.getCurrentLanguage();
        const content = `
            <div class="payment-simulation">
                <div class="payment-header">
                    <h4>${lang === 'es' ? 'Procesando Pago' : 'Processing Payment'}</h4>
                    <div class="loading-spinner"></div>
                </div>
                <div class="payment-details">
                    <p><strong>${LanguageModule.translate(`plan-${selectedPlan.id}-name`)}</strong></p>
                    <p>${StringHelpers.formatCurrency(selectedPlan.price)} ${LanguageModule.translate('plan-price-period')}</p>
                </div>
                <div class="payment-steps">
                    <div class="step completed">
                        <i class="fas fa-check"></i>
                        <span>${lang === 'es' ? 'Datos validados' : 'Data validated'}</span>
                    </div>
                    <div class="step processing">
                        <div class="step-spinner"></div>
                        <span>${lang === 'es' ? 'Procesando pago...' : 'Processing payment...'}</span>
                    </div>
                    <div class="step pending">
                        <i class="fas fa-clock"></i>
                        <span>${lang === 'es' ? 'Confirmación' : 'Confirmation'}</span>
                    </div>
                </div>
            </div>
        `;
        
        const modal = ModalsModule.create('custom', {
            id: 'payment-modal',
            temporary: true
        });
        
        if (modal) {
            ModalsModule.updateContent('payment-modal', content);
        }
        
        return modal;
    }
    
    function showSubscriptionSuccess(subscription) {
        const lang = LanguageModule.getCurrentLanguage();
        const content = `
            <div class="subscription-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>${lang === 'es' ? '¡Suscripción Exitosa!' : 'Subscription Successful!'}</h4>
                <div class="subscription-details">
                    <p><strong>${lang === 'es' ? 'Plan:' : 'Plan:'}</strong> ${LanguageModule.translate(`plan-${subscription.planId}-name`)}</p>
                    <p><strong>${lang === 'es' ? 'Precio:' : 'Price:'}</strong> ${StringHelpers.formatCurrency(subscription.price)} ${LanguageModule.translate('plan-price-period')}</p>
                    <p><strong>${lang === 'es' ? 'ID de Suscripción:' : 'Subscription ID:'}</strong> ${subscription.id}</p>
                    <p><strong>${lang === 'es' ? 'Próximo pago:' : 'Next payment:'}</strong> ${Utils.formatDate(subscription.nextPayment)}</p>
                </div>
                <div class="next-steps">
                    <h5>${lang === 'es' ? 'Próximos pasos:' : 'Next steps:'}</h5>
                    <ul>
                        <li>${lang === 'es' ? 'Recibirás un email de confirmación' : 'You will receive a confirmation email'}</li>
                        <li>${lang === 'es' ? 'Descarga nuestra app móvil' : 'Download our mobile app'}</li>
                        <li>${lang === 'es' ? 'Tu cobertura inicia inmediatamente' : 'Your coverage starts immediately'}</li>
                    </ul>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-ghost" onclick="ModalsModule.close('success-modal')">
                        ${lang === 'es' ? 'Cerrar' : 'Close'}
                    </button>
                    <button class="btn btn-primary" onclick="SubscriptionModule.downloadApp()">
                        ${lang === 'es' ? 'Descargar App' : 'Download App'}
                    </button>
                </div>
            </div>
        `;
        
        const modal = ModalsModule.create('custom', {
            id: 'success-modal',
            temporary: true
        });
        
        if (modal) {
            ModalsModule.updateContent('success-modal', content);
        }
    }
    
    function addSubscriptionStyles() {
        ModuleHelpers.injectStyles('subscription', `
                    .subscription-content {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    
                    .plan-summary {
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        color: white;
                        padding: var(--space-8);
                        border-radius: var(--radius-lg);
                        margin-bottom: var(--space-6);
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .plan-summary::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
                        pointer-events: none;
                    }
                    
                    .plan-icon {
                        width: 60px;
                        height: 60px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto var(--space-4);
                        font-size: 1.5rem;
                    }
                    
                    .plan-summary h4 {
                        margin: 0 0 var(--space-3) 0;
                        font-size: var(--font-size-2xl);
                        font-weight: var(--font-weight-bold);
                    }
                    
                    .plan-price-display {
                        margin-bottom: var(--space-4);
                    }
                    
                    .plan-price-main {
                        font-size: var(--font-size-3xl);
                        font-weight: var(--font-weight-extrabold);
                        line-height: 1;
                        margin-bottom: var(--space-1);
                    }
                    
                    .plan-savings {
                        font-size: var(--font-size-sm);
                        opacity: 0.9;
                        background: rgba(255, 255, 255, 0.2);
                        padding: var(--space-1) var(--space-3);
                        border-radius: var(--radius);
                        display: inline-block;
                    }
                    
                    .plan-description {
                        opacity: 0.95;
                        margin-bottom: var(--space-4);
                        font-size: var(--font-size-lg);
                    }
                    
                    .plan-highlights {
                        display: flex;
                        gap: var(--space-4);
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .highlight-item {
                        display: flex;
                        align-items: center;
                        gap: var(--space-2);
                        font-size: var(--font-size-sm);
                    }
                    
                    .highlight-item i {
                        background: rgba(255, 255, 255, 0.2);
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                    }
                    
                    .subscription-steps {
                        margin-bottom: var(--space-6);
                    }
                    
                    .step-indicator {
                        display: flex;
                        justify-content: center;
                        gap: var(--space-8);
                        position: relative;
                    }
                    
                    .step-indicator::before {
                        content: '';
                        position: absolute;
                        top: 15px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 2px;
                        background: var(--gray-300);
                        z-index: 1;
                    }
                    
                    .step {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: var(--space-2);
                        position: relative;
                        z-index: 2;
                    }
                    
                    .step-number {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: var(--gray-300);
                        color: var(--gray-600);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: var(--font-weight-semibold);
                        transition: all var(--transition-base);
                    }
                    
                    .step.active .step-number {
                        background: var(--primary);
                        color: var(--white);
                    }
                    
                    .step-label {
                        font-size: var(--font-size-sm);
                        color: var(--gray-600);
                        text-align: center;
                    }
                    
                    .step.active .step-label {
                        color: var(--primary);
                        font-weight: var(--font-weight-semibold);
                    }
                    
                    .subscription-form {
                        background: var(--white);
                    }
                    
                    .form-section {
                        background: var(--gray-50);
                        border-radius: var(--radius-lg);
                        padding: var(--space-6);
                        margin-bottom: var(--space-4);
                        border: 1px solid var(--gray-200);
                    }
                    
                    .section-title {
                        display: flex;
                        align-items: center;
                        gap: var(--space-3);
                        font-size: var(--font-size-lg);
                        font-weight: var(--font-weight-semibold);
                        color: var(--dark);
                        margin-bottom: var(--space-4);
                        padding-bottom: var(--space-2);
                        border-bottom: 2px solid var(--primary);
                    }
                    
                    .section-title i {
                        color: var(--primary);
                    }
                    
                    .form-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: var(--space-4);
                    }
                    
                    @media (max-width: 768px) {
                        .form-row {
                            grid-template-columns: 1fr;
                        }
                        
                        .plan-highlights {
                            flex-direction: column;
                            align-items: center;
                        }
                        
                        .step-indicator {
                            gap: var(--space-4);
                        }
                        
                        .step-indicator::before {
                            width: 40px;
                        }
                    }
                    
                    .terms-section {
                        background: var(--white);
                        border-radius: var(--radius);
                        padding: var(--space-4);
                        border: 1px solid var(--gray-200);
                    }
                    
                    .checkbox-group {
                        margin-bottom: var(--space-3);
                    }
                    
                    .checkbox-label {
                        display: flex;
                        align-items: flex-start;
                        gap: var(--space-3);
                        cursor: pointer;
                        font-size: var(--font-size-sm);
                        line-height: var(--line-height-relaxed);
                    }
                    
                    .checkbox-label input[type="checkbox"] {
                        display: none;
                    }
                    
                    .checkmark {
                        width: 20px;
                        height: 20px;
                        border: 2px solid var(--gray-400);
                        border-radius: var(--radius-sm);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all var(--transition-base);
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    
                    .checkbox-label input[type="checkbox"]:checked + .checkmark {
                        background: var(--primary);
                        border-color: var(--primary);
                    }
                    
                    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
                        content: '✓';
                        color: var(--white);
                        font-size: 12px;
                        font-weight: bold;
                    }
                    
                    .checkbox-label:hover .checkmark {
                        border-color: var(--primary);
                    }
                    
                    .btn-large {
                        padding: var(--space-4) var(--space-8);
                        font-size: var(--font-size-lg);
                        font-weight: var(--font-weight-semibold);
                    }
                    
                    .btn-large i {
                        margin-right: var(--space-2);
                    }
                    
                    /* Date Input Styling */
                    input[type="date"] {
                        position: relative;
                        background: var(--white);
                        border: 2px solid var(--gray-300);
                        border-radius: var(--radius);
                        padding: var(--space-3) var(--space-4);
                        font-family: inherit;
                        font-size: var(--font-size-base);
                        color: var(--dark);
                        transition: all var(--transition-base);
                    }
                    
                    input[type="date"]:focus {
                        border-color: var(--primary);
                        box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
                        outline: none;
                    }
                    
                    input[type="date"]::-webkit-calendar-picker-indicator {
                        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230066ff"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>') no-repeat center;
                        background-size: 20px;
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                        border: none;
                        padding: 0;
                        margin-left: var(--space-2);
                    }
                    
                    input[type="date"]::-webkit-inner-spin-button,
                    input[type="date"]::-webkit-clear-button {
                        display: none;
                    }
                    
                    /* Custom checkbox validation fix */
                    .checkbox-label input[type="checkbox"]:invalid {
                        box-shadow: none;
                        outline: none;
                    }
                    
                    .checkbox-label input[type="checkbox"]:invalid + .checkmark {
                        border-color: var(--error, #ef4444);
                        animation: shake 0.3s ease-in-out;
                    }
                    
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-3px); }
                        75% { transform: translateX(3px); }
                    }
                    
                    .form-error {
                        color: var(--error, #ef4444);
                        font-size: var(--font-size-sm);
                        margin-top: var(--space-1);
                        display: block;
                    }
                    
                    .plan-summary .plan-price {
                        font-size: var(--font-size-3xl);
                        font-weight: var(--font-weight-extrabold);
                        margin-right: var(--space-2);
                    }
                    
                    .plan-summary .plan-period {
                        font-size: var(--font-size-base);
                        opacity: 0.8;
                    }
                    
                    .payment-simulation {
                        text-align: center;
                        padding: var(--space-8);
                    }
                    
                    .payment-header {
                        margin-bottom: var(--space-6);
                    }
                    
                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid var(--gray-200);
                        border-top: 4px solid var(--primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: var(--space-4) auto;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .payment-steps {
                        margin-top: var(--space-6);
                    }
                    
                    .step {
                        display: flex;
                        align-items: center;
                        gap: var(--space-3);
                        padding: var(--space-3);
                        margin-bottom: var(--space-2);
                        border-radius: var(--radius);
                    }
                    
                    .step.completed {
                        background: rgba(16, 185, 129, 0.1);
                        color: var(--success);
                    }
                    
                    .step.processing {
                        background: rgba(59, 130, 246, 0.1);
                        color: var(--primary);
                    }
                    
                    .step.pending {
                        background: var(--gray-100);
                        color: var(--gray-500);
                    }
                    
                    .step-spinner {
                        width: 16px;
                        height: 16px;
                        border: 2px solid transparent;
                        border-top: 2px solid currentColor;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    
                    .subscription-success {
                        text-align: center;
                        padding: var(--space-6);
                    }
                    
                    .success-icon {
                        font-size: 4rem;
                        color: var(--success);
                        margin-bottom: var(--space-4);
                    }
                    
                    .subscription-details {
                        background: var(--gray-100);
                        padding: var(--space-4);
                        border-radius: var(--radius);
                        margin: var(--space-4) 0;
                        text-align: left;
                    }
                    
                    .next-steps {
                        background: var(--light);
                        padding: var(--space-4);
                        border-radius: var(--radius);
                        margin: var(--space-4) 0;
                        text-align: left;
                    }
                    
                    .next-steps ul {
                        margin: var(--space-2) 0 0 var(--space-4);
                        list-style: disc;
                    }
                    
                    .next-steps li {
                        margin-bottom: var(--space-1);
                    }
        `);
    }
    
    // Public API
    return {
        /**
         * Initialize the subscription module
         */
        init() {
            addSubscriptionStyles();
        },
        
        /**
         * Open subscription modal for a specific plan
         */
        openModal(planId, price) {
            const modal = ModalsModule.create('subscription', {
                id: 'subscription-modal',
                temporary: true
            });
            
            if (modal) {
                // Update plan summary after modal is created
                setTimeout(() => {
                    updatePlanSummary(planId, price);
                }, 100);
            }
            
            // Track plan selection
            EventBus.emit(EVENTS.planSelected, { planId, price });
        },
        
        /**
         * Process subscription form
         */
        async processSubscription(formData) {
            // Validate form
            const errors = validateSubscriptionForm(formData);
            if (errors.length > 0) {
                return { success: false, errors };
            }
            
            try {
                // Close subscription modal
                ModalsModule.close('subscription-modal');
                
                // Show payment simulation
                const paymentModal = showPaymentSimulation();
                
                // Process subscription
                const subscription = await processSubscription(formData);
                
                // Close payment modal
                ModalsModule.close('payment-modal');
                
                // Save subscription data
                this.saveSubscription(subscription);
                
                // Show success modal
                setTimeout(() => {
                    showSubscriptionSuccess(subscription);
                }, 500);
                
                // Emit success event
                EventBus.emit('subscriptionCompleted', subscription);
                
                return { success: true, subscription };
                
            } catch (error) {
                // Close payment modal
                ModalsModule.close('payment-modal');
                
                // Show error
                setTimeout(() => {
                    alert(`Error: ${error.message}`);
                }, 500);
                
                return { success: false, error: error.message };
            }
        },
        
        /**
         * Save subscription data
         */
        saveSubscription(subscription) {
            const existingSubscriptions = StorageHelpers.get('user_subscriptions', []);
            existingSubscriptions.push(subscription);
            StorageHelpers.set('user_subscriptions', existingSubscriptions);
        },
        
        /**
         * Get user subscriptions
         */
        getUserSubscriptions() {
            return StorageHelpers.get('user_subscriptions', []);
        },
        
        /**
         * Download app (placeholder)
         */
        downloadApp() {
            const lang = LanguageModule.getCurrentLanguage();
            alert(lang === 'es' 
                ? 'Demo: En la versión completa, esto redirigiría a las tiendas de aplicaciones.'
                : 'Demo: In the full version, this would redirect to app stores.'
            );
            
            ModalsModule.close('success-modal');
        },
        
        /**
         * Get plan information
         */
        getPlanInfo(planId) {
            return PLANS[planId];
        },
        
        /**
         * Calculate plan price with discounts
         */
        calculatePrice(planId, duration = 1, discountCode = null) {
            const plan = PLANS[planId];
            if (!plan) return null;
            
            let basePrice = plan.price * duration;
            let discount = 0;
            
            // Apply duration discounts
            if (duration >= 12) {
                discount = basePrice * 0.15; // 15% annual discount
            } else if (duration >= 6) {
                discount = basePrice * 0.10; // 10% semi-annual discount
            }
            
            // Apply discount codes (demo)
            if (discountCode) {
                switch (discountCode.toUpperCase()) {
                    case 'STUDENT20':
                        discount += basePrice * 0.20;
                        break;
                    case 'FAMILY10':
                        discount += basePrice * 0.10;
                        break;
                }
            }
            
            const finalPrice = Math.max(0, basePrice - discount);
            
            return {
                basePrice,
                discount,
                finalPrice,
                duration,
                monthly: finalPrice / duration
            };
        },
        
        /**
         * Cancel subscription (placeholder)
         */
        cancelSubscription(subscriptionId) {
            const lang = LanguageModule.getCurrentLanguage();
            const confirmed = confirm(
                lang === 'es' 
                    ? '¿Estás seguro de que quieres cancelar tu suscripción?'
                    : 'Are you sure you want to cancel your subscription?'
            );
            
            if (confirmed) {
                // In real app, this would call API
                alert(lang === 'es' 
                    ? 'Demo: Suscripción cancelada. En la versión completa, esto procesaría la cancelación real.'
                    : 'Demo: Subscription canceled. In the full version, this would process the actual cancellation.'
                );
            }
        }
    };
})();

// Auto-initialize when DOM is ready
ModuleHelpers.autoInit(SubscriptionModule);