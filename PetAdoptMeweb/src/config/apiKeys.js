// API Keys Configuration for Web Application
export const API_KEYS = {
    // Google Vision API Key
    GOOGLE_VISION_API_KEY: process.env.REACT_APP_GOOGLE_VISION_API_KEY,

    // OpenAI API Key
    OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,

    // Gemini API Key
    GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY,
};

// API Endpoint URLs
export const API_ENDPOINTS = {
    GOOGLE_VISION: 'https://vision.googleapis.com/v1/images:annotate',
    OPENAI_CHAT: 'https://api.openai.com/v1/chat/completions',
    GEMINI_GENERATE: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
};

// Validate API Keys
export const validateApiKeys = () => {
    return {
        google: !!API_KEYS.GOOGLE_VISION_API_KEY,
        openai: !!API_KEYS.OPENAI_API_KEY,
        gemini: !!API_KEYS.GEMINI_API_KEY,
    };
};

// Get Available APIs
export const getAvailableApis = () => {
    const validation = validateApiKeys();
    const available = [];

    if (validation.google) available.push('Google Vision');
    if (validation.openai) available.push('OpenAI');
    if (validation.gemini) available.push('Gemini');

    return available;
};

// Rate limiting configuration
export const RATE_LIMITS = {
    GOOGLE_VISION: {
        requestsPerMinute: 60,
        requestsPerDay: 1000,
    },
    OPENAI: {
        requestsPerMinute: 60,
        tokensPerMinute: 40000,
    },
    GEMINI: {
        requestsPerMinute: 60,
        requestsPerDay: 1500,
    },
};

// Error handling constants
export const API_ERRORS = {
    QUOTA_EXCEEDED: 'API quota exceeded',
    INVALID_KEY: 'Invalid API key',
    NETWORK_ERROR: 'Network error',
    RATE_LIMITED: 'Rate limit exceeded',
    UNKNOWN_ERROR: 'Unknown error occurred',
};

export default API_KEYS; 