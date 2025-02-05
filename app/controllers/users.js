const { httpError } = require("../helpers/handleError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const {
  createUser,
  getAllUsers,
  modifyUser,
  deleteUser,
  getUserById,
  rateUser,
  updatePassword,
  getRatingsByMentor,
} = require("../models/userModels"); // Importa la función createUser del modelo
const { storeToken, removeToken } = require("../models/tokens");
const { checkFieldsExistence, mail_rover } = require("../services/userService");
const nodemailer = require("nodemailer");
const { dbConnect } = require("../../config/mysql");
const { uploadImageToImgur } = require("../../config/imgurUplouder");

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extrae el token del header
    const userId = req.user.id;
    if (!token || !userId) {
      return res
        .status(400)
        .send({ message: "Token o usuario no proporcionado" });
    }

    await removeToken(userId, token); // Elimina el token
    res.status(200).send({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al cerrar sesión" });
  }
};

const login = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const connection = await dbConnect().promise();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE Username = ?",
      [Username]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = bcrypt.compareSync(Password, user.Password);

      if (isMatch) {
        const token = jwt.sign({ id: user.idUser }, JWT_SECRET);

        await storeToken(token, user.idUser);

        // Crear un objeto `user` filtrado con solo los campos necesarios
        const filteredUser = {
          idUser: user.idUser,
          Username: user.Username,
          Name: user.Name,
          Mail: user.Mail,
          Phone: user.Phone,
          TypeOfUser: user.TypeOfUser,
          University: user.University,
          Avatar_URL: user.Avatar_URL,
          Opinion: user.AverageOpinion,
          Description: user.Description,
        };

        res.status(200).json({
          message: "Bienvenid@ " + user.Name,
          user: filteredUser,
          token,
        });
      } else {
        res.status(400).json({ message: "Incorrect username or password" });
      }
    } else {
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    connection.end(); // Cierra la conexión
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    res.status(500).json({ message: "Error interno al iniciar sesión" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" }); // Manejo de errores
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (user) {
      res.json(user); // Devolver el usuario como JSON
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

const getMentor = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    const ratings = await getRatingsByMentor(userId);
    if (user) {
      const filteredUser = {
        idUser: user.idUser,
        Username: user.Username,
        Name: user.Name,
        Mail: user.Mail,
        Phone: user.Phone,
        University: user.University,
        Description: user.Description,
        Opinion: user.AverageOpinion,
        Avatar_URL: user.Avatar_URL,
        carrera_id: user.carrera_id,
        Carrera: user.careerName,
        Rating: [null],
      };
      if (ratings.length > 0) {
        filteredUser.Rating = ratings;
      }

      res.json(filteredUser);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

const createUserController = async (req, res) => {
  const userData = req.body;
  const imageFile = req.file;

  try {
    if (imageFile) {
      // Sube la imagen a Imgur y obtiene el enlace
      const imageUrl = await uploadImageToImgur(imageFile.path);
      userData.Avatar_URL = imageUrl;
    }

    // Verificar la existencia de campos y crear el usuario
    const existingFields = await checkFieldsExistence(userData);
    if (existingFields.length > 0) {
      const message = existingFields
        .map((field) => `${field} ya existe en la base de datos.`)
        .join(" ");
      return res.status(400).json({ message });
    }

    // Crear el usuario
    const hashedPassword = await bcrypt.hash(userData.Password, 10);
    userData.Password = hashedPassword;

    const result = await createUser(userData);

    res
      .status(201)
      .json({ message: "Usuario creado correctamente", user: result });
  } catch (error) {
    httpError(res, error); // Enviar un error HTTP al cliente
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  const imageFile = req.file;

  try {
    if (imageFile) {
      const imageUrl = await uploadImageToImgur(imageFile.path);
      userData.Avatar_URL = imageUrl;
      console.log("URL de la imagen:", imageUrl);
    }

    const updatedUser = await modifyUser(userId, userData);
    res.json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const deleteUserController = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await deleteUser(userId);
    res.json({ message: "Usuario eliminado correctamente", result });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

const ratingUser = async (req, res) => {
  const userId = req.params.id;
  const { rate } = req.body;

  if (typeof rate.rating !== "number" || rate.rating < 0 || rate.rating > 5) {
    return res
      .status(400)
      .json({ error: "La calificación debe ser un número entre 0 y 5." });
  }

  try {
    const result = await rateUser(userId, rate);

    if (result.message === "El usuario ya calificó a este mentor.") {
      return res.status(400).json({ error: result.message });
    }

    if (result.message === "Error al calificar el usuario.") {
      return res.status(500).json({ error: result.message });
    }

    res.json({
      message: result.message,
      average: result.newAverage,
    });
  } catch (error) {
    console.error("Error al calificar mentor:", error);
    res.status(500).json({ error: "No se pudo calificar" });
  }
};

const sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Generar el token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `https://uniteach.netlify.app/reset-password/${token}`;

    // Configurar el transporte y enviar el correo
    mail_rover((transporter) => {
      transporter.sendMail(
        {
          from: "Uniteach",
          to: email,
          subject: "Restablece tu contraseña",
          html: `<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color:  #004aad;
      padding: 20px;
      text-align: center;
      color: white;
    }
    .header img {
      max-width: 150px;
      margin-bottom: 10px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
      margin: 15px 0;
    }
    .content a {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color:  #004aad;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }
    .content a:hover {
      background-color:  #004aad;
    }
    .footer {
      background-color:rgb(0, 0, 0);
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://i.imgur.com/wdO9gzQ.png" alt="Uniteach">
    </div>
    <div class="content">
      <p></p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer Contraseña</a>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Uniteach. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`,
        },
        (error, info) => {
          if (error) {
            console.error("Error al enviar el correo:", error);
            return res.status(500).send("Error al enviar el correo");
          }
          res.status(200).send("Correo enviado");
        }
      );
    });
  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).send("Error interno");
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verifica el token
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Hashea la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualiza la contraseña en la base de datos
    const result = await updatePassword(email, hashedPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    if (error.message === "No existe un usuario con ese correo.") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error al restablecer contraseña." });
    }
  }
};

const getAllRating = async (req, res) => {
  const mentorId = req.params.id;

  try {
    const ratings = await getRatingsByMentor(mentorId);

    if (ratings.length === 0) {
      return res.status(404).json({
        message: "No se encontraron calificaciones para este mentor.",
      });
    }

    res.json({
      message: "Calificaciones obtenidas correctamente.",
      ratings,
    });
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    res
      .status(500)
      .json({ error: "No se pudieron obtener las calificaciones." });
  }
};

module.exports = {
  getUsers,
  getMentor,
  getUser,
  createUserController,
  updateUser,
  deleteUserController,
  login,
  logout,
  ratingUser,
  sendEmail,
  getAllRating,
  resetPassword,
};
