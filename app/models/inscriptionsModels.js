const { query } = require("express");
const { dbConnect } = require("../../config/mysql");

// Verificar si el usuario existe
const userExists = async (userId) => {
  const connection = await dbConnect().promise();
  try {
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM users WHERE idUser = ?",
      [userId]
    );
    return rows[0].count > 0;
  } finally {
    await connection.end();
  }
};

// Verificar si la clase existe
const classExists = async (classId) => {
  const connection = await dbConnect().promise();
  try {
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM classes WHERE idClasses = ?",
      [classId]
    );
    return rows[0].count > 0;
  } finally {
    await connection.end();
  }
};

const createInscription = async (classId, userId) => {
  const connection = await dbConnect().promise();

  try {
    const userExistsFlag = await userExists(userId);
    const classExistsFlag = await classExists(classId);

    if (!userExistsFlag) {
      throw new Error("El usuario especificado no existe.");
    }

    if (!classExistsFlag) {
      throw new Error("La clase especificada no existe.");
    }

    const checkQuery =
      "SELECT * FROM inscription WHERE Users_idUser = ? AND Classes_idClasses = ?";
    const [existingInscriptions] = await connection.query(checkQuery, [
      userId,
      classId,
    ]);

    if (existingInscriptions.length > 0) {
      throw new Error("El usuario ya está inscrito a esta clase.");
    }
    const insertQuery =
      "INSERT INTO inscription (Users_idUser, Classes_idClasses) VALUES (?, ?)";
    const [result] = await connection.query(insertQuery, [userId, classId]);
    console.log("Inscripción creada correctamente");
    return result;
  } catch (err) {
    console.error("Error al crear/verificar la inscripción:", err);
    throw err;
  } finally {
    await connection.end();
  }
};

const getAllInscriptions = async () => {
  const connection = await dbConnect().promise();
  const query = "SELECT * FROM inscription";
  try {
    const [results] = await connection.query(query);
    console.log("Inscripciones obtenidas correctamente");
    return results;
  } catch (err) {
    console.error("Error al obtener todas las inscripciones:", err);
    throw err;
  } finally {
    await connection.end();
  }
};

const getInscriptionById = async (inscriptionId) => {
  const connection = await dbConnect().promise();
  try {
    const [results] = await connection.query(
      "SELECT * FROM inscription WHERE idInscription = ?",
      [inscriptionId]
    );
    if (results.length > 0) {
      console.log("Inscripción obtenida correctamente");
      return results[0];
    } else {
      console.log("No se encontró ninguna inscripción con el ID especificado");
      return null;
    }
  } catch (err) {
    console.error("Error al obtener la inscripción:", err);
    throw err;
  } finally {
    await connection.end();
  }
};
const getInscriptionByUserId = async (userId) => {
  const connection = await dbConnect().promise();
  try {
    // Cambiar la consulta para buscar por ID del usuario
    const [results] = await connection.query(
      "SELECT * FROM inscription WHERE Users_idUser = ?",
      [userId]
    );

    if (results.length > 0) {
      console.log("Inscripciones obtenidas correctamente");
      return results;
    } else {
      console.log(
        "No se encontraron inscripciones para el usuario con el ID especificado"
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener las inscripciones:", err);
    throw err;
  } finally {
    await connection.end();
  }
};

const deleteInscription = async (inscriptionId) => {
  const connection = await dbConnect().promise();

  const query = "DELETE FROM inscription WHERE idInscription = ?";

  try {
    const [result] = await connection.query(query, [inscriptionId]);
    return result;
  } catch (err) {
    throw err;
  } finally {
    await connection.end;
  }
};

module.exports = {
  createInscription,
  getAllInscriptions,
  getInscriptionById,
  deleteInscription,
  getInscriptionByUserId,
};
