const express = require ('express')
const { getUser, getUsers, updateUser, deleteUserController, createUserController } = require('../controllers/users')
const router = express.Router()

router.get('/',getUsers)

router.get('/:id',getUser)

router.post('/',createUserController)

router.patch('/:id',updateUser)

router.delete('/:id',deleteUserController)

module.exports = router