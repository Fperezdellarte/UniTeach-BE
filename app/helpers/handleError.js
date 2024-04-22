const httpError = (res, err) => {
    console.error("Error:", err); // Imprime el error en la consola para depuración
    res.status(500).json({ error: "Algo ocurrió" }); // Envía una respuesta de error al cliente con el código de estado 500
};

module.exports = { httpError };
