// server.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch instalado

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

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

// Endpoint para generar audio a partir del script (ajusta según tu implementación)
app.post('/api/generateAudio', async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      return res.status(400).json({ error: 'El script es requerido' });
    }
    
    // Aquí debes implementar la lógica para generar el audio.
    // Por ejemplo, podrías llamar a otro servicio de conversión de texto a voz.
    // En este ejemplo, simplemente devolvemos un mensaje simulado.
    res.json({ audioContent: "BASE64_AUDIO_SIMULADO" });
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
