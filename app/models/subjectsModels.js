const { dbConnect } = require('../../config/mysql');

const createSubject = (subjectData, callback) => {
    const connection = dbConnect();

    const query = "INSERT INTO subjects (Name, University) VALUES (?, ?)";
    const values = [
        subjectData.Name,
        subjectData.University
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al crear la materia:", err);
            callback(err, null);
        } else {
            console.log("Materia creada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const getAllSubjects = (callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM subjects";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener todas las materias:", err);
            callback(err, null);
        } else {
            console.log("Materias obtenidas correctamente");
            callback(null, results);
        }
        connection.end();
    });
}

const getSubjectById = (subjectId, callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM subjects WHERE idSubjects = ?";

    connection.query(query, [subjectId], (err, results) => {
        if (err) {
            console.error("Error al obtener la materia:", err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                console.log("Materia obtenida correctamente");
                callback(null, results[0]);
            } else {
                console.log("No se encontró ninguna materia con el ID especificado");
                callback(null, null);
            }
        }
        connection.end();
    });
}

const modifySubject = (subjectId, subjectData, callback) => {
    const connection = dbConnect();
    
    let query = "UPDATE subjects SET ";
    const fields = Object.keys(subjectData);
    const setValues = fields.map(field => `${field} = ?`).join(', ');
    query += setValues + " WHERE idSubjects = ?";

    const values = fields.map(field => subjectData[field]);
    values.push(subjectId);
    
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al actualizar la materia:", err);
            callback(err, null);
        } else {
            console.log("Materia actualizada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const deleteSubject = (subjectId, callback) => {
    const connection = dbConnect();

    const query = "DELETE FROM subjects WHERE idSubjects = ?";

    connection.query(query, [subjectId], (err, result) => {
        if (err) {
            console.error("Error al eliminar la materia:", err);
            callback(err, null);
        } else {
            if (result.affectedRows === 0) {
                const error = new Error("No se encontró la materia con el ID especificado");
                console.error(error.message);
                callback(error, null);
            } else {
                console.log("Materia eliminada correctamente");
                callback(null, result);
            }
        }
        connection.end();
    });
}

module.exports = { getAllSubjects, getSubjectById, createSubject, modifySubject, deleteSubject };
