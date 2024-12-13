const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { context } = require('../context/context');

// Cargar variables de entorno
dotenv.config();

class GeminiChatService {
    constructor(apiKey, maxTokens = 100, model = 'gemini-1.5-flash') {
        // Validar clave API
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }

        // Inicializar cliente de Google Generative AI
        this.genAI = new GoogleGenerativeAI(apiKey);
        
        // Configuraciones
        this.modelName = model;
        this.maxTokens = maxTokens;
        
        // Manejo del historial de chat
        this.chatHistory = [];
        this.chat = null;
    }

    /**
     * Preparar el modelo de chat con configuración inicial
     * @param {Array} initialHistory - Historial de chat inicial opcional
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
     * Generar una respuesta desde la API de Gemini
     * @param {string} request - Mensaje del usuario
     * @param {string} contactName - Nombre del contacto
     * @returns {Promise<string>} Respuesta generada
     */
    async getResponse(request, contactName) {
        // Validar entradas
        if (!request || !contactName) {
            throw new Error('Request and contact name are required');
        }

        // Inicializar chat si no está ya inicializado
        if (!this.chat) {
            await this.initializeChat();
        }

        // Construir un mensaje comprensivo
        const prompt = `Me llamo: ${contactName}\n${context}\nPregunta: ${request}`;
        
        // Preparar mensaje para el historial de chat
        const message = { 
            role: "user", 
            parts: [{ text: request }] 
        };

        try {
            // Actualizar historial de chat
            this.chatHistory.push(message);

            // Enviar mensaje y obtener respuesta
            const result = await this.chat.sendMessage(prompt);
            const response = await result.response;
            const generatedText = response.text();

            // Almacenar la respuesta del modelo en el historial de chat
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
            
            // Manejo de errores 
            if (error.response) {
                console.error("Detailed Response Error:", error.response.data);
            }

            throw error;
        }
    }

    /**
     * Resetear historial de chat
     */
    resetChatHistory() {
        this.chatHistory = [];
        this.chat = null;
    }

    /**
     * Obtener el historial de chat actual
     * @returns {Array} Historial de chat actual
     */
    getChatHistory() {
        return this.chatHistory;
    }
}

// Export as a class for more flexible usage
module.exports = GeminiChatService;
