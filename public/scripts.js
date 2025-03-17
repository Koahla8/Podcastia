document.addEventListener('DOMContentLoaded', function() {
  // Al hacer clic en el botón, se obtiene el contenido actual del textarea
  document.getElementById('generateTTS').addEventListener('click', function() {
    var scriptText = document.getElementById('script').value.trim();
    
    if (scriptText === "") {
      alert("Por favor, ingresa el texto del guion.");
      return;
    }
    
    // Se envía el contenido actual (último texto) a la API de Google TTS
    sendToGoogleTTS(scriptText);
  });

  // Evento para el formulario de acceso
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();
    
    // Lógica de autenticación (a implementar según tus necesidades)
    console.log("Usuario:", username, "Contraseña:", password);
    alert("Inicio de sesión enviado (simulación).");
  });
});

// Función para enviar el texto a la API de Google TTS
function sendToGoogleTTS(text) {
  console.log("Enviando a Google TTS:", text);
  
  // Ejemplo de llamada a la API (reemplaza la URL y parámetros según tu configuración)
  fetch('https://api.googletts.example.com/convert', { // URL de ejemplo
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Respuesta de Google TTS:", data);
    alert("Audio generado correctamente.");
  })
  .catch(error => {
    console.error("Error al enviar a Google TTS:", error);
    alert("Error al generar el audio.");
  });
}
