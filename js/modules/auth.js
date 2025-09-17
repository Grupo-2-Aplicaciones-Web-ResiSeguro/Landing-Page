const AuthModule = (function() {
    let currentUser = null;
    let isAuthenticated = false;

    function updateUIForAuthState() {
        const authBtns = [DOMHelpers.query('#auth-button'), DOMHelpers.query('#mobile-auth-button')];
        const registerBtns = [DOMHelpers.query('#register-button'), DOMHelpers.query('#mobile-register-button')];
        const logoutBtns = [DOMHelpers.query('#logout-button'), DOMHelpers.query('#mobile-logout-button')];

        if (isAuthenticated && currentUser) {
            const userName = currentUser.name || currentUser.email;
            authBtns.forEach(btn => {
                if (btn) {
                    btn.textContent = userName;
                    btn.style.display = 'inline-flex';
                }
            });
            registerBtns.forEach(btn => btn && (btn.style.display = 'none'));
            logoutBtns.forEach(btn => btn && (btn.style.display = 'inline-flex'));
        } else {
            const loginText = LanguageModule.translate('nav-login');
            authBtns.forEach(btn => {
                if (btn) {
                    btn.textContent = loginText;
                    btn.style.display = 'inline-flex';
                }
            });
            registerBtns.forEach(btn => btn && (btn.style.display = 'inline-flex'));
            logoutBtns.forEach(btn => btn && (btn.style.display = 'none'));
        }
    }

    function simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && email.includes('@') && password.length >= 4) {
                    const user = {
                        id: Date.now(),
                        email: email,
                        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                        joinDate: new Date().toISOString(),
                        plan: null,
                        isDemo: true
                    };
                    resolve(user);
                } else {
                    const lang = LanguageModule.getCurrentLanguage();
                    const errorMessage = lang === 'es'
                        ? 'Por favor ingresa un email válido y contraseña de al menos 4 caracteres'
                        : 'Please enter a valid email and password of at least 4 characters';
                    reject(new Error(errorMessage));
                }
            }, 800);
        });
    }

    function saveUserSession(user) {
        currentUser = user;
        isAuthenticated = true;

        StorageHelpers.set('user_session', {
            user: user,
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        });

        updateUIForAuthState();
        EventBus.emit('userAuthenticated', { user });
    }

    function clearUserSession() {
        currentUser = null;
        isAuthenticated = false;
        StorageHelpers.remove('user_session');
        updateUIForAuthState();
        EventBus.emit('userLoggedOut');
    }

    function loadUserSession() {
        const session = StorageHelpers.get('user_session');

        if (session && session.expiresAt > Date.now()) {
            currentUser = session.user;
            isAuthenticated = true;
            updateUIForAuthState();
            return true;
        } else {
            StorageHelpers.remove('user_session');
            return false;
        }
    }

    return {
        init() {
            loadUserSession();
            EventBus.on(EVENTS.languageChanged, updateUIForAuthState);
        },

        openLoginModal() {
            ModalsModule.create('login', { id: 'login-modal', temporary: true });
        },

        openRegistrationModal() {
            const lang = LanguageModule.getCurrentLanguage();
            const message = lang === 'es'
                ? 'Demo: Para probar la funcionalidad, puedes usar el botón "Iniciar Sesión" con cualquier email válido y contraseña de 4+ caracteres.'
                : 'Demo: To test functionality, you can use the "Sign In" button with any valid email and 4+ character password.';
            alert(message);
        },

        async login(email, password) {
            try {
                const user = await simulateLogin(email, password);
                saveUserSession(user);
                return { success: true, user };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        logout() {
            clearUserSession();
            const lang = LanguageModule.getCurrentLanguage();
            const message = lang === 'es' ? 'Sesión cerrada exitosamente' : 'Successfully signed out';
            setTimeout(() => alert(message), 100);
        },

        getCurrentUser() { return currentUser; },
        isAuthenticated() { return isAuthenticated; },

        showProfile() {
            const lang = LanguageModule.getCurrentLanguage();
            const content = `
                <div class="profile-content">
                    <h4>${lang === 'es' ? 'Mi Perfil' : 'My Profile'}</h4>
                    <div class="profile-info">
                        <p><strong>${lang === 'es' ? 'Nombre:' : 'Name:'}</strong> ${currentUser.name}</p>
                        <p><strong>${lang === 'es' ? 'Email:' : 'Email:'}</strong> ${currentUser.email}</p>
                        <p><strong>${lang === 'es' ? 'Plan:' : 'Plan:'}</strong> ${currentUser.plan}</p>
                        <p><strong>${lang === 'es' ? 'Miembro desde:' : 'Member since:'}</strong> ${Utils.formatDate(currentUser.joinDate)}</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="ModalsModule.close('profile-modal')">
                            ${lang === 'es' ? 'Cerrar' : 'Close'}
                        </button>
                    </div>
                </div>
            `;

            const modal = ModalsModule.create('custom', { id: 'profile-modal', temporary: true });
            if (modal) ModalsModule.updateContent('profile-modal', content);
        },

        showPolicies() {
            const lang = LanguageModule.getCurrentLanguage();
            const content = `
                <div class="policies-content">
                    <h4>${lang === 'es' ? 'Mis Pólizas' : 'My Policies'}</h4>
                    <div class="policies-list">
                        <div class="policy-item">
                            <h5>Plan ${currentUser.plan}</h5>
                            <p>${lang === 'es' ? 'Estado:' : 'Status:'} <span class="status active">${lang === 'es' ? 'Activa' : 'Active'}</span></p>
                            <p>${lang === 'es' ? 'Próximo pago:' : 'Next payment:'} ${Utils.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}</p>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-ghost" onclick="ClaimsModule.openModal()">
                            ${lang === 'es' ? 'Hacer Reclamo' : 'Make Claim'}
                        </button>
                        <button class="btn btn-primary" onclick="ModalsModule.close('policies-modal')">
                            ${lang === 'es' ? 'Cerrar' : 'Close'}
                        </button>
                    </div>
                </div>
            `;

            const modal = ModalsModule.create('custom', { id: 'policies-modal', temporary: true });
            if (modal) ModalsModule.updateContent('policies-modal', content);
        },

        updateProfile(profileData) {
            if (!isAuthenticated) return false;
            Object.assign(currentUser, profileData);
            saveUserSession(currentUser);
            return true;
        },

        checkSession() { return loadUserSession(); }
    };
})();

ModuleHelpers.autoInit(AuthModule);