# -*- coding: utf-8 -*-

import sys
import os
from meta_ai_api import MetaAI
from context import CONTEXT

# Agrega el directorio raíz del proyecto al PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def get_meta_ai_response(prompt):
    ai = MetaAI()
    full_prompt = f"{CONTEXT}\n\nConsulta del usuario: {prompt}\n\nRespuesta:"
    
    try:
        response = ai.prompt(message=full_prompt)
        # Extraer el campo 'message' de la respuesta
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


# 
# # -*- coding: utf-8 -*-

# import sys
# import json
# from meta_ai_api import MetaAI

# # Cargar los módulos de contexto desde un archivo JSON
# def cargar_contextos_modulares():
#     with open("contextos_modulares.json", "r", encoding="utf-8") as file:
#         return json.load(file)

# contextos_modulares = cargar_contextos_modulares()

# def construir_contexto_relevante(modulos_requeridos):
#     contexto = ""
#     for modulo in modulos_requeridos:
#         contexto += contextos_modulares.get(modulo, "")
#     return contexto

# def get_meta_ai_response(prompt, modulos_requeridos):
#     ai = MetaAI()
    
#     contexto_relevante = construir_contexto_relevante(modulos_requeridos)
#     full_prompt = f"{contexto_relevante}\n\nConsulta del usuario: {prompt}\n\nRespuesta:"
    
#     response = ai.prompt(message=full_prompt)
#     message_content = response.get('message', 'Lo siento, no pude obtener una respuesta en este momento.')
#     return message_content

# def mapear_consulta_a_modulos(consulta):
#     consulta = consulta.lower()
#     if "información general" in consulta:
#         return ["informacion_general"]
#     elif "datos clave" in consulta:
#         return ["datos_clave"]
#     elif "áreas de acción" in consulta:
#         return ["areas_accion"]
#     elif "ubicación" in consulta:
#         return ["ubicacion"]
#     else:
#         return ["informacion_general"]  # Por defecto, incluir información general

# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Error: Se requiere una consulta del usuario.")
#         sys.exit(1)

#     user_prompt = sys.argv[1]
#     modulos_requeridos = mapear_consulta_a_modulos(user_prompt)
#     response = get_meta_ai_response(user_prompt, modulos_requeridos)
#     print(response)

#     print(response)  # Python ya maneja UTF-8 de forma predeterminada al imprimir