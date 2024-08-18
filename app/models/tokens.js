const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql'); 

const storeToken = async (token, userId, expiresInMinutes = 600) => {
    const connection = await dbConnect().promise();
    try {
        // Verificar cuántos tokens activos tiene el usuario
        const [rows] = await connection.execute(
            'SELECT COUNT(*) AS tokenCount FROM tokens WHERE userId = ?',
            [userId]
        );

        const tokenCount = rows[0].tokenCount;

        if (tokenCount >= 4) {
            // Obtener el ID del token más antiguo
            const [oldestToken] = await connection.execute(
                'SELECT id FROM tokens WHERE userId = ? ORDER BY createdAt ASC LIMIT 1',
                [userId]
            );
            
            if (oldestToken.length > 0) {
                // Eliminar el token más antiguo
                await connection.execute(
                    'DELETE FROM tokens WHERE id = ?',
                    [oldestToken[0].id]
                );
            }
        }

        // Insertar el nuevo token
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

        const [result] = await connection.execute(
            'INSERT INTO tokens (token, userId, expiresAt) VALUES (?, ?, ?)',
            [token, userId, expiresAt]
        );
        return result;
    } catch (error) {
        console.error('Error al almacenar el token:', error);
        throw error;
    } finally {
        connection.end(); // Asegúrate de cerrar la conexión
    }
};

const verifyToken = async (token) => {
    const connection = await dbConnect().promise();
    try {
        // Verificar si el token es válido y no ha expirado
        const [rows] = await connection.execute(
            'SELECT * FROM tokens WHERE token = ? AND expiresAt > NOW()',
            [token]
        );

        if (rows.length > 0) {
            // Token válido
            return rows[0];
        } else {
            // Token inválido o expirado
            throw new Error('Token inválido o expirado');
        }
    } catch (error) {
        console.error('Error al verificar el token:', error);
        throw error;
    } finally {
        connection.end(); // Asegúrate de cerrar la conexión
    }
};


module.exports = {verifyToken, storeToken }