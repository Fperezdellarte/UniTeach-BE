const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql');

const createUserSubject = (userSubjectData, callback) => {
    const connection = dbConnect();

    const query = "INSERT INTO userssubjects (Users_idUser, Subjects_idSubjects) VALUES (?, ?)";
    const values = [
        userSubjectData.Users_idUser,
        userSubjectData.Subjects_idSubjects
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al crear la relación usuario-materia:", err);
            callback(err, null);
        } else {
            console.log("Relación usuario-materia creada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const deleteUserSubject = (userId, subjectId, callback) => {
    const connection = dbConnect();

    const query = "DELETE FROM userssubjects WHERE Users_idUser = ? AND Subjects_idSubjects = ?";

    connection.query(query, [userId, subjectId], (err, result) => {
        if (err) {
            console.error("Error al eliminar la relación usuario-materia:", err);
            callback(err, null);
        } else {
            console.log("Relación usuario-materia eliminada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const getUserSubjects = (userId, callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM userssubjects WHERE Users_idUser = ?";

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error al obtener las materias del usuario:", err);
            callback(err, null);
        } else {
            console.log("Materias del usuario obtenidas correctamente");
            callback(null, results);
        }
        connection.end();
    });
}

module.exports = { createUserSubject, deleteUserSubject, getUserSubjects };
