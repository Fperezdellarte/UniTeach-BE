const { dbConnect } = require('../../config/mysql');

const createClass = async (classData) => {
    const connection = await dbConnect().promise();
    
    const query = "INSERT INTO classes (hour, date, Place, Subjects_idSubjects, Users_idCreator) VALUES (?, ?, ?, ?, ?)";
    const values = [
        classData.hour,
        classData.date,
        classData.Place,
        classData.Subjects_idSubjects,
        classData.Users_idCreator
    ];
  try{
        const [result] = await connection.query(query, values);
        return result;
}
  catch(err){
    throw err
  }
  finally{
        await connection.end
  }
}

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
    
    let query = "UPDATE classes SET ";
    const fields = Object.keys(classData);
    const setValues = fields.map(field => `${field} = ?`).join(', ');
    query += setValues + " WHERE idClasses = ?";

    const values = fields.map(field => classData[field]);
    values.push(classId);
     
    try {
        const [result] = await connection.query(query, values);
        return result;
    } catch (err) {
        throw err;
    } finally {
        await connection.end();
    }
}

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
