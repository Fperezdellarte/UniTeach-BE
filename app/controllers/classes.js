const { httpError } = require("../helpers/handleError");
const { createClass , getAllClasses, modifyClass, deleteClass, getClassById, getAllClassesOfMentor } = require('../models/classesModels'); 

const getClasses = async (req, res) => {
    try {
         const Clases = await getAllClasses();
         res.status(200).json({ Clases });
    
        } catch (error) {

        httpError(res, error);

        }
}
const getClassesMentor = async (req, res) => {
    try {
        const userId = req.params.id;
        const clases = await getAllClassesOfMentor(userId);
        if (clases) {
            res.status(200).json({ clases });
        } else {
            res.status(404).json({ message: "No podemos mostrar las clases" });
        }
    } catch (error) {
        httpError(res, error);
    }
};

const getClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const result = await getClassById(classId)
        if (result) {
            res.status(200).json({ class: result });
        } else {
            res.status(404).json({ message: "Clase no encontrada" });
        }
    } catch (error) {
        httpError(res, error);
    }
}

const createClassController = async (req, res) => {
    try {
        const classData = req.body;
        const result = await createClass(classData)
        res.status(201).json({ message: "Clase creada correctamente", class: result });
            }
     catch (error) {
        httpError(res, error);
    }
}

const updateClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const classData = req.body;
        const result = await modifyClass(classId, classData)
        res.status(200).json({ message: "Clase actualizada correctamente", class: result });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteClassController = async (req, res) => {
    try {
        const classId = req.params.id;
        const result = await deleteClass(classId)
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Materia eliminada correctamente" });
        } else {
            res.status(404).json({ message: "Materia no encontrada" });
        }
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { getClasses, getClass, createClassController,getClassesMentor, updateClass, deleteClassController };
