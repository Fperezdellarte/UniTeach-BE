const { dbConnect } = require('../../config/mysql');

const createClass = (classData, callback) => {
    const connection = dbConnect();
    
    const query = "INSERT INTO classes (hour, date, Place, Subjects_idSubjects, Users_idCreator) VALUES (?, ?, ?, ?, ?)";
    const values = [
        classData.hour,
        classData.date,
        classData.Place,
        classData.Subjects_idSubjects,
        classData.Users_idCreator
    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al crear la clase:", err);
            callback(err, null);
        } else {
            console.log("Clase creada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const getAllClasses = (callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM classes";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener todas las clases:", err);
            callback(err, null);
        } else {
            console.log("Clases obtenidas correctamente");
            callback(null, results);
        }
        connection.end();
    });
}

const getClassById = (classId, callback) => {
    const connection = dbConnect();

    const query = "SELECT * FROM classes WHERE idClasses = ?";

    connection.query(query, [classId], (err, results) => {
        if (err) {
            console.error("Error al obtener la clase:", err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                console.log("Clase obtenida correctamente");
                callback(null, results[0]);
            } else {
                console.log("No se encontró ninguna clase con el ID especificado");
                callback(null, null);
            }
        }
        connection.end();
    });
}

const modifyClass = (classId, classData, callback) => {
    const connection = dbConnect();
    
    let query = "UPDATE classes SET ";
    const fields = Object.keys(classData);
    const setValues = fields.map(field => `${field} = ?`).join(', ');
    query += setValues + " WHERE idClasses = ?";

    const values = fields.map(field => classData[field]);
    values.push(classId);
    
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al actualizar la clase:", err);
            callback(err, null);
        } else {
            console.log("Clase actualizada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

const deleteClass = (classId, callback) => {
    const connection = dbConnect();

    const query = "DELETE FROM classes WHERE idClasses = ?";

    connection.query(query, [classId], (err, result) => {
        if (err) {
            console.error("Error al eliminar la clase:", err);
            callback(err, null);
        } else {
            console.log("Clase eliminada correctamente");
            callback(null, result);
        }
        connection.end();
    });
}

module.exports = { getAllClasses, getClassById, createClass, modifyClass, deleteClass };
