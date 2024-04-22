const express = require('express');
const { getInscription, getInscriptions, createInscriptionController, deleteInscriptionController } = require('../controllers/inscription');

const router = express.Router();

router.get('/', getInscriptions);

router.get('/:id', getInscription);

router.post('/', createInscriptionController);

router.delete('/:id', deleteInscriptionController);

module.exports = router;
