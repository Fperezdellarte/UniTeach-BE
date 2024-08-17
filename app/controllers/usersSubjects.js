const { httpError } = require("../helpers/handleError");
const { createUserSubject, deleteUserSubject, getUserSubjects } = require('../models/usersSubjectsModels');

const createUserSubjectController = async (req, res) => {
    try {
        const userSubjectData = req.body;
        const result = await createUserSubject(userSubjectData);
        res.status(201).json({ message: "Relación usuario-materia creada correctamente", userSubject: result });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteUserSubjectController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const subjectId = req.params.subjectId;
        const result = await deleteUserSubject(userId, subjectId);
        res.status(200).json({ message: "Relación usuario-materia eliminada correctamente", userSubject: result });
    } catch (error) {
        httpError(res, error);
    }
}

const getUserSubjectsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const results = await getUserSubjects(userId);
        res.status(200).json({userSubjects: results });
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { createUserSubjectController, deleteUserSubjectController, getUserSubjectsController };

