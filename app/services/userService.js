const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql');

const checkFieldsExistence = async (data) => {
    const connection = await dbConnect().promise(); // Crear una conexión basada en promesas
    const fieldsToCheck = ['DNI', 'Legajo', 'Mail', 'Username'];

    try {
        const promises = fieldsToCheck.map(async (field) => {
            const sql = `SELECT * FROM users WHERE ${field} = ?`;
            const [results] = await connection.query(sql, [data[field]]);
            return { field, exists: results.length > 0 };
        });

        const results = await Promise.all(promises);
        const existingFields = results.filter(result => result.exists).map(result => result.field);

        return existingFields;
    } catch (err) {
        throw err; // Lanzar el error para que pueda ser manejado en otro lugar
    } finally {
        await connection.end(); // Asegurarse de cerrar la conexión
    }
};



    module.exports= {checkFieldsExistence};