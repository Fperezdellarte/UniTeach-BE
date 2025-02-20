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
const resetPasswordTemplate = require("../lib/resetPasswordTemplate");

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
  const userId = req.user.id;
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

    mail_rover(async (transporter) => {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          ssubject: "Restablece tu contraseña",
          html: resetPasswordTemplate(resetLink),
        });
        console.log("Correo enviado con éxito");
      } catch (error) {
        console.error("Error al enviar:", error);
      }
    });

    res.status(200).json({ message: "Correo enviado con éxito" });
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
