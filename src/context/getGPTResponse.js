async function getGPTResponse(prompt) {
    const url = 'https://magicloops.dev/api/loop/2f01a444-afa3-4b1d-9e05-3d2dde3d99cc/run';
    const payload = { "query": prompt };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
            
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Error al obtener la respuesta de OPENAI:', error);
        throw new Error('Error al obtener la respuesta de OPENAI');
    }
}

module.exports = getGPTResponse;