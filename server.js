// server.js
const express = require('express');
// Ajuste en la importación de fetch para asegurar compatibilidad
const _fetch = require('node-fetch');
const fetch = _fetch.default || _fetch;

const dotenv = require('dotenv');
dotenv.config();

// Verificar que las claves se hayan cargado correctamente
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);

const app = express();
app.use(express.json());

// Servir archivos estáticos (index.html, scripts.js, styles.css, etc.) desde la raíz del proyecto
app.use(express.static(__dirname));

// Endpoint para generar el guion usando OpenAI
app.post('/api/generateScript', async (req, res) => {
    const { prompt, tokenLimit } = req.body;
    console.log('Recibido prompt:', prompt);
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: tokenLimit
            })
        });
        const data = await response.json();
        console.log('Respuesta de OpenAI:', data);
        res.json(data);
    } catch (error) {
        console.error('Error generando script:', error);
        res.status(500).json({ error: 'Error generando script' });
    }
});

// Endpoint para generar audio usando Google Text-to-Speech
app.post('/api/generateAudio', async (req, res) => {
    const { script } = req.body;
    console.log('Recibido script para audio:', script);
    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: { text: script },
                voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
                audioConfig: { audioEncoding: 'MP3' }
            })
        });
        const data = await response.json();
        console.log('Respuesta de Google TTS:', data);
        res.json(data);
    } catch (error) {
        console.error('Error generando audio:', error);
        res.status(500).json({ error: 'Error generando audio' });
    }
});

// Eliminamos app.listen para entornos serverless y exportamos la aplicación
module.exports = app;
