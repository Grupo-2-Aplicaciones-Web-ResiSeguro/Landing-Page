const ModalsModule = (function() {
    let activeModal = null;
    let modalStack = [];
    let lastFocusedElement = null;

    const modalTemplates = {
        login: {
            title: 'modal-login-title',
            content: `
                <form class="modal-form" data-form="login">
                    <div class="form-group">
                        <label for="login-email" data-translate="form-email">Correo electrónico</label>
                        <input type="email" id="login-email" name="email" class="form-input" required
                               data-translate-placeholder="form-email">
                    </div>
                    <div class="form-group">
                        <label for="login-password">Contraseña</label>
                        <input type="password" id="login-password" name="password" class="form-input" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" data-modal-close data-translate="form-cancel">Cancelar</button>
                        <button type="submit" class="btn btn-primary" data-translate="nav-login">Iniciar Sesión</button>
                    </div>
                </form>
            `
        },

        contact: {
            title: 'modal-contact-title',
            content: `
                <form class="modal-form" data-form="contact">
                    <div class="form-group">
                        <label for="contact-name" data-translate="form-name">Nombre completo</label>
                        <input type="text" id="contact-name" name="name" class="form-input" required
                               data-translate-placeholder="form-name">
                    </div>
                    <div class="form-group">
                        <label for="contact-email" data-translate="form-email">Correo electrónico</label>
                        <input type="email" id="contact-email" name="email" class="form-input" required
                               data-translate-placeholder="form-email">
                    </div>
                    <div class="form-group">
                        <label for="contact-phone" data-translate="form-phone">Teléfono (opcional)</label>
                        <input type="tel" id="contact-phone" name="phone" class="form-input"
                               data-translate-placeholder="form-phone">
                    </div>
                    <div class="form-group">
                        <label for="contact-message" data-translate="form-message">Mensaje</label>
                        <textarea id="contact-message" name="message" class="form-input" rows="4" required
                                  data-translate-placeholder="form-message"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" data-modal-close data-translate="form-cancel">Cancelar</button>
                        <button type="submit" class="btn btn-primary" data-translate="form-send">Enviar</button>
                    </div>
                </form>
            `
        },

        subscription: {
            title: 'modal-subscription-title',
            content: `
                <div class="subscription-content">
                    <div class="plan-summary">
                        <div class="plan-icon"><i class="fas fa-shield-alt"></i></div>
                        <h4 id="selected-plan-name">Plan Seleccionado</h4>
                        <div class="plan-price-display">
                            <div id="selected-plan-price" class="plan-price-main">S/ 0.00 / mes</div>
                            <div class="plan-savings">¡Ahorra con el pago anual!</div>
                        </div>
                        <p id="selected-plan-description" class="plan-description">Descripción del plan</p>
                        <div class="plan-highlights">
                            <div class="highlight-item"><i class="fas fa-check"></i><span>Cobertura inmediata</span></div>
                            <div class="highlight-item"><i class="fas fa-check"></i><span>Proceso 100% digital</span></div>
                            <div class="highlight-item"><i class="fas fa-check"></i><span>Soporte 24/7</span></div>
                        </div>
                    </div>

                    <form class="modal-form subscription-form" data-form="subscription">
                        <div class="form-section">
                            <h5 class="section-title"><i class="fas fa-user"></i>Información Personal</h5>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="sub-name" data-translate="form-name">Nombre completo</label>
                                    <input type="text" id="sub-name" name="name" class="form-input" required
                                           placeholder="Ingresa tu nombre completo">
                                </div>
                                <div class="form-group">
                                    <label for="sub-email" data-translate="form-email">Correo electrónico</label>
                                    <input type="email" id="sub-email" name="email" class="form-input" required
                                           placeholder="tu@email.com">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="sub-phone" data-translate="form-phone">Teléfono</label>
                                    <input type="tel" id="sub-phone" name="phone" class="form-input" required
                                           placeholder="+51 999 999 999">
                                </div>
                                <div class="form-group">
                                    <label for="sub-document">Documento de identidad</label>
                                    <input type="text" id="sub-document" name="document" class="form-input" required
                                           placeholder="DNI o Carnet de extranjería">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="sub-birthdate">Fecha de nacimiento</label>
                                <input type="date" id="sub-birthdate" name="birthdate" class="form-input" required>
                            </div>
                        </div>

                        <div class="form-section">
                            <h5 class="section-title"><i class="fas fa-file-contract"></i>Términos y Condiciones</h5>
                            <div class="terms-section">
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="sub-terms" name="terms" required>
                                        <span class="checkmark"></span>
                                        Acepto los <a href="#" onclick="event.preventDefault(); alert('Demo: Términos y condiciones');">términos y condiciones</a>
                                    </label>
                                </div>
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="sub-privacy" name="privacy" required>
                                        <span class="checkmark"></span>
                                        Acepto la <a href="#" onclick="event.preventDefault(); alert('Demo: Política de privacidad');">política de privacidad</a>
                                    </label>
                                </div>
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="sub-marketing" name="marketing">
                                        <span class="checkmark"></span>
                                        Quiero recibir ofertas y noticias por email (opcional)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn btn-ghost" data-modal-close data-translate="form-cancel">
                                <i class="fas fa-times"></i>Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary btn-large">
                                <i class="fas fa-shield-alt"></i>Suscribirse Ahora (Demo)
                            </button>
                        </div>
                    </form>
                </div>
            `
        }
    };

    function createModal(type, options = {}) {
        const template = modalTemplates[type];
        if (!template) {
            console.error(`Modal template '${type}' not found`);
            return null;
        }

        const modalId = options.id || `modal-${type}-${Date.now()}`;
        const content = `
            <h3 id="${modalId}-title" data-translate="${template.title}">
                ${LanguageModule.translate(template.title)}
            </h3>
            <div class="modal-body">${template.content}</div>
        `;

        const modal = SharedUtils.ModalManager.createTemplate(type, content);
        modal.id = modalId;
        modal.setAttribute('aria-labelledby', `${modalId}-title`);

        setupModalEventListeners(modal);
        return modal;
    }

    function setupModalEventListeners(modal) {
        const closeBtns = modal.querySelectorAll('[data-modal-close]');
        closeBtns.forEach(closeBtn => {
            DOMHelpers.addEvent(closeBtn, 'click', (e) => {
                e.preventDefault();
                closeModal(modal.id);
            });
        });

        DOMHelpers.addEvent(modal, 'click', (e) => {
            if (e.target === modal && MODAL_CONFIG.backdropClose) {
                closeModal(modal.id);
            }
        });

        const form = modal.querySelector('.modal-form');
        if (form) {
            DOMHelpers.addEvent(form, 'submit', (e) => {
                e.preventDefault();
                handleFormSubmission(form, modal);
            });
        }

        DOMHelpers.addEvent(document, 'keydown', (e) => {
            if (e.key === 'Escape' && activeModal === modal && MODAL_CONFIG.escapeClose) {
                closeModal(modal.id);
            }
        });
    }

    function openModal(modalId) {
        const modal = DOMHelpers.query(`#${modalId}`);
        if (!modal) return false;

        lastFocusedElement = document.activeElement;
        modalStack.push(modalId);
        activeModal = modal;

        SharedUtils.ModalManager.show(modal);
        EventBus.emit(EVENTS.modalOpened, { modalId, modal });

        return true;
    }

    function closeModal(modalId) {
        const modal = DOMHelpers.query(`#${modalId}`);
        if (!modal) return false;

        modalStack = modalStack.filter(id => id !== modalId);

        SharedUtils.ModalManager.hide(modal);

        if (modalStack.length > 0) {
            const lastModalId = modalStack[modalStack.length - 1];
            activeModal = DOMHelpers.query(`#${lastModalId}`);
        } else {
            activeModal = null;
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        }

        EventBus.emit(EVENTS.modalClosed, { modalId, modal });
        return true;
    }

    async function handleFormSubmission(form, modal) {
        const formType = form.dataset.form;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        SharedUtils.LoadingManager.add(submitBtn);

        if (!SharedUtils.FormValidator.validateForm(form)) {
            SharedUtils.LoadingManager.remove(submitBtn);
            return;
        }

        try {
            await SharedUtils.FormProcessor.process(formData, formType);
            const lang = LanguageModule.getCurrentLanguage();
            const messages = {
                login: lang === 'es' ? 'Sesión iniciada exitosamente' : 'Successfully signed in',
                contact: lang === 'es' ? 'Mensaje enviado exitosamente' : 'Message sent successfully',
                subscription: lang === 'es' ? 'Suscripción completada' : 'Subscription completed'
            };
            SharedUtils.FormProcessor.showSuccess(messages[formType] || 'Success');
            closeModal(modal.id);
        } catch (error) {
            alert(error.message);
        } finally {
            SharedUtils.LoadingManager.remove(submitBtn);
        }
    }

    return {
        init() {
            let container = DOMHelpers.query('#modals-container');
            if (!container) {
                container = DOMHelpers.createElement('div', { id: 'modals-container' });
                document.body.appendChild(container);
            }

            DOMHelpers.addEvent(document, 'click', (e) => {
                if (e.target.closest('[data-modal-close]') && activeModal) {
                    e.preventDefault();
                    closeModal(activeModal.id);
                }
            });
        },

        create(type, options = {}) {
            const modal = createModal(type, options);
            if (!modal) return null;

            const container = DOMHelpers.query('#modals-container') || document.body;
            container.appendChild(modal);

            if (options.temporary !== false) modal.dataset.temporary = 'true';
            if (options.autoOpen !== false) setTimeout(() => openModal(modal.id), 10);

            return modal;
        },

        open: openModal,
        close: closeModal,
        closeAll() { modalStack.forEach(modalId => closeModal(modalId)); },
        getActiveModal() { return activeModal; },
        isModalOpen() { return activeModal !== null; },

        updateContent(modalId, content) {
            const modal = DOMHelpers.query(`#${modalId}`);
            if (modal) {
                const body = modal.querySelector('.modal-body');
                if (body) body.innerHTML = content;
            }
        }
    };
})();

ModuleHelpers.autoInit(ModalsModule);