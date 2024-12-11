const { config } = require('dotenv');
config();
const Api = process.env.GEMINI_API_KEY;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {context} = require('../context/context');
const genAI = new GoogleGenerativeAI(Api);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function getGeminiResponse(request) {
    const prompt = `${context} \nPregunta: ${request}`;
    console.log(prompt)

    const response = await model.generateContent(prompt); // Obtener la respuesta

    // Acceder al texto generado
    const generatedText = response.response.candidates[0].content.parts[0].text; // Ajusta según la estructura real
    console.log('Texto generado:', generatedText); // Imprimir el texto generado

    return generatedText; // Devolver el texto generado
}

module.exports = getGeminiResponse;
