document.addEventListener('DOMContentLoaded', function() {
  // Evento para enviar el texto actual a la API de Google TTS
  document.getElementById('generateTTS').addEventListener('click', function() {
    // Se obtiene el contenido actual del textarea (último texto que el usuario ve)
    var scriptText = document.getElementById('script').value.trim();
    
    if (scriptText === "") {
      alert("Por favor, ingresa el texto del guion.");
      return;
    }
    
    // Llamada a la función que envía el texto a Google TTS
    sendToGoogleTTS(scriptText);
  });

  // Evento para el formulario de login (acceso)
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();
    
    // Aquí deberías implementar la lógica de autenticación (envío de datos, validación, etc.)
    console.log("Usuario:", username, "Contraseña:", password);
    
    // Ejemplo de respuesta
    alert("Inicio de sesión enviado (la función de autenticación aún está pendiente).");
  });
});

// Función para enviar el texto a la API de Google TTS
function sendToGoogleTTS(text) {
  console.log("Enviando a Google TTS:", text);
  
  // Ejemplo de llamada a la API (reemplaza la URL y parámetros según tu configuración)
  fetch('https://api.googletts.example.com/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Respuesta de Google TTS:", data);
    // Aquí puedes implementar la reproducción del audio o mostrar un mensaje de éxito
    alert("Audio generado correctamente.");
  })
  .catch(error => {
    console.error("Error al enviar a Google TTS:", error);
    alert("Error al generar el audio.");
  });
}

