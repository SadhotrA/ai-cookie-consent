import { CookieConsentWidget } from './widget.js';

// Test suite for CookieConsentWidget
describe('CookieConsentWidget', () => {
    let widget;
    let mockCookies;
    let originalCreateElement;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '';
        
        // Create widget instance
        widget = new CookieConsentWidget();
        
        // Mock cookies data
        mockCookies = [
            {
                name: 'session',
                description: 'Session cookie',
                category: 'necessary',
                expiry: 'Session',
                enabled: false
            },
            {
                name: 'analytics',
                description: 'Analytics cookie',
                category: 'analytics',
                expiry: '1 year',
                enabled: false
            }
        ];
        if (!originalCreateElement) originalCreateElement = document.createElement;
    });

    afterEach(() => {
        // Cleanup
        document.body.innerHTML = '';
        document.createElement = originalCreateElement;
    });

    test('should initialize with default settings', () => {
        expect(widget.currentLanguage).toBe('en');
        expect(widget.darkMode).toBe(window.matchMedia('(prefers-color-scheme: dark)').matches);
        expect(widget.cookies).toEqual([]);
        expect(widget.isOpen).toBe(false);
    });

    test('should create widget DOM structure', () => {
        widget.createWidget();
        expect(widget.widget).toBeTruthy();
        expect(widget.widget.className).toBe('cookie-consent-widget');
        expect(widget.widget.querySelector('.cookie-consent-header')).toBeTruthy();
        expect(widget.widget.querySelector('.cookie-consent-content')).toBeTruthy();
        expect(widget.widget.querySelector('.cookie-consent-footer')).toBeTruthy();
    });

    test('should toggle dark mode', () => {
        widget.createWidget();
        const themeToggle = widget.widget.querySelector('.theme-toggle');
        
        // Initial state
        expect(widget.darkMode).toBe(window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Toggle dark mode
        themeToggle.click();
        expect(widget.darkMode).toBe(!window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Check if dark mode class is applied
        expect(widget.widget.classList.contains('dark-mode')).toBe(widget.darkMode);
    });

    test('should change language', () => {
        widget.createWidget();
        const languageSelector = widget.widget.querySelector('.language-selector');
        
        // Change to Spanish
        languageSelector.value = 'es';
        languageSelector.dispatchEvent(new Event('change'));
        
        expect(widget.currentLanguage).toBe('es');
        expect(widget.widget.querySelector('h2').textContent).toBe('Configuración de Cookies');
    });

    test('should filter cookies based on search term', () => {
        widget.createWidget();
        widget.cookies = mockCookies;
        widget.renderCookies();
        
        const searchInput = widget.widget.querySelector('.cookie-search');
        const cookieList = widget.widget.querySelector('.cookie-list');
        
        // Search for 'session'
        searchInput.value = 'session';
        searchInput.dispatchEvent(new Event('input'));
        
        const visibleCookies = cookieList.querySelectorAll('.cookie-item:not([style*="display: none"])');
        expect(visibleCookies.length).toBe(1);
        expect(visibleCookies[0].querySelector('.cookie-name').textContent).toBe('session');
    });

    test('should export settings', () => {
        widget.createWidget();
        widget.cookies = mockCookies;
        widget.currentLanguage = 'es';
        widget.darkMode = true;
        const mockCreateObjectURL = jest.fn();
        const mockRevokeObjectURL = jest.fn();
        URL.createObjectURL = mockCreateObjectURL;
        URL.revokeObjectURL = mockRevokeObjectURL;
        const mockAnchor = { href: '', download: '', click: jest.fn() };
        document.createElement = jest.fn((tag) => tag === 'a' ? mockAnchor : originalCreateElement.call(document, tag));
        const exportButton = widget.widget.querySelector('.export-settings');
        exportButton.click();
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockRevokeObjectURL).toHaveBeenCalled();
        expect(mockAnchor.download).toBe('cookie-settings.json');
        document.createElement = originalCreateElement;
    });

    test('should import settings', async () => {
        widget.createWidget();
        // Mock file with .text() method
        const mockFile = { text: () => Promise.resolve(JSON.stringify({
            cookies: mockCookies,
            language: 'es',
            darkMode: true
        })) };
        // Mock input element
        const mockInput = {
            type: '',
            accept: '',
            onchange: null,
            click: jest.fn()
        };
        document.createElement = jest.fn((tag) => tag === 'input' ? mockInput : originalCreateElement.call(document, tag));
        // Trigger import
        const importButton = widget.widget.querySelector('.import-settings');
        importButton.click();
        // Simulate file selection
        await mockInput.onchange({ target: { files: [mockFile] } });
        // Verify import
        expect(widget.cookies).toEqual(mockCookies);
        expect(widget.currentLanguage).toBe('es');
        expect(widget.darkMode).toBe(true);
    });

    it('should handle cookie category toggles', () => {
        const widget = new CookieConsentWidget();
        widget.createWidget();
        widget.cookies = mockCookies;
        widget.renderCookies();
        
        const category = 'necessary';
        const categoryDiv = widget.widget.querySelector(`.cookie-category[data-category="${category}"]`);
        const cookies = categoryDiv.querySelectorAll('.cookie-item');
        
        // Click the category toggle
        const categoryToggle = categoryDiv.querySelector('.cookie-category-toggle');
        categoryToggle.click();
        
        // Check that all checkboxes in the category are toggled
        cookies.forEach(cookie => {
            const checkbox = cookie.querySelector('input[type="checkbox"]');
            expect(checkbox.checked).toBe(true); // Should be checked after toggle
        });
        
        // Click again to toggle back
        categoryToggle.click();
        
        // Check that all checkboxes are unchecked
        cookies.forEach(cookie => {
            const checkbox = cookie.querySelector('input[type="checkbox"]');
            expect(checkbox.checked).toBe(false); // Should be unchecked after second toggle
        });
    });

    test('should handle accept all cookies', () => {
        widget.createWidget();
        widget.cookies = mockCookies;
        widget.renderCookies();
        
        const acceptAllButton = widget.widget.querySelector('.accept-all');
        acceptAllButton.click();
        
        // Verify all cookies are enabled
        widget.cookies.forEach(cookie => {
            expect(cookie.enabled).toBe(true);
        });
    });

    test('should handle save preferences', () => {
        widget.createWidget();
        widget.cookies = mockCookies;
        widget.renderCookies();
        
        // Mock fetch
        global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
        
        const saveButton = widget.widget.querySelector('.save-preferences');
        saveButton.click();
        
        // Verify preferences are saved
        expect(global.fetch).toHaveBeenCalledWith('/api/cookies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cookies: mockCookies })
        });
    });

    test('should be responsive on mobile devices', () => {
        widget.createWidget();
        
        // Mock window resize
        window.innerWidth = 400;
        window.dispatchEvent(new Event('resize'));
        
        // Verify mobile styles
        expect(widget.widget.style.width).toBe('100%');
        expect(widget.widget.style.maxWidth).toBe('100%');
        expect(widget.widget.style.borderRadius).toBe('12px 12px 0 0');
    });
}); 