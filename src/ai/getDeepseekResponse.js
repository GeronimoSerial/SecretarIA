const dotenv = require('dotenv');
const { Configuration, OpenAIApi, OpenAI } = require('openai');
const { context } = require('../context/context');

// Cargar variables de entorno
dotenv.config();

class OpenAIChatService {
  /**
   * Crea una instancia del servicio de chat con OpenAI.
   * @param {string} apiKey - Clave API de OpenAI.
   * @param {number} maxTokens - Número máximo de tokens en la respuesta.
   * @param {string} model - Modelo a utilizar (por ejemplo, 'gpt-3.5-turbo').
   */


  constructor(apiKey, baseURL, model = 'deepseek-chat', maxTokens = 100) {
  
      if (!apiKey) {
        throw new Error("La clave API de Deepseek es requerida");
      }
      this.apiKey = apiKey;
      this.maxTokens = maxTokens;
      this.baseURL = baseURL || "https://api.deepseek.com/v1";
      

      this.openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL || "https://api.deepseek.com/v1",
      });

      this.model = model;
      this.chatHistory = [];
    }
  /**
   * Inicializa el historial de chat con un contexto inicial opcional.
   * @param {Array} initialHistory - Historial de chat inicial.
   */
  async initializeChat(initialHistory = []) {
    this.chatHistory = initialHistory;
    // Agregar mensaje de contexto si está definido
    if (context) {
      this.chatHistory.unshift({
        role: "system",
        content: context,
      });
      
    }
  }

  /**
   * Envía un mensaje a la API de OpenAI y retorna la respuesta generada.
   * @param {string} request - Mensaje del usuario.
   * @param {string} contactName - Nombre del contacto.
   * @returns {Promise<string>} Respuesta generada por el modelo.
   */
  async getResponse(request, contactName) {
    if (!request || !contactName) {
      throw new Error('El mensaje y el nombre del contacto son requeridos');
    }

    // Inicializar el chat si aún no se ha configurado el historial
    if (this.chatHistory.length === 0) {
      await this.initializeChat();
    }

    // Combinar el nombre del contacto y la pregunta
    const userMessageContent = `Me llamo: ${contactName}\nPregunta: ${request}`;

    // Agregar el mensaje del usuario al historial
    this.chatHistory.push({
      role: "user",
      content: userMessageContent,
    });

    try {
      // Enviar el historial completo a OpenAI y obtener la respuesta
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: this.chatHistory,
        max_tokens: this.maxTokens,
      });

      const generatedText = response.data.choices[0].message.content;

      // Agregar la respuesta del asistente al historial
      this.chatHistory.push({
        role: "assistant",
        content: generatedText,
      });

      console.log("Response:", generatedText);
      console.log("Historial de chat:", this.chatHistory.length);

      return generatedText;
    } catch (error) {
      console.error("Error en la API de Deepseek:", error);
      if (error.response) {
        console.error("Detalle del error:", error.response.data);
      }
      throw error;
    }
  }

  /**
   * Resetea el historial de chat.
   */
  resetChatHistory() {
    this.chatHistory = [];
  }

  /**
   * Obtiene el historial de chat actual.
   * @returns {Array} Historial de chat.
   */
  getChatHistory() {
    return this.chatHistory;
  }
}

module.exports = OpenAIChatService;
