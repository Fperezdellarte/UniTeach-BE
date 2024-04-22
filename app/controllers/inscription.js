const { httpError } = require("../helpers/handleError");
const { createInscription, getAllInscriptions, deleteInscription, getInscriptionById } = require('../models/inscriptionsModels');

const getInscriptions = async (req, res) => {
    try {
        getAllInscriptions((err, inscriptions) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(200).json({ inscriptions });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const getInscription = async (req, res) => {
    try {
        const inscriptionId = req.params.id;

        getInscriptionById(inscriptionId, (err, result) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(200).json({ inscription: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const createInscriptionController = async (req, res) => {
    try {
        const inscriptionData = req.body;

        createInscription(inscriptionData, (err, result) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(201).json({ message: "Inscripción creada correctamente", inscription: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

const deleteInscriptionController = async (req, res) => {
    try {
        const inscriptionId = req.params.id;

        deleteInscription(inscriptionId, (err, result) => {
            if (err) {
                httpError(res, err);
            } else {
                res.status(200).json({ message: "Inscripción eliminada correctamente", inscription: result });
            }
        });
    } catch (error) {
        httpError(res, error);
    }
}

module.exports = { getInscriptions, getInscription, createInscriptionController, deleteInscriptionController };
