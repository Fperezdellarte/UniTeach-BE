const mysql = require('mysql2');
const { dbConnect } = require('../../config/mysql'); // Asegúrate de tener configurado el archivo de conexión en config/mysql.js

const searchMentors = async (subjectName, Facultad, University) => {
    const connection = dbConnect().promise();

    let query = `
    SELECT 
        u.idUser, 
        u.Name AS MentorName,
        u.AverageOpinion AS Opinion,
        s.Name AS SubjectName,
        s.idSubjects AS IdMateria,
        s.Facultad AS Facultad,
        s.Id_Facultad AS IdFacultad,
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
    `;

    let values = [`%${subjectName}%`];

    // Si Facultad es proporcionado, añadirlo a la consulta
    if (Facultad) {
        query += ' AND s.Facultad IN (?)';
        values.push(Facultad);
    } else {
        // Si no se pasa Facultad, se hace una consulta adicional para obtenerla
        const query2 = "SELECT Facultad FROM subjects WHERE Name = ?";
        try {
            const [facultadResult] = await connection.query(query2, [subjectName]);
            // Asignamos el valor de Facultad si la consulta lo devuelve
            if (facultadResult.length > 0) {
                Facultad = facultadResult[0].Facultad;
                query += ' AND s.Facultad IN (?)';
                values.push(Facultad);
            }
        } catch (err) {
            console.error('Error al obtener Facultad:', err);
            throw err;
        }
    }

    query += `
    GROUP BY 
        u.idUser, u.Name, u.AverageOpinion, s.Name, s.idSubjects, s.Facultad, s.Id_Facultad, u.University, u.Avatar_URL
    ORDER BY 
        CASE 
            WHEN u.University = ? THEN 1
            ELSE 2
        END,
        u.AverageOpinion DESC;
    `;

    values.push(University);

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
