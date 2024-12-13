const { config } = require('dotenv');
config();
const Api = process.env.GEMINI_API_KEY;

const { GoogleGenerativeAI } = require('@google/generative-ai');
const {context} = require('../context/context');
const genAI = new GoogleGenerativeAI(Api);

let chatHistory = [];

async function getGeminiResponse(request, contactName) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `Me llamo: ${contactName}\n ${context} `}],
            },
            {
                role: "model",
                parts: [{ text: "Gusto en conocerte."}],
            },
        ],
        generationConfig: {
            maxOutputTokens: 100,
        },
    });
        const prompt = `Pregunta: ${request}`;
        console.log(prompt);
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Response:", text);
        chatHistory.push({role: "user", parts: [{ text: prompt }]});
        chatHistory.push({role: "model", parts: [{ text: text }]});
        return text;
    }


module.exports = getGeminiResponse;

// const { config } = require('dotenv');
// config();
// const Api = process.env.GEMINI_API_KEY;
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const {context} = require('../context/context');
// const genAI = new GoogleGenerativeAI(Api);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// async function getGeminiResponse(request) {
//     const prompt = `${context} \nPregunta: ${request}`;
//     console.log(prompt)

//     const response = await model.generateContent(prompt); // Obtener la respuesta

//     // Acceder al texto generado
//     const generatedText = response.response.candidates[0].content.parts[0].text; // Ajusta según la estructura real
//     console.log('Texto generado:', generatedText); // Imprimir el texto generado

//     return generatedText; // Devolver el texto generado
// }

// module.exports = getGeminiResponse;

