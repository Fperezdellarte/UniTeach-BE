const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql');


function fieldsExist(connection ,field, value, callback) {

    // Consulta SQL para verificar la existencia del campo
    const sql = `SELECT * FROM users WHERE ${field} = ?`;

    // Ejecutar la consulta
    connection.query(sql, [value], (err, results) => {
        if (err) {
            // Si hay un error en la consulta, llamar al callback con el error
            return callback(err);
        }

        // Si la consulta devuelve resultados, el username existe
        const usernameExists = results.length > 0;

        // Llamar al callback con el resultado
        callback(null, usernameExists);
    });
}


    const checkFieldsExistence = (data, callback) => {
        const connection = dbConnect();
        const fieldsToCheck = ['DNI', 'Legajo', 'Mail', 'Username'];
        const promises = fieldsToCheck.map(field => {
            return new Promise((resolve, reject) => {
            
            
                fieldsExist(connection, field, data[field], (err, exists) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ field, exists });
                    }
                });                
            });
        });
    
        Promise.all(promises)
            .then(results => {
                const existingFields = results.filter(result => result.exists).map(result => result.field);
                callback(null, existingFields);
            })
            .catch(err => {
                callback(err);
            });
    };

    module.exports= {fieldsExist, checkFieldsExistence};