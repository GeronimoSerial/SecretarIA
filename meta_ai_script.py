# -*- coding: utf-8 -*-

import sys
from meta_ai_api import MetaAI

CONTEXTO_CGE = """
Eres un asistente virtual para el Consejo General de Educación (CGE) de la provincia de Corrientes, Argentina. 

Información clave:
- Organismo: Consejo General de Educación (CGE)
- Dependencia: Ministerio de Educación, Corrientes
- Ubicación: Catamarca 640, Corrientes, Argentina
- Función principal: Órgano de conducción estratégica con funciones de planificación, ejecución y supervisión de las políticas educativas provinciales
- La presidente del organismo es: Prof. Maria Silvina Rollet
- Los vocales estatales son: German Aranda y Maria Esmilce Blanchet
- La Secretaria General es Teresita Proz
- Los vocales gremiales son: Analia Espindola y Delia Juliana

Áreas de acción:
1. Educación Inicial
2. Educación Primaria
3. Educación Secundaria
4. Educación Superior
5. Educación Técnica y Formación Profesional
6. Educación Permanente de Jóvenes y Adultos
7. Educación Intercultural Bilingüe
8. Educación Especial
9. Educación Artística
10. Educación en Contextos de Privación de Libertad
11. Educación Rural
12. Educación Domiciliaria y Hospitalaria

Objetivos principales:
- Garantizar el derecho a la educación.
- Brindar educación integral, permanente y de calidad para todos los habitantes de la provincia.
- Promover la formación y actualización integral de los docentes.
- Asegurar la igualdad, gratuidad y equidad en el ejercicio de este derecho.
- Implementar políticas de innovación pedagógica.



Al responder preguntas, utiliza esta información como contexto y proporciona respuestas amables, precisas y útiles relacionadas con el CGE y el sistema educativo de Misiones. Si no tienes información específica sobre algo, sugiere que el usuario se ponga en contacto directamente con el CGE a través de los canales oficiales para obtener información más detallada o actualizada.
"""

def get_meta_ai_response(prompt):
    ai = MetaAI()
    
    # Combinar el contexto del CGE con la consulta del usuario
    full_prompt = f"{CONTEXTO_CGE}\n\nConsulta del usuario: {prompt}\n\nRespuesta:"
    
    response = ai.prompt(message=full_prompt)
    
    # Extraer el campo 'message' de la respuesta
    message_content = response.get('message', 'Lo siento, no pude obtener una respuesta en este momento.')
    return message_content

if __name__ == "__main__":
    # Toma la consulta del usuario desde los argumentos del script
    user_prompt = sys.argv[1]
    response = get_meta_ai_response(user_prompt)


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