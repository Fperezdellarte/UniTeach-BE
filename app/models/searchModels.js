// src/models/searchModel.js
const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql'); // Asegúrate de tener configurado el archivo de conexión en config/mysql.js

const searchMentors = async (subjectName, university) => {
    const connection = dbConnect().promise();
    const query = `
  SELECT 
    u.idUser, 
    u.Name AS MentorName,
    u.AverageOpinion AS Opinion,
    s.Name AS SubjectName,
    u.University AS MentorUniversity,
    u.Avatar_URL,
    GROUP_CONCAT(CONCAT(c.hour, ', ', DATE_FORMAT(c.date, '%d-%m-%Y')) SEPARATOR '; ') AS ClassDetails
FROM 
    users u
JOIN 
    userssubjects us ON u.idUser = us.Users_idUser
JOIN 
    subjects s ON us.Subjects_idSubjects = s.idSubjects
JOIN 
    classes c ON c.Subjects_idSubjects = s.idSubjects 
             AND c.Users_idCreator = u.idUser
             AND c.expired = FALSE
WHERE 
    u.TypeOfUser IN ('MENTOR', 'AMBOS')
    AND s.Name LIKE ?
    AND s.University = ?
    AND u.University = ?
GROUP BY 
    u.idUser, u.Name, u.AverageOpinion, s.Name, u.University, u.Avatar_URL ;

    `;
    const values = [`%${subjectName}%`, university, university];

    try {
        const [rows] = await connection.query(query, values);
        console.log("Mentores obtenidos correctamente");
        return rows;
    } catch (err) {
        console.error("Error al buscar mentores:", err);
        throw err; // Lanza el error para manejo en el controlador
    } finally {
        connection.end(); // Asegura que la conexión se cierre
    }
};

module.exports = {
    searchMentors,
};
