const location = require('./variables').location;

const predefinedResponses = {
    
    // saludos 
    'hola': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'hola como estas': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buen dia': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buenas tardes': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buenas noches': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buenos dias': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buenos tardes': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buenos noches': 'Hola, soy el asistente virtual de Geronimo Serial (https://geroserial.com). Escribe *menu* para ver mis opciones.',
    'buenas': '¡Buenas! soy el asistente virtual del Consejo General de Educacion. Escribe *menu* para ver mis opciones.',
    'ubicacion': location,


//     // Menú principal
//     'menu': `Bienvenido al asistente virtual del Consejo General de Educación. 
// Por favor, elige una opción:
//     *1* - Inscripciones escolares
//     *2* - Trámites de títulos
//     *3* - Concursos docentes
//     *4* - Padrón de títulos
//     *5* - Traslados definitivos
//     *6* - Toma de posesión
//     *7* - Ver más opciones
//     `,

//     // Respuestas a opciones del menú principal
//     '1': 'Las inscripciones escolares en Corrientes siguen el siguiente proceso: [Breve descripción]. ¿Necesitas más detalles?',
//     '2': 'Para realizar trámites de títulos, debes seguir estos pasos: [Breve descripción]. ¿Te gustaría saber más?',
//     '3': 'Los concursos docentes se realizan de acuerdo con el siguiente procedimiento: [Breve descripción]. ¿Tienes alguna otra consulta?',
//     '4': 'El padrón de títulos y antecedentes debe ser exhibido en un plazo de 24 horas por 10 días hábiles. Si tienes dudas sobre cómo presentar un reclamo, puedo ayudarte.',
//     '5': 'Las inscripciones para traslados definitivos se realizan del 1º al 31 de agosto, y los concursos se llevan a cabo en diciembre. ¿Necesitas más información?',
//     '6': 'Para la toma de posesión, necesitarás el Formulario de Designación o la Toma de Posesión y la Declaración Jurada de Cargos. ¿Te gustaría saber más?',
    
//     // Menú secundario
//     '7': `Más opciones:
//     *8* - Líneas de acc*ión educativa
//     *9* - Programas educativos específicos
//     *10* - Preguntas frecuentes
//     *11* - Información de contacto
//     *0* - Volver al menú principal
//     `,

//     // Respuestas a opciones del menú secundario
//     '8': 'Las líneas de acción educativa incluyen la promoción de una cultura inclusiva, evaluación para el mejoramiento, y más. ¿Te gustaría saber más sobre alguna en particular?',
//     '9': 'Los programas educativos específicos abarcan varias áreas. ¿Te interesa información sobre un programa en particular?',
//     '10': 'Algunas preguntas frecuentes incluyen: [Lista breve]. ¿Te gustaría una respuesta a alguna en particular?',
//     '11': 'Puedes contactar al CGE en Catamarca 640, Corrientes, Argentina ¿Necesitas más información de contacto?' + location,
//     '0': 'Volviendo al menú principal. Por favor, elige una opción: 1 - Inscripciones escolares, 2 - Trámites de títulos, 3 - Concursos docentes, etc.',
    
//     // Respuesta predeterminada
//     'default': 'Lo siento, no entiendo esa opción. Por favor, elige una de las opciones disponibles en el menú enviando el número correspondiente.'
}
    module.exports = predefinedResponses;

