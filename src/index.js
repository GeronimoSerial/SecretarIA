const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');

// Load configuration and dependencies
dotenv.config();

// Import custom modules
const predefinedResponses = require('./data/predefinedResponses');
const { admins } = require('./data/variables');
const adminCommands = require('./data/adminCommands');
const getGPTResponse = require('./ai/getGPTResponse');
const GeminiChatService = require('./ai/getGeminiResponse');

class WhatsAppBot {
    // Inicializar configuraciones
    constructor() {
        // Initialize configurations
        this.Api = process.env.GEMINI_API_KEY;
        this.AuthAdmin = {};

        // Validate API key
        if (!this.Api) {
            throw new Error('Gemini API key is missing. Please check your .env file.');
        }

        // Initialize Gemini Chat Service
        this.geminiService = new GeminiChatService(this.Api);

        // Configure WhatsApp Client
        this.client = new Client({
            authStrategy: new LocalAuth(),
            // Add additional configurations if needed
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        // Setup event listeners
        this.setupEventListeners();
    }

    /**
     * Configurar los listeners de eventos para el cliente de WhatsApp
     */
    setupEventListeners() {
        this.client.on('qr', this.handleQRCode);
        this.client.on('ready', this.handleClientReady);
        this.client.on('message', this.handleIncomingMessage.bind(this));
    }

    /**
     * Manejar la generación del código QR para la autenticación
     * @param {string} qr - Cadena del código QR
     */
    handleQRCode(qr) {
        qrcode.generate(qr, { small: true });
        console.log('Escanea este código QR con tu teléfono.');
    }

    /**
     * Registrar cuando el cliente está listo
     */
    handleClientReady() {
        console.log('El bot está listo y conectado.');
    }

    /**
     * Registrar conversaciones en un archivo
     * @param {string} sender - Identificador del remitente 
     * @param {string} question - Mensaje del usuario
     * @param {string} answer - Respuesta del bot
     */
    logConversation(sender, question, answer) {
        const logFilePath = path.join(__dirname, 'logs', 'conversation.log');
        const logEntry = `[Sender: ${sender}]: Question: ${question}\n Respuesta: ${answer}\n\n`;

        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de registro: ', err);
            } else {
                console.log('Se ha escrito en el archivo de registro');
            }
        });
    }

    /**
     * Manejar la autenticación de administradores
     * @param {Object} message - Objeto de mensaje de WhatsApp
     * @returns {boolean} - Resultado de la autenticación
     */
    handleAdminAuthentication(message) {
        const userId = message.from;

        if (message.body === '!login' && admins.includes(userId)) {
            this.AuthAdmin[userId] = true;
            message.reply('Autenticado como administrador. Tienes permisos especiales.');
            return true;
        }
        
        if (message.body === '!logout') {
            this.AuthAdmin[userId] = false;
            message.reply('Sesión cerrada. No tienes permisos especiales.');
            return false;
        }

        return this.AuthAdmin[userId] || false;
    }

    /**
     * Manejar comandos de administrador entrantes
     * @param {Object} message - Objeto de mensaje de WhatsApp
     * @returns {Promise<boolean>} - Resultado de la ejecución del comando
     */
    async handleAdminCommands(message) {
        const command = message.body.split(' ')[0].toLowerCase();
        if (adminCommands.hasOwnProperty(command)) {
            await adminCommands[command](message);
            return true;
        }
        return false;
    }

    /**
     * Manejar respuestas predefinidas
     * @param {string} userQuery - Mensaje del usuario
     * @returns {string|null} - Respuesta predefinida o null
     */
    getPredefinedResponse(userQuery) {
        return predefinedResponses[userQuery] || null;
    }

    /**
     * Método principal para manejar mensajes
     * @param {Object} message - Objeto de mensaje de WhatsApp
     */
    async handleIncomingMessage(message) {
        // Ignorar mensajes enviados por el bot mismo
        if (message.fromMe) return;

        const userId = message.from;
        const contact = await message.getContact();
        const contactName = contact.pushname || contact.name || 'Desconocido';
        const userQuery = message.body.toLowerCase();
        const sender = message.from;

        // Check admin authentication
        const isAdmin = this.handleAdminAuthentication(message);
        
        // Handle admin commands if authenticated
        if (isAdmin) {
            const adminCommandExecuted = await this.handleAdminCommands(message);
            if (adminCommandExecuted) return;
        }

        // Check for predefined responses
        const predefinedResponse = this.getPredefinedResponse(userQuery);
        if (predefinedResponse) {
            await message.reply(predefinedResponse);
            this.logConversation(sender, userQuery, predefinedResponse);
            return;
        }

        // Initial conversation log
        this.logConversation(sender, userQuery, '');

        try {
            // Select AI response based on admin status
            const aiResponse = isAdmin 
                ? await getGPTResponse(userQuery, contactName)
                : await this.geminiService.getResponse(userQuery, contactName);

            // Reply to the message
            await message.reply(aiResponse);

            // Log the complete conversation
            this.logConversation(sender, userQuery, aiResponse);
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            await message.reply('Lo siento, hubo un error al procesar tu mensaje.');
        }
    }

    /**
     * Iniciar el bot de WhatsApp
     */
    start() {
        try {
            this.client.initialize();
        } catch (error) {
            console.error('Error initializing WhatsApp client:', error);
        }
    }
}

// Instanciar y comenzar el bot
const whatsAppBot = new WhatsAppBot();
whatsAppBot.start();