## WhatsApp Bot Project

This project is a WhatsApp bot built with `whatsapp-web.js` and Node.js. The bot allows for message management, Python script execution, and AI integration for automated responses. Docker is used to facilitate consistent deployment across different platforms, such as Google Cloud Run.

### Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Deployment with Docker](#deployment-with-docker)
6. [Contributions](#contributions)

### Requirements

- Node.js >= 14.17.0
- Python 3.x (for Python scripts)
- Docker (optional, for deployment)
- `whatsapp-web.js`
- `child_process` (for running Python scripts)
- WhatsApp account to scan the QR code

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/geronimoserial/whatsapp-bot.git
   cd whatsapp-bot

2. **Install Node.js dependencies:**

   ```bash
   npm install
   
3. **Install necessary Python dependencies (if any):

   ```bash
   pip install -r requeriments.txt

### Configuration
1. **Scan the WhatsApp QR Code:**

   Run the bot for the first time to scan the QR code and connect your WhatsApp account:

   ```bash
   pip install -r requeriments.txt

### Usage

- **Admin Commands**: Use the commands defined in the respective files to manage the bot.
- **Predefined Responses**: Set up automated responses in the predefined response files.
- **AI Integration**: The AI context, defined in *context.py*, can be utilized to provide intelligent responses to user queries.

### Deployment with Docker
 To facilitate deployment and execution of the bot across different environments, a Dockerfile is included:

 Build the Docker image:
 
    ```bash
    docker build -t wppbot-cge .

 Run the Docker container:

    ```bash
    docker run -d wppbot-cge




