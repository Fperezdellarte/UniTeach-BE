const { httpError } = require("../helpers/handleError")
const { createUser, getAllUsers, modifyUser, deleteUser, getUserById } = require('../models/userModels'); // Importa la función createUser del modelo
const {checkFieldsExistence} =require('../services/userService')
const getUsers = async (req, res) =>{
    try {
        getAllUsers((err, users) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(200).json({ users });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const getUser = async (req, res) =>{
    try {
        const userId = req.params.id;

        getUserById(userId, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({user: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    
}
    
}


const createUserController = async (req, res) => {
    try {
        const userData = req.body;
        checkFieldsExistence(userData, (err, existingFields) => {
            if (err) {
                console.error('Error:', err);
                httpError(res, err); // Enviar un error HTTP al cliente si ocurre un error en la consulta
                return;
            }

            if (existingFields.length > 0) {
                // Enviar una respuesta al cliente indicando qué campos ya existen
                const message = existingFields.map(field => `${field} ya existe en la base de datos.`).join(' ');
                res.status(400).json({ message });
            } else {
                createUser(userData, (err, result) => {
                    if (err) {
                        httpError(res, err);
                    } else {
                        res.status(201).json({ message: "Usuario creado correctamente", user: result });
                    }
                });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
};



const updateUser = async (req, res) =>{
        try {
            const userId = req.params.id;
            const userData = req.body;

            modifyUser(userId, userData, (err, result) => {
                if (err) {
                    httpError(res, err); 
                } else {
                    res.status(200).json({ message: "Usuario actualizado correctamente", user: result });
                }
            });
        } catch (error) {
            httpError(res, error);
        }
    
}

const deleteUserController = async (req, res) =>{
        try {
            const userId = req.params.id;
    
            deleteUser(userId, (err, result) => {
                if (err) {
                    httpError(res, err); 
                } else {
                    res.status(200).json({ message: "Usuario eliminado correctamente", user: result });
                }
            });
        } catch (error) {
            httpError(res, error);
        
    }
    
}

module.exports = {getUsers, getUser, createUserController, updateUser, deleteUserController}