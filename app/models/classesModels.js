const { dbConnect } = require('../../config/mysql');
const { calculateEndDate } = require('../services/classesService');

const createClass = async (classData) => {
    const connection = await dbConnect().promise();

    // Calcular la fecha y hora de fin de la clase
    const endDate = calculateEndDate(classData.hour, classData.date);

    // Determinar si la clase ha expirado
    const expired = new Date(endDate) < new Date() ? true : false;

    const query = "INSERT INTO classes (hour, date, Place, Subjects_idSubjects, Users_idCreator, endDate, expired) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
        classData.hour,
        classData.date,
        classData.Place,
        classData.Subjects_idSubjects,
        classData.Users_idCreator,
        endDate, // Fecha y hora de fin de clase
        expired // Indica si la clase ha expirado
    ];

    try {
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await connection.end();
    }
};


const getAllClasses = async () => {
    const connection = await dbConnect().promise();

    const query = "SELECT * FROM classes";

    try {
        const [results] = await connection.query(query);
        return results;
    } catch (err) 
    {
        throw err;
    }
    finally{

      await  connection.end();
    }
}

const getClassById = async (classId) => {
    const connection = await dbConnect().promise();
    const query = "SELECT * FROM classes WHERE idClasses = ?";
    try {
        const [results] = await connection.query(query, [classId]);
        console.log('clase obtenida correctamente');
        return results.length > 0 ? results[0] : null
    } catch (err) 
    {
      throw err;  
    }
    finally{
        await connection.end();
    }
}

const modifyClass = async (classId, classData) => {
    const connection = await dbConnect().promise();

    // Primero, obtener todos los datos actuales necesarios
    const [currentClass] = await connection.query("SELECT Date, hour FROM classes WHERE idClasses = ?", [classId]);

    const currentDate = currentClass[0]?.Date;
    const currentHour = currentClass[0]?.hour;
   
    if (!currentDate || !currentHour) {
        throw new Error('Fecha de inicio y hora actuales no encontradas para calcular la fecha de fin.');
    }

    // Verificar qué campos se están actualizando
    const fields = Object.keys(classData);
    const updateDate = fields.includes('Date');
    const updateHour = fields.includes('hour');

    let endDate;

    // Calcular la nueva fecha de fin
    if (updateDate && updateHour) {
        endDate = calculateEndDate(classData.hour, classData.Date);
    } else if (updateHour) {
        endDate = calculateEndDate(classData.hour, currentDate);
    } else if (updateDate) {
        endDate = calculateEndDate(currentHour, classData.Date);
    } else {
        // Si no se actualiza ni fecha ni hora, mantener la fecha de fin actual
        endDate = currentClass[0]?.endDate;
    }

    // Construir la consulta para la actualización
    let query = "UPDATE classes SET ";
    const setValues = fields.map(field => `${field} = ?`).join(', ');
    query += setValues + ", endDate = ? WHERE idClasses = ?";

    // Construir los valores para la consulta
    const values = fields.map(field => classData[field]);
    values.push(endDate);
    values.push(classId);

    try {
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await connection.end();
    }
};



const deleteClass = async (classId) => {
    const connection = await dbConnect().promise();

    const query = "DELETE FROM classes WHERE idClasses = ?";

    try {
        const [result] = await connection.query(query, [classId]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await connection.end();
    }
}

module.exports = { getAllClasses, getClassById, createClass, modifyClass, deleteClass };
