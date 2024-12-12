const { config } = require('dotenv');
config();
const Api = process.env.GEMINI_API_KEY;
<<<<<<< Updated upstream
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

=======

const { GoogleGenerativeAI } = require('@google/generative-ai');
const {context} = require('../context/context');
const genAI = new GoogleGenerativeAI(Api);


let chatHistory = [];
let chat = null;

async function run(request) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `${context} \nPregunta: ${request}`;
    console.log(prompt)

    if (!chat) {
        chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 100,
            }
        });
    }
    const message = {role: "user", parts: [ { text: request}]};
    chatHistory.push(message);

    try {
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const generatedText = response.text();
        const modelResponse = { role: "model", parts: [ { text: generatedText}]};
        chatHistory.push(modelResponse);
        console.log("Response:", generatedText);
        console.log("History:", chatHistory);
        return generatedText;
    } catch (error) {
        console.error("Error in Gemini Api Call:", error);
        if(error.response){
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

module.exports = run;

// async function getGeminiResponse(request) {
//     const prompt = `${context} \nPregunta: ${request}`;
//     console.log(prompt)


//     // Acceder al texto generado
//     const generatedText = response.response.candidates[0].content.parts[0].text; // Ajusta según la estructura real
//     console.log('Texto generado:', generatedText); // Imprimir el texto generado

//     return generatedText; // Devolver el texto generado
// }

// module.exports = getGeminiResponse;
>>>>>>> Stashed changes
