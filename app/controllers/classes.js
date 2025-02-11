const { httpError } = require("../helpers/handleError");
const {
  createClass,
  getAllClasses,
  modifyClass,
  deleteClass,
  getClassById,
  getAllClassesOfMentor,
} = require("../models/classesModels");

const getClasses = async (req, res) => {
  try {
    const Clases = await getAllClasses();
    res.status(200).json({ Clases });
  } catch (error) {
    httpError(res, error);
  }
};
const getClassesMentor = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const subject = req.body.IdMateria
      ? parseInt(req.body.IdMateria, 10)
      : null;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const clases = await getAllClassesOfMentor(userId, subject);

    if (clases.activeClasses.length === 0 && clases.totalClasses === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron clases para el mentor" });
    } else if (clases.activeClasses.length === 0 && clases.totalClasses > 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron clases activas para el mentor" });
    }

    res.status(200).json(clases);
  } catch (error) {
    console.error("Error en getClassesMentor:", error);
    httpError(res, error);
  }
};
const getClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.user.id;

    const result = await getClassById(userId, classId);
    if (result) {
      res.status(200).json({ class: result });
    } else {
      res.status(404).json({ message: "Clase no encontrada" });
    }
  } catch (error) {
    httpError(res, error);
  }
};

const createClassController = async (req, res) => {
  try {
    const classData = req.body;
    const result = await createClass(classData);
    res
      .status(201)
      .json({ message: "Clase creada correctamente", class: result });
  } catch (error) {
    httpError(res, error);
  }
};

const updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = req.body;
    const result = await modifyClass(classId, classData);
    res
      .status(200)
      .json({ message: "Clase actualizada correctamente", class: result });
  } catch (error) {
    httpError(res, error);
  }
};

const deleteClassController = async (req, res) => {
  try {
    const classId = req.params.id;
    const result = await deleteClass(classId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Materia eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Materia no encontrada" });
    }
  } catch (error) {
    httpError(res, error);
  }
};

module.exports = {
  getClasses,
  getClass,
  createClassController,
  getClassesMentor,
  updateClass,
  deleteClassController,
};
