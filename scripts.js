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
    - Asegúrate de que el guion tenga una estructura clara y completa sin frases cortadas. No incluyas nombre de capítulos, notas entre parentisis o corchetes, o cualquier cosas que no sea parte del programa ya que el narrador leerá el texto tal cual se genere`;
    
    document.getElementById('promptOutput').innerHTML = `<textarea id='promptText'>${prompt}</textarea>`;
    
    const generateScriptButton = document.createElement('button');
    generateScriptButton.innerText = 'Generar Guion';
    generateScriptButton.onclick = () => generateScript(prompt, tokenLimit);
    document.getElementById('promptOutput').appendChild(generateScriptButton);
}

function generateScript(prompt, tokenLimit) {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: tokenLimit
        })
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

function generateAudio(script) {
    fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBaWXz7Rz7bWqjrVFbfB0trGAR2lEnlkGU', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { text: script },
            voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' }
        })
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
