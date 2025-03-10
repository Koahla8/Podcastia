// Función para construir el prompt a partir de los datos del formulario
function generatePrompt() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const toneSelect = document.getElementById('tone').value;
    const customTone = document.getElementById('customTone').value;
    const wordCount = document.getElementById('wordCount').value;

    const tone = toneSelect === "Otro" && customTone ? customTone : toneSelect;
    const tokenLimit = wordCount === '500' ? 750 : 2000;
    
    const prompt = `Genera un guion completo para un podcast titulado "${title}".
- Debe tener aproximadamente ${wordCount} palabras (~${wordCount === '500' ? '2 minutos' : '5 minutos'}).
- El tono del ponente debe ser: ${tone}.
- Descripción del tema: ${description}.
- Asegúrate de que el guion tenga una estructura clara y completa sin frases cortadas. No incluyas nombre de capítulos, notas entre paréntesis o corchetes, o cualquier cosa que no sea parte del programa ya que el narrador leerá el texto tal cual se genere.`;
    
    document.getElementById('promptOutput').innerHTML = `<textarea id='promptText'>${prompt}</textarea>`;
    
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
        const script = data.choices[0].message.content;
        document.getElementById('scriptOutput').innerHTML = `<textarea id='scriptText'>${script}</textarea>`;
        
        const generateAudioButton = document.createElement('button');
        generateAudioButton.innerText = 'Generar Audio';
        generateAudioButton.onclick = () => generateAudio(script);
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
        const audio = document.getElementById('audio');
        audio.src = 'data:audio/mp3;base64,' + data.audioContent;
        audio.play();
    })
    .catch(error => console.error('Error:', error));
}
