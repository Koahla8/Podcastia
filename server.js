const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch instalado
const textToSpeech = require('@google-cloud/text-to-speech'); // Google TTS
const { Writable } = require('stream');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa Google Text-to-Speech
const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const ttsClient = new textToSpeech.TextToSpeechClient({ credentials: googleCredentials });

// Endpoint para generar el guion usando la API de OpenAI
app.post('/api/generateScript', async (req, res) => {
  try {
    const { prompt, tokenLimit } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

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

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error al generar el guion:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para generar audio con Google Text-to-Speech
app.post('/api/generateAudio', async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      return res.status(400).json({ error: 'El script es requerido' });
    }

    // Configuración de la solicitud a Google TTS
    const request = {
      input: { text: script },
      voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' }, // Ajusta el idioma y género según prefieras
      audioConfig: { audioEncoding: 'MP3' }
    };

    // Llamada a la API de Google TTS
    const [response] = await ttsClient.synthesizeSpeech(request);

    // Convertir el audio a Base64 para enviarlo como respuesta
    const audioBase64 = response.audioContent.toString('base64');

    res.json({ audioContent: audioBase64 });
  } catch (error) {
    console.error('Error al generar el audio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Fallback: para cualquier otra ruta, devuelve index.html (útil para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Escucha en el puerto asignado por Vercel o 3000 por defecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
