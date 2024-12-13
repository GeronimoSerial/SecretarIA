const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { context } = require('../context/context');

// Load environment variables
dotenv.config();

class GeminiChatService {
    constructor(apiKey, maxTokens = 100, model = 'gemini-1.5-flash') {
        // Validate API key
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }

        // Initialize Google Generative AI client
        this.genAI = new GoogleGenerativeAI(apiKey);
        
        // Configuration settings
        this.modelName = model;
        this.maxTokens = maxTokens;
        
        // Manage chat history
        this.chatHistory = [];
        this.chat = null;
    }

    /**
     * Prepare the chat model with initial configuration
     * @param {Array} initialHistory - Optional initial chat history
     */
    async initializeChat(initialHistory = []) {
        try {
            const model = this.genAI.getGenerativeModel({ 
                model: this.modelName 
            });

            this.chat = model.startChat({
                history: initialHistory,
                generationConfig: {
                    maxOutputTokens: this.maxTokens,
                }
            });
        } catch (error) {
            console.error('Error initializing chat:', error);
            throw error;
        }
    }

    /**
     * Generate a response from Gemini API
     * @param {string} request - User's message
     * @param {string} contactName - Name of the contact
     * @returns {Promise<string>} Generated response
     */
    async getResponse(request, contactName) {
        // Validate inputs
        if (!request || !contactName) {
            throw new Error('Request and contact name are required');
        }

        // Initialize chat if not already initialized
        if (!this.chat) {
            await this.initializeChat();
        }

        // Construct comprehensive prompt
        const prompt = `Me llamo: ${contactName}\n${context}\nPregunta: ${request}`;
        
        // Prepare message for chat history
        const message = { 
            role: "user", 
            parts: [{ text: request }] 
        };

        try {
            // Update chat history
            this.chatHistory.push(message);

            // Send message and get response
            const result = await this.chat.sendMessage(prompt);
            const response = await result.response;
            const generatedText = response.text();

            // Store model's response in chat history
            const modelResponse = { 
                role: "model", 
                parts: [{ text: generatedText }] 
            };
            this.chatHistory.push(modelResponse);

            // Optional: Log for debugging
            console.log("Response:", generatedText);
            console.log("Current History Length:", this.chatHistory.length);

            return generatedText;
        } catch (error) {
            console.error("Gemini API Error:", error);
            
            // Enhanced error handling
            if (error.response) {
                console.error("Detailed Response Error:", error.response.data);
            }

            throw error;
        }
    }

    /**
     * Reset chat history
     */
    resetChatHistory() {
        this.chatHistory = [];
        this.chat = null;
    }

    /**
     * Get current chat history
     * @returns {Array} Current chat history
     */
    getChatHistory() {
        return this.chatHistory;
    }
}

// Export as a class for more flexible usage
module.exports = GeminiChatService;