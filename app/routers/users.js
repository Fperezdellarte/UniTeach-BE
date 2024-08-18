const express = require ('express')
const { getUser, getUsers, updateUser, deleteUserController, createUserController, login } = require('../controllers/users')
const {isAdmin} = require ('../middleware/authentication')
const router = express.Router()

router.get('/',isAdmin, getUsers)

router.get('/:id',getUser)

router.post('/',isAdmin, createUserController)

router.patch('/:id',updateUser)

router.delete('/:id',deleteUserController)

router.post("/login",login)

router.post("/signup", createUserController)


module.exports = router