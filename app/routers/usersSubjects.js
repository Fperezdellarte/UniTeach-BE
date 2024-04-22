const express = require('express');
const { createUserSubjectController, deleteUserSubjectController, getUserSubjectsController } = require('../controllers/usersSubjects');

const router = express.Router();

router.post('/', createUserSubjectController); // Ruta para crear una relación usuario-materia
router.delete('/:userId/:subjectId', deleteUserSubjectController); // Ruta para eliminar una relación usuario-materia
router.get('/:userId', getUserSubjectsController); // Ruta para obtener las materias vinculadas a un usuario

module.exports = router;
