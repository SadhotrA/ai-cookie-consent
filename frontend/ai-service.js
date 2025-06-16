class AIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async analyzeCookies(cookies) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a cookie analysis expert. Analyze the provided cookies and categorize them, explain their purposes, and suggest privacy implications."
                        },
                        {
                            role: "user",
                            content: `Analyze these cookies and provide a detailed explanation: ${JSON.stringify(cookies)}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error analyzing cookies:', error);
            return null;
        }
    }

    async generateCookiePolicy(cookies) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a privacy policy expert. Generate a clear and compliant cookie policy based on the provided cookies."
                        },
                        {
                            role: "user",
                            content: `Generate a cookie policy for these cookies: ${JSON.stringify(cookies)}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating cookie policy:', error);
            return null;
        }
    }

    async suggestOptimalSettings(cookies, websiteType) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a privacy optimization expert. Suggest optimal cookie settings based on the website type and cookies used."
                        },
                        {
                            role: "user",
                            content: `Suggest optimal cookie settings for a ${websiteType} website with these cookies: ${JSON.stringify(cookies)}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error suggesting optimal settings:', error);
            return null;
        }
    }
}

export default AIService; 