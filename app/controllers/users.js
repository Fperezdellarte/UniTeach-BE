const { httpError } = require("../helpers/handleError")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { createUser, getAllUsers, modifyUser, deleteUser, getUserById } = require('../models/userModels'); // Importa la función createUser del modelo
const {storeToken, removeToken} = require ('../models/tokens')
const {checkFieldsExistence} =require('../services/userService')
const {dbConnect} = require ('../../config/mysql')

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extrae el token del header
        const userId = req.user.id;
        if (!token || !userId) {
            return res.status(400).send({ message: "Token o usuario no proporcionado" });
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
        const [rows] = await connection.execute('SELECT * FROM users WHERE Username = ?', [Username]);

        if (rows.length > 0) {
            const user = rows[0];
            const isMatch = bcrypt.compareSync(Password, user.Password);

            if (isMatch) {
                const token = jwt.sign({ id: user.idUser }, JWT_SECRET);
                
                await storeToken(token, user.idUser);

                res.status(200).json({ message: 'Bienvenid@ ' + user.Name, user, token });
            } else {
                res.status(400).json({ message: "Incorrect username or password" });
            }
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        connection.end(); // Cierra la conexión
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ message: "Error interno al iniciar sesión" });
    }
};

const getUsers = async (req, res) =>{
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' }); // Manejo de errores
    }
}

const getUser = async (req, res) =>{
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (user) {
            res.json(user); // Devolver el usuario como JSON
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }  
}


const createUserController = async (req, res) => {
    const userData = req.body;

    try {
        // Verificar la existencia de campos
        const existingFields = await checkFieldsExistence(userData);

        if (existingFields.length > 0) {
            // Enviar una respuesta al cliente indicando qué campos ya existen
            const message = existingFields.map(field => `${field} ya existe en la base de datos.`).join(' ');
            return res.status(400).json({ message });
        }

        // Crear el usuario
        const hashedPassword = await bcrypt.hash(userData.Password, 10);
        userData.Password = hashedPassword;

        const result = await createUser(userData);

        res.status(201).json({ message: "Usuario creado correctamente", user: result });
    } catch (error) {
        httpError(res, error); // Enviar un error HTTP al cliente
    }
};



const updateUser = async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    try {
        const result = await modifyUser(userId, userData);
        res.json({ message: "Usuario actualizado correctamente", result });
    } catch (error) {
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


module.exports = {getUsers, getUser, createUserController, updateUser, deleteUserController, login, logout}