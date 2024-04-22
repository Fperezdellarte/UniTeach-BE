const mysql = require('mysql');
require('dotenv').config();

const dbConnect = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    connection.connect((err) => {
        if (err) {
            console.error('***** ERROR DE CONEXION A DB*****:', err);
        } else {
            console.log('**** CONEXION A DB CORRECTA ****');
        }
    });
    
    return connection;
}

module.exports = { dbConnect };
