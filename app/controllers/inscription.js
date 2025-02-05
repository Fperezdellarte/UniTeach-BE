const { httpError } = require("../helpers/handleError");
const {
  createInscription,
  getAllInscriptions,
  deleteInscription,
  getInscriptionById,
  getInscriptionByUserId,
} = require("../models/inscriptionsModels");

const createInscriptionController = async (req, res) => {
  try {
    const inscriptionData = req.body;
    const result = await createInscription(inscriptionData);
    res
      .status(201)
      .json({
        message: "Inscripción creada correctamente",
        inscription: result,
      });
  } catch (error) {
    httpError(res, error);
  }
};

const getInscriptions = async (req, res) => {
  try {
    const inscriptions = await getAllInscriptions();
    res.status(200).json({ inscriptions });
  } catch (error) {
    httpError(res, error);
  }
};

const getInscriptionByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const inscription = await getInscriptionByUserId(userId);
    if (inscription) {
      res.status(200).json({ inscription });
    } else {
      res.status(404).json({ message: "No tienes inscripciones" });
    }
  } catch (error) {
    httpError(res, error);
  }
};

const getInscription = async (req, res) => {
  try {
    const userId = req.params.id;
    const inscription = await getInscriptionById(userId);
    if (inscription) {
      res.status(200).json({ inscription });
    } else {
      res.status(404).json({ message: "Inscripción no encontrada" });
    }
  } catch (error) {
    httpError(res, error);
  }
};

const deleteInscriptionController = async (req, res) => {
  try {
    const inscriptionId = req.params.id;
    const result = await deleteInscription(inscriptionId);
    res
      .status(200)
      .json({
        message: "Inscripción eliminada correctamente",
        inscription: result,
      });
  } catch (error) {
    httpError(res, error);
  }
};

module.exports = {
  getInscriptions,
  getInscription,
  createInscriptionController,
  deleteInscriptionController,
  getInscriptionByUser,
};
