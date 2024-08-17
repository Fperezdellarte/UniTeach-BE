const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql');



const createUser = async (userData) => {
    const connection = dbConnect().promise();
    const query = `
        INSERT INTO users (Username, Password, Name, DNI, Legajo, TypeOfUser, Mail, Phone, University)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
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

    try {
        const [result] = await connection.query(query, values);
        console.log("Usuario creado correctamente");
        return result;
    } catch (err) {
        console.error("Error al crear el usuario:", err);
        throw err; // Lanzar el error para que pueda ser manejado en el contexto superior
    } finally {
        connection.end();
    }
};


const getAllUsers = async () => {
    const connection = dbConnect().promise();
    const query = "SELECT * FROM users";

    try {
        const [results] = await connection.query(query);
        console.log("Usuarios obtenidos correctamente");
        return results;
    } catch (err) {
        console.error("Error al obtener todos los usuarios:", err);
        throw err; // Lanzar el error para que pueda ser manejado en el contexto superior
    } finally {
        connection.end(); // Asegura el cierre de la conexión
    }
};


const getUserById = async (userId) => {
    const connection = dbConnect().promise(); // Usamos el envoltorio de promesas
    const query = "SELECT * FROM users WHERE idUser = ?";

    try {
        const [results] = await connection.query(query, [userId]);

        if (results.length > 0) {
            console.log("Usuario obtenido correctamente");
            return results[0]; // Devolver el primer resultado encontrado
        } else {
            console.log("No se encontró ningún usuario con el ID especificado");
            return null;
        }
    } catch (err) {
        console.error("Error al obtener el usuario:", err);
        throw err; // Lanzar el error para que pueda ser manejado en otro lugar
    } finally {
        connection.end(); // Asegurar el cierre de la conexión
    }
};

const modifyUser = async (userId, userData) => {
    const connection = await dbConnect().promise(); // Usar conexión basada en promesas

    try {
        let query = "UPDATE users SET ";
        const fields = Object.keys(userData);
        const setValues = fields.map(field => `${field} = ?`).join(', ');
        query += setValues + " WHERE idUser = ?";

        const values = fields.map(field => userData[field]);
        values.push(userId);

        const [result] = await connection.query(query, values);
        console.log("Usuario actualizado correctamente");
        return result;
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        throw err; // Lanzar el error para que pueda ser manejado en el controlador
    } finally {
        await connection.end(); // Asegurarse de cerrar la conexión
    }
};

const deleteUser = async (userId) => {
    const connection = await dbConnect().promise(); // Usar conexión basada en promesas

    try {
        // Primero eliminar los registros dependientes en 'inscription'
        const deleteInscriptionQuery = "DELETE FROM inscription WHERE Users_idUser = ?";
        await connection.query(deleteInscriptionQuery, [userId]);

        // Luego eliminar los registros dependientes en 'classes' (si es necesario)
        const deleteClassesQuery = "DELETE FROM classes WHERE Users_idCreator = ?";
        await connection.query(deleteClassesQuery, [userId]);

        // Finalmente eliminar el usuario
        const deleteUserQuery = "DELETE FROM users WHERE idUser = ?";
        const [result] = await connection.query(deleteUserQuery, [userId]);
        console.log("Usuario eliminado correctamente");
        return result;
    } catch (err) {
        console.error("Error al eliminar el usuario:", err);
        throw err; // Lanzar el error para que pueda ser manejado en el controlador
    } finally {
        await connection.end(); // Asegurarse de cerrar la conexión
    }
};



module.exports = { getAllUsers, getUserById, createUser, modifyUser, deleteUser };
