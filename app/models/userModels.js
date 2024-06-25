const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql2');




const createUser = (userData, callback) => {
    const connection = dbConnect();

    const query = "INSERT INTO Users (Username, Password, Name, DNI, Legajo, TypeOfUser, Mail, Phone, University) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        userData.Username,
        userData.Password,
        userData.Name,
        userData.DNI,
        userData.Legajo,
        userData.TypeOfUser,
        userData.Mail,
        userData.Phone,
        userData.University
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al crear el usuario:", err);
            callback(err, null);
        } else {
            console.log("Usuario creado correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const getAllUsers = (callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM Users";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener todos los usuarios:", err);
            callback(err, null);
        } else {
            console.log("Usuarios obtenidos correctamente");
            callback(null, results);
        }
        connection.end();
    });
}

const getUserById = (userId, callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM Users WHERE idUser = ?";

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error al obtener el usuario:", err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                console.log("Usuario obtenido correctamente");
                callback(null, results[0]);
            } else {
                console.log("No se encontró ningún usuario con el ID especificado");
                callback(null, null);
            }
        }
        connection.end();
    });
}
const modifyUser = (userId, userData, callback) => {
    const connection = dbConnect();
    
    let query = "UPDATE Users SET ";
    const fields = Object.keys(userData);
    const setValues = fields.map(field => `${field} = ?`).join(', ');
    query += setValues + " WHERE idUser = ?";

    const values = fields.map(field => userData[field]);
    values.push(userId);
    
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al actualizar el usuario:", err);
            callback(err, null);
        } else {
            console.log("Usuario actualizado correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const deleteUser = (userId, callback) => {
    const connection = dbConnect();

    const query = "DELETE FROM Users WHERE idUser = ?";

    connection.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Error al eliminar el usuario:", err);
            callback(err, null);
        } else {
            console.log("Usuario eliminado correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

module.exports = { getAllUsers, getUserById, createUser, modifyUser, deleteUser };
