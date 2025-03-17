// Función para construir el prompt a partir de los datos del formulario
function generatePrompt() {
    const format = document.getElementById('format').value;
    const description = document.getElementById('description').value;
    const toneSelect = document.getElementById('tone').value;
    const customTone = document.getElementById('customTone').value;
    const wordCount = document.getElementById('wordCount').value;
    
    const tone = toneSelect === "Otro" && customTone ? customTone : toneSelect;
    
    // Ajuste del límite de tokens según la opción de palabras:
    // 500 palabras: promedio de 700-750 tokens (usamos 725)
    // 1000 palabras: promedio de 1500-1600 tokens (usamos 1550)
    let tokenLimit;
    if (wordCount === '500') {
        tokenLimit = 725;
    } else if (wordCount === '1000') {
        tokenLimit = 1550;
    }
    
    const prompt = `Genera un guion completo para un ${format}.
- Debe tener aproximadamente ${wordCount} palabras (~${wordCount === '500' ? '2 minutos' : '4 minutos'}).
- El tono del ponente debe ser: ${tone}.
- Descripción del tema: ${description}.
- Asegúrate de que el guion tenga una estructura clara y completa sin frases cortadas. No incluyas nombre de capítulos, notas entre paréntesis o corchetes, o cualquier cosa que no sea parte del programa ya que el narrador leerá el texto tal cual se genere.`;
    
    // Muestra el prompt en un textarea para que el usuario pueda revisarlo
    document.getElementById('promptOutput').innerHTML = `<textarea id='promptText'>${prompt}</textarea>`;
    
    // Crea y muestra el botón para generar el guion
    const generateScriptButton = document.createElement('button');
    generateScriptButton.innerText = 'Generar Guion';
    generateScriptButton.onclick = () => generateScript(prompt, tokenLimit);
    document.getElementById('promptOutput').appendChild(generateScriptButton);
}

// Función para enviar el prompt al backend y generar el guion
function generateScript(prompt, tokenLimit) {
    fetch('/api/generateScript', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, tokenLimit })
    })
    .then(response => response.json())
    .then(data => {
        // Se asume que el endpoint devuelve data.choices[0].message.content
        const script = data.choices[0].message.content;
        document.getElementById('scriptOutput').innerHTML = `<textarea id='scriptText'>${script}</textarea>`;
        
        // Crea y muestra el botón para generar el audio a partir del guion
        const generateAudioButton = document.createElement('button');
        generateAudioButton.innerText = 'Generar Audio';
        generateAudioButton.onclick = () => {
            // Se toma el contenido actual del textarea, en caso de que el usuario lo haya modificado.
            const updatedScript = document.getElementById('scriptText').value;
            generateAudio(updatedScript);
        };
        document.getElementById('scriptOutput').appendChild(generateAudioButton);
    })
    .catch(error => console.error('Error:', error));
}

// Función para enviar el script al backend y generar el audio
function generateAudio(script) {
    fetch('/api/generateAudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.audioContent) {
            throw new Error("No se recibió contenido de audio");
        }
        // Asume que el audio se devuelve en formato Base64
        const audio = document.getElementById('audio');
        audio.src = 'data:audio/mp3;base64,' + data.audioContent;
        audio.play();
    })
    .catch(error => console.error('Error:', error));
}
