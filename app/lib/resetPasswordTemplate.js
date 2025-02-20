const resetPasswordTemplate = (resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background-color: #f9f9f9; }
    .email-container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    
    /* Cambios de color aquí */
    .header { background-color: #004aad; /* Azul */ padding: 20px; text-align: center; color: white; }
    .header img { max-width: 150px; }
    
    .content { padding: 30px; text-align: center; }
    .content a { 
      background-color: #004aad; /* Azul */
      color: white !important; 
      padding: 12px 30px; 
      border-radius: 5px; 
      text-decoration: none;
      display: inline-block;
      margin: 20px 0;
    }
    
    .footer { 
      background-color: #ffffff; /* Fondo blanco */
      padding: 20px; 
      text-align: center; 
      color: #666;
      border-top: 1px solid #eee;
    }
    
    /* Cambiamos lo amarillo a blanco */
    .warning-section { 
      background-color: #ffffff !important; /* Blanco */
      color: #004aad !important; /* Texto azul */
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      border: 1px solid #004aad;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://i.imgur.com/wdO9gzQ.png" alt="Uniteach">
    </div>
    
    <div class="content">
      <h2>Restablecer Contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer Ahora</a>
      
      <div class="warning-section">
        <h3>¿No solicitaste este cambio?</h3>
        <p>Contacta inmediatamente a nuestro equipo de soporte:</p>
        <p>📞 +54 3815631063<br>✉️ uniteach2024@gmail.com</p>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2024 Uniteach. Todos los derechos reservados.</p>
      <p style="font-size: 12px; color: #999;">Este es un correo automático, por favor no responder.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = resetPasswordTemplate;
