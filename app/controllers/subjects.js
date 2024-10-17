const { httpError } = require("../helpers/handleError");
const { createSubject, getAllSubjects, modifySubject, deleteSubject, getSubjectById } = require('../models/subjectsModels');

const getSubjects = async (req, res) => {
    try {
        const subjects = await getAllSubjects();
        res.status(200).json({ subjects });
    } catch (error) {
        httpError(res, error);
    }
}

const getSubject = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const result = await getSubjectById(subjectId);
        if (result) {
            res.status(200).json({ subject: result });
        } else {
            res.status(404).json({ message: "Materia no encontrada" });
        }
    } catch (error) {
        httpError(res, error);
    }
}

const createSubjectController = async (req, res) => {
    try {
        const subjectData = req.body;
        const result = await createSubject(subjectData);
        res.status(201).json({ message: "Materia creada correctamente", subject: result });
    } catch (error) {
        httpError(res, error);
    }
}

const updateSubject = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const subjectData = req.body;
        const result = await modifySubject(subjectId, subjectData);
        res.status(200).json({ message: "Materia actualizada correctamente", subject: result });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteSubjectController = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const result = await deleteSubject(subjectId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Materia eliminada correctamente" });
        } else {
            res.status(404).json({ message: "Materia no encontrada" });
        }
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { getSubjects, getSubject, createSubjectController, updateSubject, deleteSubjectController };
