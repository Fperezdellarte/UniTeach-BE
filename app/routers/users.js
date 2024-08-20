const express = require ('express')
const { getUser, getUsers, updateUser, deleteUserController, createUserController, login, logout} = require('../controllers/users')
const {authentication} = require ('../middleware/authentication')
const router = express.Router()

router.get('/', getUsers)

router.post("/logout",authentication, logout)

router.post("/login",login)

router.post("/signup", createUserController)

router.post('/', createUserController)

router.get('/:id',authentication, getUser)

router.patch('/:id',authentication, updateUser)

router.delete('/:id', deleteUserController)





module.exports = router