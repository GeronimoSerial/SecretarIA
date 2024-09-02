import sys
from meta_ai_api import MetaAI

def get_meta_ai_response(prompt):
    ai = MetaAI()
    response = ai.prompt(message=prompt)
    
    # Extraer el campo 'message' de la respuesta
    message_content = response.get('message', 'No se pudo obtener una respuesta.')
    return message_content

if __name__ == "__main__":
    # Toma la consulta del usuario desde los argumentos del script
    user_prompt = sys.argv[1]
    response = get_meta_ai_response(user_prompt)
    print(response)  # Python ya maneja UTF-8 de forma predeterminada al imprimir
