const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer');

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


require("dotenv").config();

const mail_rover = async (callback) => {
    const oauth2Client = new OAuth2(
        process.env.OAUTH_CLIENT_ID, // Cliente ID desde .env
        process.env.OAUTH_CLIENT_SECRET, // Cliente Secret desde .env
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN, // Token de actualización desde .env
    });

    oauth2Client.getAccessToken((err, token) => {
        if (err) {
            console.error("Error al obtener el access token", err);
            return;
        }

        const transportConfig = {
            service: process.env.EMAIL_SERVICE, // Servicio de correo
            auth: {
                type: process.env.TYPE_USER,
                user: process.env.EMAIL_USER, // Email desde .env
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: token, // Access token generado dinámicamente
            },
            tls: {
                rejectUnauthorized: false, // Permite conexiones no seguras
            },
        };

        callback(nodemailer.createTransport(transportConfig));
    });
};



    module.exports= {checkFieldsExistence, mail_rover};