// Example configuration file
// Copy this file to config.js and replace the values with your own

const config = {
    // Your OpenAI API key
    // Get it from: https://platform.openai.com/api-keys
    OPENAI_API_KEY: 'sk-your-api-key-here',
    
    // Default widget settings
    WIDGET_SETTINGS: {
        // Position of the widget on the page
        // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        position: 'bottom-right',
        
        // Theme of the widget
        // Options: 'dark', 'light'
        theme: 'dark',
        
        // Message shown to users
        message: 'We use cookies to enhance your experience.',
        
        // Button text
        acceptButtonText: 'Accept',
        declineButtonText: 'Decline',
        
        // Optional: Custom cookie categories
        categories: {
            necessary: {
                name: 'Necessary',
                description: 'Essential cookies for the website to function properly',
                required: true
            },
            analytics: {
                name: 'Analytics',
                description: 'Cookies that help us understand how visitors interact with our website',
                required: false
            },
            marketing: {
                name: 'Marketing',
                description: 'Cookies used to track visitors across websites for marketing purposes',
                required: false
            }
        }
    }
};

// Prevent modification of the config object
Object.freeze(config);

// Export the config
window.CONFIG = config; 