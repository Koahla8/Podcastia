// server.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Asegúrate de instalar node-fetch (versión 2.x para CommonJS)

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para llamar a la API de OpenAI
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 50
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error al llamar a OpenAI:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Otro endpoint de ejemplo (si lo necesitas)
app.get('/api/data', (req, res) => {
  res.json({ message: "Hola, este es el endpoint de la API" });
});

// Catch-all: para cualquier otra ruta, devuelve index.html (útil para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Escucha en el puerto que asigne Vercel o en el 3000 por defecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
