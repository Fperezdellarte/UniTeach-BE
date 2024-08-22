const jwt = require('jsonwebtoken');
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { verifyToken } = require('../models/tokens'); // Asegúrate de que la ruta sea correcta

const authentication = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(401).send({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token en la base de datos
        const tokenRecord = await verifyToken(token);
        
        if (!tokenRecord) {
            return res.status(401).send({ message: 'Token inválido o expirado' });
        }

        // Verificar el token usando jwt
        const payload = jwt.verify(token, JWT_SECRET);
        
        // Asegurarse de que el token esté asociado al usuario correcto
        if (payload.id !== tokenRecord.userId) {
            return res.status(401).send({ message: 'Token no corresponde al usuario' });
        }

        req.user = payload; // Agregar el payload al req.user para uso en rutas protegidas
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'There was a problem with the token' });
    }
};

const isAdmin = async (req, res, next) => {
    if (!req.user || !['admin', 'superadmin'].includes(req.user.TypeOfUser)) {
        return res.status(403).send({ message: "You don't have permits" });
    }
    next();
};

module.exports = { authentication, isAdmin };

