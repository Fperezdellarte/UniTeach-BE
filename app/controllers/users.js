const { httpError } = require("../helpers/handleError")
const { createUser, getAllUsers, modifyUser, deleteUser, getUserById } = require('../models/userModels'); // Importa la función createUser del modelo
const {checkFieldsExistence} =require('../services/userService')
const {dbConnect} = require ('../../config/mysql')


const login = async (req, res) => {
    try {
        const { Username, Password } = req.body;
        const consult = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
        const connection = dbConnect();
        connection.query(consult, [Username, Password], (error, result) => { // Ejecutamos la consulta utilizando la conexión
            if (result.length > 0) {
                res.status(201).json({ message: "login completado" });
            } else {
                console.log('Usuario incorrecto');
                res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }
        });
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ message: "Error interno al iniciar sesión" });
    }
}

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


module.exports = {getUsers, getUser, createUserController, updateUser, deleteUserController, login}