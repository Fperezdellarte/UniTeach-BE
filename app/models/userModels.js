const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql');

const createUser = async (userData) => {
    const connection = dbConnect().promise();
    const query = `
        INSERT INTO users (Username, Password, Name, DNI, Legajo, TypeOfUser, Mail, Phone, University, Avatar_URL)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        userData.University,
        userData.Avatar_URL // Cambia el nombre a Avatar_URL
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
        // Construir la consulta SQL dinámicamente
        let query = "UPDATE users SET ";
        const fields = Object.keys(userData);
        
        // Crear la parte SET de la consulta SQL
        const setValues = fields.map(field => `${field} = ?`).join(', ');
        query += setValues + " WHERE idUser = ?";

        // Preparar los valores para la consulta SQL
        const values = fields.map(field => userData[field]);
        values.push(userId);

        // Ejecutar la consulta SQL
        await connection.query(query, values);

        // Recuperar los datos actualizados del usuario
        query = "SELECT * FROM users WHERE idUser = ?";
        const [rows] = await connection.query(query, [userId]);
        
        if (rows.length > 0) {
            console.log("Usuario actualizado correctamente");
            return rows[0]; // Devolver el primer resultado
        } else {
            throw new Error("Usuario no encontrado");
        }
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

const rateUser = async (userId, rate) => {
    const connection = await dbConnect().promise();
    const query = "SELECT Opinion, NumberOpinion FROM users WHERE idUser = ?";
    const updateQuery = "UPDATE users SET Opinion = ?, NumberOpinion = ?, AverageOpinion = ? WHERE idUser = ?";

    try {
        // Consultar las opiniones existentes
        const [results] = await connection.query(query, [userId]);

        if (results.length > 0) {
            console.log("Calificación encontrada");

            const numberOpinion = results[0].NumberOpinion; // Número actual de opiniones
            const Opinion = results[0].Opinion; // Suma acumulada de opiniones

            // Calcular la nueva suma de opiniones y el número de opiniones
            const newOpinionSum = Opinion + rate; // Suma acumulada con la nueva calificación
            const newNumberOpinion = numberOpinion + 1; // Incrementar el contador de opiniones

            // Calcular el nuevo promedio
            const newAverage = newOpinionSum / newNumberOpinion;

            // Actualizar en la base de datos
            await connection.query(updateQuery, [newOpinionSum, newNumberOpinion, newAverage, userId]);

            console.log("Calificación actualizada");
            return { userId, newAverage };
        } else {
            console.log("Este usuario no tiene calificación previa. Agregando la primera calificación.");

            // Insertar la primera calificación en caso de que no existan opiniones
            const insertQuery = "UPDATE users SET Opinion = ?, NumberOpinion = ?, AverageOpinion = ? WHERE idUser = ?";
            await connection.query(insertQuery, [rate, 1, rate, userId]);

            return { userId, newAverage: rate }; // El promedio es igual a la primera calificación
        }
    } catch (err) {
        console.error("Error al calificar usuario:", err);
        throw err;
    } finally {
        await connection.end();
    }
};

const updatePassword = async (email, hashedPassword) => {
    const connection = await dbConnect().promise();
    try {
        // Verificar si el usuario existe
        const [rows] = await connection.execute(
            'SELECT COUNT(*) AS count FROM users WHERE Mail = ?',
            [email]
        );

        if (rows[0].count === 0) {
            throw new Error('No existe un usuario con ese correo.');
        }

        // Actualizar la contraseña
        await connection.execute(
            'UPDATE users SET Password = ? WHERE Mail = ?',
            [hashedPassword, email]
        );

        return { message: 'Contraseña actualizada con éxito.' };
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        throw error; // Re-lanzar el error para manejarlo en el controlador
    } finally {
        connection.end();
    }
};







module.exports = { getAllUsers, getUserById, createUser, modifyUser, deleteUser, rateUser ,updatePassword};
