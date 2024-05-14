const { dbConnect } = require('../../config/mysql');

const login = async (req, res) => {
    try {
        const { Username, Password } = req.body;
        const consult = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
        const connection = dbConnect();
        connection.query(consult, [Username, Password], (error, result) => { // Ejecutamos la consulta utilizando la conexión
            if (result.length > 0) {
                res.status(201).json({ message: "login completado" });
            } else {
                console.log('Usuario incorrecto');
                res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }
        });
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ message: "Error interno al iniciar sesión" });
    }
}
module.exports= {login}
