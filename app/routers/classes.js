const express = require('express');
const { getClass, getClassesMentor, getClasses, updateClass, deleteClassController, createClassController } = require('../controllers/classes');
const router = express.Router();

router.get('/', getClasses);

router.get('/mentorclass/:id',getClassesMentor)

router.get('/:id', getClass);

router.post('/', createClassController);

router.patch('/:id', updateClass);

router.delete('/:id', deleteClassController);

module.exports = router;
