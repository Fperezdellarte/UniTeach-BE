const express = require('express');
const { getSubject, getSubjects, updateSubject, deleteSubjectController, createSubjectController } = require('../controllers/subjects');
const router = express.Router();

router.get('/', getSubjects);

router.get('/:id', getSubject);

router.post('/', createSubjectController);

router.patch('/:id', updateSubject);

router.delete('/:id', deleteSubjectController);

module.exports = router;
