const { httpError } = require("../helpers/handleError");
const { createSubject, getAllSubjects, modifySubject, deleteSubject, getSubjectById } = require('../models/subjectsModels');

const getSubjects = async (req, res) =>{
    try {
        getAllSubjects((err, subjects) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(200).json({ subjects });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const getSubject = async (req, res) =>{
    try {
        const subjectId = req.params.id;

        getSubjectById(subjectId, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ subject: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const createSubjectController = async (req, res) => {
    try {
        const subjectData = req.body;
        
        createSubject(subjectData, (err, result) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(201).json({ message: "Materia creada correctamente", subject: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const updateSubject = async (req, res) =>{
    try {
        const subjectId = req.params.id;
        const subjectData = req.body;

        modifySubject(subjectId, subjectData, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ message: "Materia actualizada correctamente", subject: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteSubjectController = async (req, res) =>{
    try {
        const subjectId = req.params.id;

        deleteSubject(subjectId, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ message: "Materia eliminada correctamente", subject: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { getSubjects, getSubject, createSubjectController, updateSubject, deleteSubjectController };
