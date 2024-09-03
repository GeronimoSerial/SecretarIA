# -*- coding: utf-8 -*-

import sys
import os
from meta_ai_api import MetaAI
from context import CONTEXT

# Agrega el directorio raíz del proyecto 
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def get_meta_ai_response(prompt):
    ai = MetaAI()
    full_prompt = f"{CONTEXT}\n\nConsulta del usuario: {prompt}\n\nRespuesta:"
    
        # Extraer el campo 'message' de la respuesta
    try:
        response = ai.prompt(message=full_prompt)
        message_content = response.get('message', 'Lo siento, no pude obtener una respuesta en este momento.')
    except Exception as e:
        message_content = f"Error al obtener la respuesta: {str(e)}"
    
    return message_content

if __name__ == "__main__":
    # Validar que haya al menos un argumento
    if len(sys.argv) < 2:
        print("Error: Debes proporcionar una consulta como argumento.")
        sys.exit(1)
    
    # Toma la consulta del usuario desde los argumentos del script
    user_prompt = sys.argv[1]
    response = get_meta_ai_response(user_prompt)
    print(response)

