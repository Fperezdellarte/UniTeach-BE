const { dbConnect } = require('../../config/mysql');

const createInscription = (inscriptionData, callback) => {
    const connection = dbConnect();

    const query = "INSERT INTO inscription (Users_idUser, Classes_idClasses) VALUES (?, ?)";
    const values = [
        inscriptionData.Users_idUser,
        inscriptionData.Classes_idClasses
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al crear la inscripción:", err);
            callback(err, null);
        } else {
            console.log("Inscripción creada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const getAllInscriptions = (callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM inscription";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener todas las inscripciones:", err);
            callback(err, null);
        } else {
            console.log("Inscripciones obtenidas correctamente");
            callback(null, results);
        }
        connection.end();
    });
}

const getInscriptionById = (inscriptionId, callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM inscription WHERE idInscription = ?";

    connection.query(query, [inscriptionId], (err, results) => {
        if (err) {
            console.error("Error al obtener la inscripción:", err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                console.log("Inscripción obtenida correctamente");
                callback(null, results[0]);
            } else {
                console.log("No se encontró ninguna inscripción con el ID especificado");
                callback(null, null);
            }
        }
        connection.end();
    });
}

const deleteInscription = (inscriptionId, callback) => {
    const connection = dbConnect();

    const query = "DELETE FROM inscription WHERE idInscription = ?";

    connection.query(query, [inscriptionId], (err, result) => {
        if (err) {
            console.error("Error al eliminar la inscripción:", err);
            callback(err, null);
        } else {
            console.log("Inscripción eliminada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

module.exports = { createInscription, getAllInscriptions, getInscriptionById, deleteInscription };
