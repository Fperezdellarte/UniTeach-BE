const { dbConnect } = require("../../config/mysql");

const getAllCareers = async () => {
  const connection = await dbConnect().promise();
  try {
    const [rows] = await connection.query("SELECT * FROM carreras");
    return rows;
  } catch (error) {
    console.error("Error al obtener las carreras:", error.message);
    throw new Error("No se pudieron obtener las carreras. Intenta nuevamente.");
  } finally {
    connection.end(); // Cierra la conexión para evitar fugas
  }
};

module.exports = { getAllCareers };