const App = (function() {
    let isInitialized = false;

    const modules = [
        'SharedUtils', 'LanguageModule', 'NavigationModule', 'AnimationModule',
        'ModalsModule', 'SimulatorModule', 'AuthModule', 'SubscriptionModule',
        'ContactModule', 'SupportModule', 'ClaimsModule'
    ];

    function initializeModules() {
        modules.forEach(module => {
            if (typeof window[module] !== 'undefined' && window[module].init) {
                try { window[module].init(); } catch (e) { console.error(`Error initializing ${module}:`, e); }
            }
        });
    }

    function setupGlobalEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && ModalsModule?.closeAll) ModalsModule.closeAll();
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                const lang = LanguageModule?.getCurrentLanguage?.() || 'es';
                LanguageModule?.setLanguage?.(lang === 'es' ? 'en' : 'es');
            }
        });

        window.addEventListener('error', (e) => {
            if (!e.error?.message?.includes('Script error')) {
                console.error('Global error:', e.error || e.message);
            }
        });
    }

    return {
        init() {
            if (isInitialized) return;
            setupGlobalEvents();
            initializeModules();
            isInitialized = true;
            EventBus?.emit?.('appReady');
        },
        isInitialized: () => isInitialized
    };
})();

function createModal(type, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            ${content}
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => e.target === modal && modal.remove());
    return modal;
}

window.ContactModule = {
    openModal() {
        const lang = LanguageModule?.getCurrentLanguage?.() || 'es';
        const isEs = lang === 'es';
        createModal('contact', `
            <div style="color:var(--gray-800);padding:1rem">
                <h3>${isEs ? 'Contacto' : 'Contact'}</h3>
                <div style="display:grid;gap:1rem;margin:1.5rem 0">
                    <div style="padding:1rem;background:var(--gray-100);border-radius:8px">
                        <h4><i class="fas fa-phone" style="color:var(--primary);margin-right:0.5rem"></i>${isEs ? 'Teléfono' : 'Phone'}</h4>
                        <p>+51 900 000 000</p>
                    </div>
                    <div style="padding:1rem;background:var(--gray-100);border-radius:8px">
                        <h4><i class="fab fa-whatsapp" style="color:var(--success);margin-right:0.5rem"></i>WhatsApp</h4>
                        <a href="https://wa.me/51900000000" class="btn btn-primary btn-sm" target="_blank">${isEs ? 'Chatear' : 'Chat'}</a>
                    </div>
                    <div style="padding:1rem;background:var(--gray-100);border-radius:8px">
                        <h4><i class="fas fa-envelope" style="color:var(--secondary);margin-right:0.5rem"></i>Email</h4>
                        <a href="mailto:contacto@resicare.com" class="btn btn-primary btn-sm">${isEs ? 'Enviar' : 'Send'}</a>
                    </div>
                </div>
            </div>`);
    }
};

window.SupportModule = {
    openHelp() {
        const lang = LanguageModule?.getCurrentLanguage?.() || 'es';
        const isEs = lang === 'es';
        const faqs = isEs ? [
            ['¿Cómo hago un reclamo?', 'Puedes hacer un reclamo tomando una foto y completando nuestro formulario simple.'],
            ['¿Qué cubre mi seguro?', 'Tu seguro cubre robos, daños accidentales y pérdidas según el plan contratado.'],
            ['¿Cuánto tiempo toma?', 'Los reclamos se procesan en máximo 48 horas hábiles.']
        ] : [
            ['How do I make a claim?', 'You can make a claim by taking a photo and completing our simple form.'],
            ['What does my insurance cover?', 'Your insurance covers theft, accidental damage and losses according to your plan.'],
            ['How long does it take?', 'Claims are processed within 48 business hours maximum.']
        ];

        createModal('help', `
            <div style="color:var(--gray-800);padding:1rem">
                <h3>${isEs ? 'Centro de Ayuda' : 'Help Center'}</h3>
                <div style="max-height:400px;overflow-y:auto;margin:1.5rem 0">
                    ${faqs.map(([q, a]) => `
                        <div style="margin:1rem 0;padding:1rem;background:var(--gray-100);border-radius:8px">
                            <strong>${q}</strong>
                            <p style="margin:0.5rem 0 0 0">${a}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`);
    }
};

window.ClaimsModule = {
    openModal() {
        const lang = LanguageModule?.getCurrentLanguage?.() || 'es';
        const isEs = lang === 'es';
        createModal('claims', `
            <div style="color:var(--gray-800);padding:1rem">
                <h3>${isEs ? 'Hacer Reclamo' : 'Make Claim'}</h3>
                <form style="margin:1.5rem 0">
                    <div style="margin-bottom:1rem">
                        <label style="display:block;margin-bottom:0.5rem;font-weight:600">${isEs ? 'Tipo de incidente' : 'Incident type'}</label>
                        <select style="width:100%;padding:0.75rem;border:2px solid var(--gray-300);border-radius:8px">
                            <option>${isEs ? 'Selecciona tipo' : 'Select type'}</option>
                            <option>${isEs ? 'Robo' : 'Theft'}</option>
                            <option>${isEs ? 'Daño' : 'Damage'}</option>
                            <option>${isEs ? 'Pérdida' : 'Loss'}</option>
                        </select>
                    </div>
                    <div style="margin-bottom:1rem">
                        <label style="display:block;margin-bottom:0.5rem;font-weight:600">${isEs ? 'Descripción' : 'Description'}</label>
                        <textarea style="width:100%;padding:0.75rem;border:2px solid var(--gray-300);border-radius:8px;min-height:100px" placeholder="${isEs ? 'Describe qué pasó...' : 'Describe what happened...'}"></textarea>
                    </div>
                    <div style="margin-bottom:1rem">
                        <label style="display:block;margin-bottom:0.5rem;font-weight:600">${isEs ? 'Fecha' : 'Date'}</label>
                        <input type="date" style="width:100%;padding:0.75rem;border:2px solid var(--gray-300);border-radius:8px">
                    </div>
                    <div style="margin-bottom:1rem">
                        <label style="display:block;margin-bottom:0.5rem;font-weight:600">${isEs ? 'Fotos' : 'Photos'}</label>
                        <input type="file" accept="image/*" multiple style="width:100%">
                    </div>
                </form>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="alert('${isEs ? 'Reclamo enviado' : 'Claim submitted'}'); this.closest('.modal-overlay').remove()">
                        ${isEs ? 'Enviar' : 'Submit'}
                    </button>
                </div>
            </div>`);
    }
};

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', () => App.init())
    : App.init();

window.ResiCareApp = App;