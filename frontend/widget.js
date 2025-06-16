class CookieConsentWidget {
    constructor() {
        this.widget = null;
        this.cookies = [];
        this.isOpen = false;
        this.currentLanguage = 'en';
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.languages = {
            en: {
                title: 'Cookie Settings',
                description: 'Manage your cookie preferences',
                acceptAll: 'Accept All',
                save: 'Save Preferences',
                search: 'Search cookies...',
                export: 'Export Settings',
                import: 'Import Settings',
                language: 'Language',
                darkMode: 'Dark Mode',
                categories: {
                    necessary: 'Necessary',
                    analytics: 'Analytics',
                    marketing: 'Marketing',
                    preferences: 'Preferences'
                }
            },
            es: {
                title: 'Configuración de Cookies',
                description: 'Administre sus preferencias de cookies',
                acceptAll: 'Aceptar Todo',
                save: 'Guardar Preferencias',
                search: 'Buscar cookies...',
                export: 'Exportar Configuración',
                import: 'Importar Configuración',
                language: 'Idioma',
                darkMode: 'Modo Oscuro',
                categories: {
                    necessary: 'Necesarias',
                    analytics: 'Analíticas',
                    marketing: 'Marketing',
                    preferences: 'Preferencias'
                }
            }
        };
    }

    init(options = {}) {
        const defaultOptions = {
            position: 'bottom-right',
            theme: 'dark',
            message: 'We use cookies to enhance your experience.',
            acceptButtonText: 'Accept',
            declineButtonText: 'Decline',
            onAccept: () => {},
            onDecline: () => {}
        };

        this.options = { ...defaultOptions, ...options };
        this.createWidget();
        document.body.appendChild(this.widget);
        this.updateTheme();
        this.updateLanguage();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'cookie-consent-widget';
        widget.innerHTML = `
            <div class="cookie-consent-header">
                <h2 data-i18n="title">${this.languages[this.currentLanguage].title}</h2>
                <div class="cookie-consent-controls">
                    <select class="language-selector"><option value="en">English</option><option value="es">Español</option></select>
                    <button class="theme-toggle" aria-label="Toggle dark mode"><i class="fas fa-moon"></i></button>
                </div>
            </div>
            <div class="cookie-consent-search">
                <input type="text" placeholder="${this.languages[this.currentLanguage].search}" class="cookie-search" data-i18n-placeholder="search">
            </div>
            <div class="cookie-consent-content">
                <div class="cookie-categories"></div>
                <div class="cookie-list"></div>
            </div>
            <div class="cookie-consent-footer">
                <div class="cookie-consent-actions">
                    <button class="accept-all" data-i18n="acceptAll">${this.languages[this.currentLanguage].acceptAll}</button>
                    <button class="save-preferences" data-i18n="save">${this.languages[this.currentLanguage].save}</button>
                </div>
                <div class="cookie-consent-export">
                    <button class="export-settings" data-i18n="export">${this.languages[this.currentLanguage].export}</button>
                    <button class="import-settings" data-i18n="import">${this.languages[this.currentLanguage].import}</button>
                </div>
            </div>
        `;
        this.widget = widget;

        // Add event listeners using this.widget
        const languageSelector = this.widget.querySelector('.language-selector');
        const themeToggle = this.widget.querySelector('.theme-toggle');
        const searchInput = this.widget.querySelector('.cookie-search');
        const exportButton = this.widget.querySelector('.export-settings');
        const importButton = this.widget.querySelector('.import-settings');
        const acceptAllButton = this.widget.querySelector('.accept-all');
        const saveButton = this.widget.querySelector('.save-preferences');

        languageSelector.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateLanguage();
        });

        themeToggle.addEventListener('click', () => {
            this.darkMode = !this.darkMode;
            this.updateTheme();
        });

        searchInput.addEventListener('input', (e) => {
            this.filterCookies(e.target.value);
        });

        exportButton.addEventListener('click', () => {
            this.exportSettings();
        });

        importButton.addEventListener('click', () => {
            this.importSettings();
        });

        acceptAllButton.addEventListener('click', () => {
            this.acceptAllCookies();
        });

        saveButton.addEventListener('click', () => {
            this.savePreferences();
        });

        // Add window resize listener
        window.addEventListener('resize', () => {
            this.updateResponsiveStyles();
        });

        // Initial responsive styles
        this.updateResponsiveStyles();

        return widget;
    }

    updateLanguage() {
        // Update text content for all elements with data-i18n
        const elements = this.widget.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.languages[this.currentLanguage][key]) {
                element.textContent = this.languages[this.currentLanguage][key];
            }
        });
        // Update placeholders
        const placeholders = this.widget.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.languages[this.currentLanguage][key]) {
                element.setAttribute('placeholder', this.languages[this.currentLanguage][key]);
            }
        });
    }

    updateTheme() {
        this.widget.classList.toggle('dark-mode', this.darkMode);
        const themeToggle = this.widget.querySelector('.theme-toggle i');
        themeToggle.className = this.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    filterCookies(searchTerm) {
        const cookieList = this.widget.querySelector('.cookie-list');
        const cookies = cookieList.querySelectorAll('.cookie-item');
        
        cookies.forEach(cookie => {
            const name = cookie.querySelector('.cookie-name').textContent.toLowerCase();
            const description = cookie.querySelector('.cookie-description').textContent.toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            
            if (name.includes(searchLower) || description.includes(searchLower)) {
                cookie.style.display = 'block';
            } else {
                cookie.style.display = 'none';
            }
        });
    }

    exportSettings() {
        const settings = {
            cookies: this.cookies,
            language: this.currentLanguage,
            darkMode: this.darkMode
        };
        
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cookie-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    async importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const settings = JSON.parse(text);
                    
                    this.cookies = settings.cookies;
                    this.currentLanguage = settings.language;
                    this.darkMode = settings.darkMode;
                    
                    this.updateLanguage();
                    this.updateTheme();
                    this.renderCookies();
                } catch (error) {
                    console.error('Error importing settings:', error);
                }
            }
        };
        
        input.click();
    }

    renderCookies() {
        const cookieList = this.widget.querySelector('.cookie-list');
        cookieList.innerHTML = '';
        // Group cookies by category
        const categories = {};
        this.cookies.forEach(cookie => {
            if (!categories[cookie.category]) {
                categories[cookie.category] = [];
            }
            categories[cookie.category].push(cookie);
        });
        // Render each category
        Object.keys(categories).forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'cookie-category';
            categoryDiv.setAttribute('data-category', category);
            categoryDiv.innerHTML = `
                <div class="cookie-category-header">
                    <h3>${category}</h3>
                    <button class="cookie-category-toggle">Toggle All</button>
                </div>
                <div class="cookie-category-items"></div>
            `;
            const categoryItems = categoryDiv.querySelector('.cookie-category-items');
            categories[category].forEach(cookie => {
                const item = document.createElement('div');
                item.className = 'cookie-item';
                item.innerHTML = `
                    <div class="cookie-name">${cookie.name}</div>
                    <div class="cookie-description">${cookie.description}</div>
                    <div class="cookie-expiry">Expires: ${cookie.expiry}</div>
                    <label class="cookie-toggle">
                        <input type="checkbox" ${cookie.enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                `;
                categoryItems.appendChild(item);
            });
            cookieList.appendChild(categoryDiv);

            // Add event listener for category toggle
            const categoryToggle = categoryDiv.querySelector('.cookie-category-toggle');
            categoryToggle.addEventListener('click', () => {
                this.toggleCategory(category);
            });
        });
    }

    toggleCategory(category) {
        const categoryDiv = this.widget.querySelector(`.cookie-category[data-category="${category}"]`);
        if (!categoryDiv) return;

        const checkboxes = categoryDiv.querySelectorAll('input[type="checkbox"]');
        // Get the current state of the first checkbox
        const firstCheckbox = checkboxes[0];
        // Toggle to the opposite state
        const newState = !firstCheckbox.checked;

        checkboxes.forEach(checkbox => {
            checkbox.checked = newState;
            const cookieItem = checkbox.closest('.cookie-item');
            const cookieName = cookieItem.querySelector('.cookie-name').textContent;
            const cookie = this.cookies.find(c => c.name === cookieName);
            if (cookie) {
                cookie.enabled = newState;
            }
        });
    }

    acceptAllCookies() {
        this.cookies.forEach(cookie => {
            cookie.enabled = true;
        });
        this.renderCookies();
    }

    savePreferences() {
        fetch('/api/cookies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cookies: this.cookies })
        }).then(response => {
            if (response.ok) {
                console.log('Preferences saved successfully');
            } else {
                console.error('Failed to save preferences');
            }
        }).catch(error => {
            console.error('Error saving preferences:', error);
        });
    }

    // Update responsive styles
    updateResponsiveStyles() {
        if (window.innerWidth <= 768) {
            this.widget.style.width = '100%';
            this.widget.style.maxWidth = '100%';
            this.widget.style.borderRadius = '12px 12px 0 0';
        } else {
            this.widget.style.width = '';
            this.widget.style.maxWidth = '';
            this.widget.style.borderRadius = '';
        }
    }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .cookie-consent-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-width: 90vw;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        transition: all 0.3s ease;
        overflow: hidden;
    }

    .cookie-consent-widget.dark-mode {
        background: #1a1a1a;
        color: #fff;
    }

    .cookie-consent-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cookie-consent-widget.dark-mode .cookie-consent-header {
        border-bottom-color: #333;
    }

    .cookie-consent-controls {
        display: flex;
        gap: 10px;
    }

    .language-selector,
    .theme-toggle {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .cookie-consent-widget.dark-mode .language-selector,
    .cookie-consent-widget.dark-mode .theme-toggle {
        background: #2a2a2a;
        border-color: #444;
        color: #fff;
    }

    .cookie-consent-search {
        padding: 15px;
        border-bottom: 1px solid #eee;
    }

    .cookie-consent-widget.dark-mode .cookie-consent-search {
        border-bottom-color: #333;
    }

    .cookie-search {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
    }

    .cookie-consent-widget.dark-mode .cookie-search {
        background: #2a2a2a;
        border-color: #444;
        color: #fff;
    }

    .cookie-consent-content {
        max-height: 400px;
        overflow-y: auto;
        padding: 15px;
    }

    .cookie-category {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 8px;
        background: #f8f9fa;
        transition: all 0.2s ease;
    }

    .cookie-consent-widget.dark-mode .cookie-category {
        background: #2a2a2a;
    }

    .cookie-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .cookie-category-title {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .cookie-category-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #e9ecef;
    }

    .cookie-consent-widget.dark-mode .cookie-category-icon {
        background: #3a3a3a;
    }

    .cookie-item {
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 6px;
        margin-bottom: 10px;
        transition: all 0.2s ease;
    }

    .cookie-consent-widget.dark-mode .cookie-item {
        border-color: #333;
    }

    .cookie-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .cookie-consent-widget.dark-mode .cookie-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .cookie-name {
        font-weight: 600;
        margin-bottom: 5px;
    }

    .cookie-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
    }

    .cookie-consent-widget.dark-mode .cookie-description {
        color: #aaa;
    }

    .cookie-expiry {
        font-size: 12px;
        color: #888;
    }

    .cookie-consent-widget.dark-mode .cookie-expiry {
        color: #777;
    }

    .cookie-consent-footer {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .cookie-consent-widget.dark-mode .cookie-consent-footer {
        border-top-color: #333;
    }

    .cookie-consent-actions,
    .cookie-consent-export {
        display: flex;
        gap: 10px;
    }

    .cookie-consent-actions button,
    .cookie-consent-export button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .accept-all {
        background: #007bff;
        color: #fff;
    }

    .accept-all:hover {
        background: #0056b3;
    }

    .save-preferences {
        background: #28a745;
        color: #fff;
    }

    .save-preferences:hover {
        background: #218838;
    }

    .export-settings,
    .import-settings {
        background: #6c757d;
        color: #fff;
    }

    .export-settings:hover,
    .import-settings:hover {
        background: #5a6268;
    }

    .cookie-consent-widget.dark-mode .accept-all {
        background: #0d6efd;
    }

    .cookie-consent-widget.dark-mode .accept-all:hover {
        background: #0b5ed7;
    }

    .cookie-consent-widget.dark-mode .save-preferences {
        background: #198754;
    }

    .cookie-consent-widget.dark-mode .save-preferences:hover {
        background: #157347;
    }

    .cookie-consent-widget.dark-mode .export-settings,
    .cookie-consent-widget.dark-mode .import-settings {
        background: #6c757d;
    }

    .cookie-consent-widget.dark-mode .export-settings:hover,
    .cookie-consent-widget.dark-mode .import-settings:hover {
        background: #5c636a;
    }

    @media (max-width: 480px) {
        .cookie-consent-widget {
            bottom: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            border-radius: 12px 12px 0 0;
        }

        .cookie-consent-actions,
        .cookie-consent-export {
            flex-direction: column;
        }

        .cookie-consent-actions button,
        .cookie-consent-export button {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// Create a default instance
const cookieConsent = new CookieConsentWidget();

// Export the instance
export default cookieConsent; 