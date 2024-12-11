const { spawn } = require('child_process');
const path = require('path');

async function getMetaAIResponse(prompt) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '..','ai', 'meta_ai_script.py');
        const pythonProcess = spawn('python3', [scriptPath, prompt], {
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

module.exports = getMetaAIResponse;