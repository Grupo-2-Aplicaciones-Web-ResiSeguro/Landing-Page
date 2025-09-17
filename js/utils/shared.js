const SharedUtils = (function() {
    const FormValidator = {
        showError(element, message) {
            this.hideError(element);
            const errorDiv = DOMHelpers.createElement('div', {
                className: 'field-error',
                style: 'color: var(--error); font-size: var(--font-size-xs); margin-top: var(--space-1);'
            }, message);
            element.parentNode.appendChild(errorDiv);
            element.classList.add('error');
        },

        hideError(element) {
            const existingError = element.parentNode.querySelector('.field-error');
            if (existingError) existingError.remove();
            element.classList.remove('error');
        },

        showCheckboxError(input, message) {
            this.hideCheckboxError(input);
            const checkboxGroup = input.closest('.checkbox-group');
            const checkmark = input.nextElementSibling;

            if (checkmark && checkmark.classList.contains('checkmark')) {
                checkmark.style.borderColor = 'var(--error, #ef4444)';
                checkmark.style.animation = 'shake 0.3s ease-in-out';
            }

            const errorDiv = DOMHelpers.createElement('div', {
                className: 'checkbox-error',
                style: 'color: var(--error, #ef4444); font-size: var(--font-size-sm); margin-top: var(--space-1); display: block;'
            }, message);

            (checkboxGroup || input.parentNode).appendChild(errorDiv);

            setTimeout(() => {
                if (checkmark) checkmark.style.animation = '';
            }, 300);
        },

        hideCheckboxError(input) {
            const checkboxGroup = input.closest('.checkbox-group');
            const checkmark = input.nextElementSibling;

            if (checkmark && checkmark.classList.contains('checkmark')) {
                checkmark.style.borderColor = '';
                checkmark.style.animation = '';
            }

            const container = checkboxGroup || input.parentNode;
            const existingError = container.querySelector('.checkbox-error');
            if (existingError) existingError.remove();
        },

        validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            inputs.forEach(input => {
                this.hideError(input);
                if (input.type === 'checkbox') this.hideCheckboxError(input);

                let fieldValid = true;

                if (input.type === 'checkbox') {
                    if (input.hasAttribute('required') && !input.checked) {
                        fieldValid = false;
                        const lang = LanguageModule.getCurrentLanguage();
                        let message = ERROR_MESSAGES[lang].required;

                        if (input.name === 'terms') {
                            message = lang === 'es' ? 'Debes aceptar los términos y condiciones' : 'You must accept the terms and conditions';
                        } else if (input.name === 'privacy') {
                            message = lang === 'es' ? 'Debes aceptar la política de privacidad' : 'You must accept the privacy policy';
                        }

                        this.showCheckboxError(input, message);
                    }
                } else {
                    const value = input.value.trim();

                    if (input.hasAttribute('required') && !value) {
                        fieldValid = false;
                        this.showError(input, ERROR_MESSAGES[LanguageModule.getCurrentLanguage()].required);
                    }

                    if (value && fieldValid) {
                        switch (input.type) {
                            case 'email':
                                if (!ValidationHelpers.isValidEmail(value)) {
                                    fieldValid = false;
                                    this.showError(input, ERROR_MESSAGES[LanguageModule.getCurrentLanguage()].email);
                                }
                                break;
                            case 'tel':
                                if (!ValidationHelpers.isValidPhone(value)) {
                                    fieldValid = false;
                                    this.showError(input, ERROR_MESSAGES[LanguageModule.getCurrentLanguage()].phone);
                                }
                                break;
                            case 'file':
                                const files = input.files;
                                for (let file of files) {
                                    if (!ValidationHelpers.isValidFileSize(file)) {
                                        fieldValid = false;
                                        this.showError(input, ERROR_MESSAGES[LanguageModule.getCurrentLanguage()].fileSize);
                                        break;
                                    }
                                }
                                break;
                        }
                    }
                }

                if (!fieldValid) {
                    isValid = false;
                    if (input.type !== 'checkbox') {
                        AnimationModule.shakeElement(input);
                    }
                }
            });

            return isValid;
        }
    };

    const LoadingManager = {
        add(element) {
            if (!element) return;
            element.disabled = true;
            element.classList.add('animate-pulse');
            const originalText = element.textContent;
            element.dataset.originalText = originalText;
            element.textContent = LanguageModule.getCurrentLanguage() === 'es' ? 'Procesando...' : 'Processing...';
        },

        remove(element) {
            if (!element) return;
            element.disabled = false;
            element.classList.remove('animate-pulse');
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
                delete element.dataset.originalText;
            }
        }
    };

    const ModalManager = {
        createTemplate(type, content) {
            const modalId = `modal-${type}-${Date.now()}`;
            const modal = DOMHelpers.createElement('div', {
                id: modalId,
                className: 'modal-overlay',
                'aria-hidden': 'true',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': `${modalId}-title`
            });

            const modalContent = DOMHelpers.createElement('div', {
                className: 'modal',
                innerHTML: `
                    <button class="modal-close" data-modal-close aria-label="Cerrar modal">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <div class="modal-body">${content}</div>
                `
            });

            modal.appendChild(modalContent);
            return modal;
        },

        show(modal) {
            if (!modal) return false;
            document.body.style.overflow = 'hidden';
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => modal.classList.add('active'));

            const firstInput = modal.querySelector('input, select, textarea, button');
            if (firstInput) setTimeout(() => firstInput.focus(), 100);

            return true;
        },

        hide(modal) {
            if (!modal) return false;
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                if (modal.dataset.temporary === 'true') modal.remove();
            }, 300);
            return true;
        }
    };

    const FormProcessor = {
        async process(formData, type) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const success = Math.random() > 0.1;
                    if (success) {
                        const result = {
                            id: `${type.toUpperCase()}-${Date.now()}`,
                            type,
                            timestamp: new Date().toISOString(),
                            data: Object.fromEntries(formData.entries())
                        };
                        resolve(result);
                    } else {
                        reject(new Error('Processing failed. Please try again.'));
                    }
                }, 1500);
            });
        },

        showSuccess(message) {
            const notification = DOMHelpers.createElement('div', {
                className: 'notification success',
                style: `
                    position: fixed; top: 20px; right: 20px;
                    background: var(--success); color: white;
                    padding: var(--space-4); border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg); z-index: 10000;
                    animation: slideInRight 0.3s ease;
                `
            }, message);

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }
    };

    const StyleManager = {
        inject(id, css) {
            if (!DOMHelpers.query(`#${id}`)) {
                const style = DOMHelpers.createElement('style', { id, innerHTML: css });
                document.head.appendChild(style);
            }
        },

        addCommonStyles() {
            this.inject('shared-styles', `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-3px); }
                    75% { transform: translateX(3px); }
                }
                .field-error, .checkbox-error { animation: shake 0.5s ease-in-out; }
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `);
        }
    };

    return {
        FormValidator,
        LoadingManager,
        ModalManager,
        FormProcessor,
        StyleManager,
        init() {
            StyleManager.addCommonStyles();
        }
    };
})();

ModuleHelpers.autoInit(SharedUtils);