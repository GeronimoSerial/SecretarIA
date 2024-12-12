const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const predefinedResponses = require('./data/predefinedResponses');
const {admins} = require('./data/variables');
const path = require('path');
const adminCommands = require('./data/adminCommands');
const getGPTResponse = require('./ai/getGPTResponse');
// const getGeminiResponse = require('./ai/getGeminiResponseBETA');
const getGeminiResponse = require('./ai/getGeminiResponse')

const client = new Client({
    authStrategy: new LocalAuth()
});

const AuthAdmin = {};


function logConversation(sender, question, answer) {

    const logFilePath = path.join(__dirname, 'logs', 'conversation.log');
    const logEntry = `[Sender: ${sender}]: Question: ${question}\n Respuesta: ${answer}\n\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro: ', err);
        } else {
            console.log('Se ha escrito en el archivo de registro');
        }
    })
}

client.on('qr', (qr) => {
    const qrcode = require('qrcode-terminal');
    qrcode.generate(qr, { small: true });
    console.log('Escanea este código QR con tu teléfono.');
});

client.on('ready', () => {
    console.log('El bot está listo y conectado.');
});

client.on('message', async message => {
    const userId = message.from; // definir correctamente el ID del usuario
    const contact = await message.getContact();
    const contactName = contact.pushname || contact.name || 'Desconocido';
    
    console.log(`Mensaje recibido de ${contactName}`);
    

    // Verificar si el mensaje es de un administrador
    if (message.body === '!login' && admins.includes(userId)) {
        AuthAdmin[userId] = true;
        return message.reply('Autenticado como administrador. Tienes permisos especiales.');
    }
    else if (message.body === '!logout') {
        AuthAdmin[userId] = false;
        return message.reply('Sesión cerrada. No tienes permisos especiales.');
    }
    
    // Verificar si el administrador está autenticado
    if (AuthAdmin[userId]) {
        const command = message.body.split(' ')[0].toLowerCase();
        if (adminCommands.hasOwnProperty(command)) {
            await adminCommands[command](message);
            return;
        }
    }     
    
    // Manejo de mensajes de usuarios no autorizados
    if (!message.fromMe) {
            const userQuery = message.body.toLowerCase();
            const sender = message.from;
            
            if (predefinedResponses[userQuery]) {
                await message.reply(predefinedResponses[userQuery]);
                return;
            }
            
            // Registrar la conversación
            logConversation(sender, userQuery, '');
            // await message.reply('Procesando tu solicitud... Por favor, espera un momento.');
            
            try {
                let aiResponse;
                if(AuthAdmin[userId]) {
                    aiResponse = await getGPTResponse(userQuery, contactName);
                }else {
                    aiResponse = await getGeminiResponse(userQuery, contactName);
                }
                await message.reply(aiResponse);
                
                // Registrar la conversación
                logConversation(sender, userQuery, aiResponse);
            } catch (error) {
                console.error('Error al procesar el mensaje:', error);
                await message.reply('Lo siento, hubo un error al procesar tu mensaje.');
            }
        }
    }
);



client.initialize();