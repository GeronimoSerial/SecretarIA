const { Client, LocalAuth } = require('whatsapp-web.js');
const { spawn } = require('child_process');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth()
});

function logConversation(sender, question, answer) {
    const logEntry = `[Sender: ${sender}]: Question: ${question}\n Respuesta: ${answer}\n\n`;
    fs.appendFile('conversation.log', logEntry, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro: ', err);
        } else {
            console.log('Se ha escrito en el archivo de registro');
        }
    })
}

async function getMetaAIResponse(prompt) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['meta_ai_script.py', prompt], {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });

        let result = '';

        pythonProcess.stdout.setEncoding('utf-8');
        pythonProcess.stdout.on('data', (data) => {
            result += data;
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            reject('Error al comunicarse con la API de Meta AI');
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(result.trim());
            } else {
                reject('Error en el proceso Python');
            }
        });
    });
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
    if (!message.fromMe) {
        const userQuery = message.body;
        const sender= message.from;

        try {
            const aiResponse = await getMetaAIResponse(userQuery);
            await message.reply(aiResponse);

            // registrar la conversacion
            logConversation(sender, userQuery, aiResponse);
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            await message.reply('Lo siento, hubo un error al procesar tu mensaje.');
        }
    }
});

client.initialize();