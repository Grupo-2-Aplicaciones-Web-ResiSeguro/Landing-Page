const SimulatorModule = (function() {
    let elements = {};
    let currentCalculation = null;
    
    // Private methods
    function cacheElements() {
        elements = {
            simulator: DOMHelpers.query('#premium-simulator'),
            itemValue: DOMHelpers.query('#item-value'),
            planSelect: DOMHelpers.query('#plan-select'),
            duration: DOMHelpers.query('#duration'),
            result: DOMHelpers.query('#simulator-result'),
            calculateBtn: DOMHelpers.query('[onclick*="SimulatorModule.calculate"]'),
            resetBtn: DOMHelpers.query('[onclick*="SimulatorModule.reset"]')
        };
    }
    
    function setupEventListeners() {
        // Input validation on change
        if (elements.itemValue) {
            DOMHelpers.addEvent(elements.itemValue, 'input', handleItemValueChange);
            DOMHelpers.addEvent(elements.itemValue, 'blur', validateItemValue);
        }
        
        if (elements.duration) {
            DOMHelpers.addEvent(elements.duration, 'input', handleDurationChange);
            DOMHelpers.addEvent(elements.duration, 'blur', validateDuration);
        }
        
        if (elements.planSelect) {
            DOMHelpers.addEvent(elements.planSelect, 'change', handlePlanChange);
        }
        
        // Auto-calculate on value change (debounced)
        const autoCalculate = Utils.debounce(() => {
            if (isValidInput()) {
                SimulatorModule.calculate();
            }
        }, 500);
        
        [elements.itemValue, elements.planSelect, elements.duration].forEach(element => {
            if (element) {
                DOMHelpers.addEvent(element, 'input', autoCalculate);
                DOMHelpers.addEvent(element, 'change', autoCalculate);
            }
        });
        
        // Keyboard shortcuts
        DOMHelpers.addEvent(document, 'keydown', handleKeyboardShortcuts);
    }
    
    function handleItemValueChange(e) {
        const value = parseFloat(e.target.value);
        const min = SIMULATOR_CONFIG.minItemValue;
        const max = SIMULATOR_CONFIG.maxItemValue;
        
        // Remove any previous error styling
        e.target.classList.remove('error');
        
        // Real-time validation feedback
        if (value && (value < min || value > max)) {
            e.target.classList.add('error');
            showValidationError(e.target, `Valor debe estar entre ${StringHelpers.formatCurrency(min)} y ${StringHelpers.formatCurrency(max)}`);
        } else {
            hideValidationError(e.target);
        }
    }
    
    function handleDurationChange(e) {
        const value = parseInt(e.target.value);
        const min = SIMULATOR_CONFIG.minDuration;
        const max = SIMULATOR_CONFIG.maxDuration;
        
        e.target.classList.remove('error');
        
        if (value && (value < min || value > max)) {
            e.target.classList.add('error');
            showValidationError(e.target, `Duración debe estar entre ${min} y ${max} meses`);
        } else {
            hideValidationError(e.target);
        }
    }
    
    function handlePlanChange(e) {
        const selectedPlan = e.target.value;
        const planInfo = Object.values(PLANS).find(plan => plan.price == selectedPlan);
        
        if (planInfo) {
            // Update UI to show plan benefits or limits
            updatePlanInfo(planInfo);
        }
        
        // Emit event for analytics
        EventBus.emit(EVENTS.planSelected, {
            planId: planInfo?.id,
            price: selectedPlan
        });
    }
    
    function handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            SimulatorModule.calculate();
        }
        
        // Escape to reset
        if (e.key === 'Escape') {
            SimulatorModule.reset();
        }
    }
    
    function validateItemValue() {
        const value = parseFloat(elements.itemValue?.value);
        const min = SIMULATOR_CONFIG.minItemValue;
        const max = SIMULATOR_CONFIG.maxItemValue;
        
        if (!value || value < min || value > max) {
            return {
                isValid: false,
                message: `Valor debe estar entre ${StringHelpers.formatCurrency(min)} y ${StringHelpers.formatCurrency(max)}`
            };
        }
        
        return { isValid: true };
    }
    
    function validateDuration() {
        const value = parseInt(elements.duration?.value);
        const min = SIMULATOR_CONFIG.minDuration;
        const max = SIMULATOR_CONFIG.maxDuration;
        
        if (!value || value < min || value > max) {
            return {
                isValid: false,
                message: `Duración debe estar entre ${min} y ${max} meses`
            };
        }
        
        return { isValid: true };
    }
    
    function validatePlan() {
        const value = parseFloat(elements.planSelect?.value);
        
        if (!value || value <= 0) {
            return {
                isValid: false,
                message: 'Selecciona un plan válido'
            };
        }
        
        return { isValid: true };
    }
    
    function isValidInput() {
        return validateItemValue().isValid && 
               validateDuration().isValid && 
               validatePlan().isValid;
    }
    
    function showValidationError(element, message) {
        // Remove existing error message
        hideValidationError(element);
        
        const errorDiv = DOMHelpers.createElement('div', {
            className: 'validation-error',
            style: 'color: var(--error); font-size: var(--font-size-xs); margin-top: var(--space-1);'
        }, message);
        
        element.parentNode.appendChild(errorDiv);
    }
    
    function hideValidationError(element) {
        const existingError = element.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function updatePlanInfo(planInfo) {
        // Could show additional plan information
        const planHelp = elements.planSelect?.parentNode.querySelector('.form-help');
        if (planHelp && planInfo) {
            planHelp.textContent = `Cobertura máxima: ${StringHelpers.formatCurrency(planInfo.maxCoverage)}`;
        }
    }
    
    function calculatePremium(itemValue, planPrice, duration) {
        // Base premium calculation
        const basePremium = planPrice * duration;
        
        // Risk surcharge based on item value
        const riskSurcharge = itemValue * SIMULATOR_CONFIG.riskSurchargeRate;
        
        // Total premium
        const totalPremium = basePremium + riskSurcharge;
        
        // Additional calculations
        const monthlyAverage = totalPremium / duration;
        const coverageRatio = (itemValue / totalPremium) * 100;
        
        return {
            basePremium,
            riskSurcharge,
            totalPremium,
            monthlyAverage,
            coverageRatio,
            itemValue,
            duration,
            planPrice
        };
    }
    
    function displayResult(calculation) {
        if (!elements.result) return;
        
        const { totalPremium, riskSurcharge, monthlyAverage, coverageRatio, itemValue, duration } = calculation;
        const lang = LanguageModule.getCurrentLanguage();
        
        const resultHTML = `
            <div class="simulator-result-content">
                <div class="result-header">
                    <h4>${lang === 'es' ? 'Resultado del Cálculo' : 'Calculation Result'}</h4>
                </div>
                <div class="result-main">
                    <div class="result-total">
                        <span class="result-label">${lang === 'es' ? 'Prima Total:' : 'Total Premium:'}</span>
                        <span class="result-value">${StringHelpers.formatCurrency(totalPremium)}</span>
                    </div>
                    <div class="result-breakdown">
                        <div class="breakdown-item">
                            <span>${lang === 'es' ? 'Prima base:' : 'Base premium:'}</span>
                            <span>${StringHelpers.formatCurrency(calculation.basePremium)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${lang === 'es' ? 'Recargo por riesgo:' : 'Risk surcharge:'}</span>
                            <span>${StringHelpers.formatCurrency(riskSurcharge)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${lang === 'es' ? 'Promedio mensual:' : 'Monthly average:'}</span>
                            <span>${StringHelpers.formatCurrency(monthlyAverage)}</span>
                        </div>
                    </div>
                </div>
                <div class="result-footer">
                    <div class="coverage-info">
                        <small>
                            ${lang === 'es' ? 'Protección' : 'Protection'}: ${StringHelpers.formatCurrency(itemValue)} 
                            ${lang === 'es' ? 'por' : 'for'} ${duration} ${duration === 1 ? (lang === 'es' ? 'mes' : 'month') : (lang === 'es' ? 'meses' : 'months')}
                        </small>
                    </div>
                    <div class="cta-actions">
                        <button class="btn btn-primary btn-sm" onclick="SubscriptionModule.openModal('premium', ${calculation.planPrice})">
                            ${lang === 'es' ? 'Contratar Ahora' : 'Subscribe Now'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        elements.result.innerHTML = resultHTML;
        elements.result.classList.add('show');
        
        // Scroll to result
        setTimeout(() => {
            elements.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        // Add entrance animation
        AnimationModule.addEntranceAnimation(elements.result, 'slideDown');
    }
    
    function clearResult() {
        if (elements.result) {
            elements.result.classList.remove('show');
            elements.result.innerHTML = '';
        }
    }
    
    function saveCalculation(calculation) {
        // Save to localStorage for later use
        StorageHelpers.set(STORAGE_KEYS.simulatorData, {
            ...calculation,
            timestamp: Date.now()
        });
    }
    
    function loadSavedCalculation() {
        const saved = StorageHelpers.get(STORAGE_KEYS.simulatorData);
        
        if (saved && saved.timestamp && (Date.now() - saved.timestamp) < 24 * 60 * 60 * 1000) {
            // Load if less than 24 hours old
            if (elements.itemValue) elements.itemValue.value = saved.itemValue;
            if (elements.planSelect) elements.planSelect.value = saved.planPrice;
            if (elements.duration) elements.duration.value = saved.duration;
            
            return saved;
        }
        
        return null;
    }
    
    function addResultStyles() {
        ModuleHelpers.injectStyles('simulator-result', `
                    .simulator-result {
                        margin-top: var(--space-6);
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.3s ease;
                    }
                    
                    .simulator-result.show {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .simulator-result-content {
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        color: white;
                        padding: var(--space-6);
                        border-radius: var(--radius-lg);
                        box-shadow: var(--shadow-lg);
                    }
                    
                    .result-header h4 {
                        margin: 0 0 var(--space-4) 0;
                        font-size: var(--font-size-lg);
                        text-align: center;
                    }
                    
                    .result-total {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: var(--font-size-xl);
                        font-weight: var(--font-weight-bold);
                        margin-bottom: var(--space-4);
                        padding-bottom: var(--space-4);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .result-breakdown {
                        margin-bottom: var(--space-4);
                    }
                    
                    .breakdown-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: var(--space-2);
                        font-size: var(--font-size-sm);
                        opacity: 0.9;
                    }
                    
                    .result-footer {
                        text-align: center;
                        padding-top: var(--space-4);
                        border-top: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .coverage-info {
                        margin-bottom: var(--space-3);
                        opacity: 0.8;
                    }
                    
                    .cta-actions .btn {
                        background: rgba(255, 255, 255, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: white;
                    }
                    
                    .cta-actions .btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: translateY(-2px);
                    }
                    
                    .validation-error {
                        animation: shake 0.5s ease-in-out;
                    }
        `);
    }
    
    // Public API
    return {
        /**
         * Initialize the simulator module
         */
        init() {
            cacheElements();
            setupEventListeners();
            addResultStyles();
            
            // Load any saved calculation
            loadSavedCalculation();
            
        },
        
        /**
         * Calculate premium
         */
        calculate() {
            if (!isValidInput()) {
                // Show validation errors
                const itemValidation = validateItemValue();
                const durationValidation = validateDuration();
                const planValidation = validatePlan();
                
                if (!itemValidation.isValid && elements.itemValue) {
                    elements.itemValue.classList.add('error');
                    showValidationError(elements.itemValue, itemValidation.message);
                    AnimationModule.shakeElement(elements.itemValue);
                }
                
                if (!durationValidation.isValid && elements.duration) {
                    elements.duration.classList.add('error');
                    showValidationError(elements.duration, durationValidation.message);
                    AnimationModule.shakeElement(elements.duration);
                }
                
                if (!planValidation.isValid && elements.planSelect) {
                    elements.planSelect.classList.add('error');
                    showValidationError(elements.planSelect, planValidation.message);
                    AnimationModule.shakeElement(elements.planSelect);
                }
                
                return;
            }
            
            // Get values
            const itemValue = parseFloat(elements.itemValue?.value || 0);
            const planPrice = parseFloat(elements.planSelect?.value || 0);
            const duration = parseInt(elements.duration?.value || 1);
            
            // Calculate
            currentCalculation = calculatePremium(itemValue, planPrice, duration);
            
            // Display result
            displayResult(currentCalculation);
            
            // Save calculation
            saveCalculation(currentCalculation);
            
            // Emit event
            EventBus.emit(EVENTS.simulatorCalculated, currentCalculation);
            
        },
        
        /**
         * Reset simulator
         */
        reset() {
            // Reset form values
            if (elements.itemValue) {
                elements.itemValue.value = SIMULATOR_CONFIG.defaultValues.itemValue;
                elements.itemValue.classList.remove('error');
            }
            
            if (elements.planSelect) {
                elements.planSelect.value = PLANS[SIMULATOR_CONFIG.defaultValues.plan].price;
            }
            
            if (elements.duration) {
                elements.duration.value = SIMULATOR_CONFIG.defaultValues.duration;
                elements.duration.classList.remove('error');
            }
            
            // Clear result
            clearResult();
            
            // Clear validation errors
            DOMHelpers.queryAll('.validation-error').forEach(error => error.remove());
            
            // Clear saved data
            StorageHelpers.remove(STORAGE_KEYS.simulatorData);
            
            currentCalculation = null;
            
        },
        
        /**
         * Get current calculation
         */
        getCurrentCalculation() {
            return currentCalculation;
        },
        
        /**
         * Set values programmatically
         */
        setValues(itemValue, planId, duration) {
            if (elements.itemValue && itemValue) {
                elements.itemValue.value = itemValue;
            }
            
            if (elements.planSelect && planId && PLANS[planId]) {
                elements.planSelect.value = PLANS[planId].price;
            }
            
            if (elements.duration && duration) {
                elements.duration.value = duration;
            }
        },
        
        /**
         * Validate current inputs
         */
        validate() {
            return isValidInput();
        },
        
        /**
         * Get plan information
         */
        getPlanInfo(planPrice) {
            return Object.values(PLANS).find(plan => plan.price == planPrice);
        }
    };
})();

// Auto-initialize when DOM is ready
ModuleHelpers.autoInit(SimulatorModule);