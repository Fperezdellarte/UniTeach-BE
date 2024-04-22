const { httpError } = require("../helpers/handleError");
const { createClass , getAllClasses, modifyClass, deleteClass, getClassById } = require('../models/classesModels'); 

const getClasses = async (req, res) => {
    try {
        getAllClasses((err, classes) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(200).json({ classes });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const getClass = async (req, res) => {
    try {
        const classId = req.params.id;

        getClassById(classId, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ class: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const createClassController = async (req, res) => {
    try {
        const classData = req.body;
        
        createClass(classData, (err, result) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(201).json({ message: "Clase creada correctamente", class: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const updateClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const classData = req.body;

        modifyClass(classId, classData, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ message: "Clase actualizada correctamente", class: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteClassController = async (req, res) => {
    try {
        const classId = req.params.id;

        deleteClass(classId, (err, result) => {
            if (err) {
                httpError(res, err); 
            } else {
                res.status(200).json({ message: "Clase eliminada correctamente", class: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { getClasses, getClass, createClassController, updateClass, deleteClassController };
