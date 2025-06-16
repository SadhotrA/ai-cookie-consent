# Modern Cookie Consent Widget

A modern, customizable cookie consent widget that helps websites comply with privacy regulations like GDPR and CCPA.

## Features

- 🎨 Modern and responsive design
- 🌓 Dark mode support
- 🌐 Multi-language support
- 🔍 Search/filter cookies
- 📱 Mobile-friendly
- 📦 Export/import settings
- 🧪 Comprehensive test suite

## Installation

1. Install the package:
```bash
npm install ai-cookie-consent
```

2. Build the widget:
```bash
npm run build
```

3. Copy the built file from `dist/cookie-consent.min.js` to your project.

## Usage

1. Add the widget script to your HTML:
```html
<script src="path/to/cookie-consent.min.js"></script>
```

2. Initialize the widget:
```javascript
// Create widget instance
const widget = new CookieConsentWidget();

// Create and append the widget to the page
document.body.appendChild(widget.createWidget());

// Set up your cookies
widget.cookies = [
    {
        name: 'session',
        description: 'Session cookie for maintaining user state',
        category: 'necessary',
        expiry: 'Session',
        enabled: false
    },
    {
        name: 'analytics',
        description: 'Google Analytics cookie for tracking user behavior',
        category: 'analytics',
        expiry: '1 year',
        enabled: false
    }
];

// Render the cookies
widget.renderCookies();
```

## Customization

### Languages
The widget supports multiple languages. Add new languages by extending the `languages` object in the widget:

```javascript
widget.languages = {
    en: {
        title: 'Cookie Settings',
        // ... other translations
    },
    es: {
        title: 'Configuración de Cookies',
        // ... other translations
    }
};
```

### Styling
The widget comes with a modern default style, but you can customize it by overriding the CSS classes:

```css
.cookie-consent-widget {
    /* Your custom styles */
}
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-cookie-consent.git
cd ai-cookie-consent
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

4. Start development mode:
```bash
npm run dev
```

## Testing on Real Websites

1. Build the widget:
```bash
npm run build
```

2. Copy the built file (`dist/cookie-consent.min.js`) to your website.

3. Add the widget to your website's HTML:
```html
<script src="path/to/cookie-consent.min.js"></script>
<script>
    const widget = new CookieConsentWidget();
    document.body.appendChild(widget.createWidget());
    
    // Configure your cookies
    widget.cookies = [
        // Your cookie configuration
    ];
    
    widget.renderCookies();
</script>
```

4. Test the following scenarios:
   - Cookie category toggles
   - Language switching
   - Dark mode
   - Mobile responsiveness
   - Export/import settings
   - Search functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your projects! 