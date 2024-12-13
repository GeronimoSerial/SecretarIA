# Proyecto: WhatsApp Bot con Integración de Inteligencias Artificiales

Este proyecto consiste en una instancia de **WhatsApp Web JS** que integra dos inteligencias artificiales:
- **GPT** (con Magic Loops)
- **Gemini** (a través de una API configurada en un archivo `.env`)

Ambas IA comparten características como el manejo de contexto para la comunicación y el mantenimiento de un historial de conversación.

## Características Principales

### 1. Integración con GPT (Magic Loops)
- Solo disponible para quien posea permisos de administrador
- Permite salir del contexto, util para un uso habitual de la IA
- Procesamiento avanzado de lenguaje natural.
- Utiliza esta metodología como puente para conectar y gestionar las interacciones con GPT.

### 2. Integración con Gemini (API)
- Configurada mediante un archivo `getGeminiResponse.js` y `.env` (API) 
- Implementa la Gemini API de Google para habilitar análisis, generación y respuesta inteligente directamente en WhatsApp Web JS.

### 3. Contexto.
- Ambas IA trabajan con un contexto continuo, permitiendo respuestas más coherentes y relevantes en la conversación.

### 4. Historial de Conversación
- Se mantiene un registro de mensajes intercambiados para proporcionar una experiencia más personalizada y fluida.

## Requisitos del Proyecto

- **Node.js** (versión 20 o superior).
- **WhatsApp-web.js** para la integración con WhatsApp.
- Dependencias para ambas IA:
  - GPT (Magic Loops): [Instalar documentación](https://magicloops.example)
  - Gemini: Configuración API en `.env`.
- **dotenv** para gestionar variables de entorno.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/GeronimoSerial/SecretarIA.git
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Configura el archivo `.env`:
   ```env
   GEMINI_API_KEY=tu_clave_de_gemini
   ```
4.
   . Configura el archivo `.context.js`


5. Ejecuta el proyecto:
   ```bash
   npm start
   ```

## Uso

1. Escanea el código QR generado en la terminal para vincular WhatsApp Web.
2. Interactúa con el bot a través de mensajes en WhatsApp.
3. Las IA procesarán el mensaje y responderán utilizando el contexto y el historial de conversación.

## Estructura del Proyecto

```plaintext
📦tu_repositorio
 ┣ 📂src
 ┃ ┣ 📂ai
 ┃ ┣  ┣📜getGPTResponse.js      # Configuración principal del bot
 ┃ ┣  ┣📜getGeminiResponse.js
 ┃ ┣ 📂context   
 ┃ ┣  ┣📜contextTemplate.js       # Lógica para integrar GPT
 ┃ ┣ 📂data   
 ┃ ┣  ┣ 📜adminCommands.js
 ┃ ┣  ┣ 📜predefinedResponses.js
 ┃ ┣  ┣ 📜variables.js     
 ┃ ┗ 📂logs       
 ┣ 📜.env.example     # Ejemplo de configuración de entorno
 ┣ 📜package.json     # Dependencias del proyecto
 ┗ 📜README.md        # Este archivo
```

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor abre un issue o envía un pull request.


### Notas Adicionales
- Asegúrate de no compartir tu archivo `.env` ni claves sensibles.
- Para escalar el proyecto, considero opciones de almacenamiento para el historial de conversación, como una base de datos.

---

¡Gracias por usar este bot! 🚀
