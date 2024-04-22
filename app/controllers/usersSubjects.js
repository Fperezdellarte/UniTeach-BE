const { httpError } = require("../helpers/handleError");
const { createUserSubject, deleteUserSubject, getUserSubjects } = require('../models/usersSubjectsModels');

const createUserSubjectController = async (req, res) => {
    try {
        const userSubjectData = req.body;
        
        createUserSubject(userSubjectData, (err, result) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(201).json({ message: "Relación usuario-materia creada correctamente", userSubject: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteUserSubjectController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const subjectId = req.params.subjectId;
    
        deleteUserSubject(userId, subjectId, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ message: "Relación usuario-materia eliminada correctamente", userSubject: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const getUserSubjectsController = async (req, res) => {
    try {
        const userId = req.params.userId;
    
        getUserSubjects(userId, (err, results) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ userSubjects: results });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { createUserSubjectController, deleteUserSubjectController, getUserSubjectsController };
