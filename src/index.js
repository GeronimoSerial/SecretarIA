const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');

// Cargar configuración y dependencias
dotenv.config();

// Importar módulos personalizados
const predefinedResponses = require('./data/predefinedResponses');
const { admins } = require('./data/variables');
const adminCommands = require('./data/adminCommands');
const getGPTResponse = require('./ai/getGPTResponse');
const GeminiChatService = require('./ai/getGeminiResponse');

class WhatsAppBot {

    constructor() {
        // Inicializar configuraciones
        this.Api = process.env.GEMINI_API_KEY;
        this.AuthAdmin = {};

        // Validar clave API
        if (!this.Api) {
            throw new Error('Gemini API key is missing. Please check your .env file.');
        }

        // Inicializar el servicio de chat Gemini
        this.geminiService = new GeminiChatService(this.Api);

        // Configurar cliente de WhatsApp
        this.client = new Client({
            authStrategy: new LocalAuth(),
            // Agregar configuraciones adicionales si es necesario
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        // Configurar listeners de eventos
        this.setupEventListeners();

        //limitar mensajes
        this.messageCounts = {};
        this.messageLimit = 8;
        this.timeFrame = 60000; // 1 minuto
    }

    /**
     * Verifica si el usuario ha excedido el límite de mensajes dentro del marco de tiempo dado
     * @param {string} sender - El ID del remitente
     * @returns {boolean} - Verdadero si se ha excedido el límite de mensajes, falso de lo contrario
     */
    messageLimitExceeded(sender) {
        const currentTime = Date.now();
        const userId = sender;

        if (!this.messageCounts[userId]) {
            this.messageCounts[userId] = { count: 1, firstMessageTime: currentTime };
        }

        const userMessageData = this.messageCounts[userId];

        if (currentTime - userMessageData.firstMessageTime >= this.timeFrame){
            userMessageData.count = 1;
            userMessageData.firstMessageTime = currentTime;
        }
        else{
            userMessageData.count++;
        }
        

        if (userMessageData.count > this.messageLimit) {
            return true;
        }
        return false;
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
 
        // Ignorar mensajes que no son de texto
        if (message.type !== 'chat') {
            console.log(`No es un mensaje de texto. Tipo recibido: ${message.type}`);
            await message.reply('Lo siento. Solo puedo procesar mensajes de texto por el momento.');
            return;
        }
  
        const userId = message.from;
        const contact = await message.getContact();
        const contactName = contact.pushname || contact.name || 'Desconocido';
        const userQuery = message.body.toLowerCase();
        const sender = message.from;

        if(this.messageLimitExceeded(sender)) {
            await message.reply('Has alcanzado el límite de mensajes. Por favor, espera unos minutos antes de enviar otro mensaje.');
            return;
        }

        // Verificar autenticación de administrador
        const isAdmin = this.handleAdminAuthentication(message);
        
        // Manejar comandos de administrador si está autenticado
        if (isAdmin) {
            const adminCommandExecuted = await this.handleAdminCommands(message);
            if (adminCommandExecuted) return;
        }

        // Verificar respuestas predefinidas
        const predefinedResponse = this.getPredefinedResponse(userQuery);
        if (predefinedResponse) {
            await message.reply(predefinedResponse);
            this.logConversation(sender, userQuery, predefinedResponse);
            return;
        }

        // Registro inicial de conversación
        this.logConversation(sender, userQuery, '');

        try {
            // Seleccionar respuesta de IA basada en el estado de administrador
            const aiResponse = isAdmin 
                ? await getGPTResponse(userQuery, contactName)
                : await this.geminiService.getResponse(userQuery, contactName);

            // Responder al mensaje
            await message.reply(aiResponse);

            // Registrar la conversación completa
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
