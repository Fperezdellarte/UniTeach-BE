const express = require ('express')
const { getUser,getMentor, getUsers, updateUser, deleteUserController, createUserController, login, logout, ratingUser} = require('../controllers/users')
const {authentication} = require ('../middleware/authentication')
const { imageLoad } = require('../middleware/multer')
const router = express.Router()

router.get('/', getUsers)

router.post("/logout",authentication, logout)

router.post("/login",login)

router.post("/signup",imageLoad, createUserController)

router.post("/rating/:id",authentication, ratingUser)

router.post('/', createUserController)

router.get('/:id',authentication, getUser)

router.get('/mentor/:id', authentication ,getMentor)

router.patch('/:id',authentication, imageLoad, updateUser)

router.delete('/:id', deleteUserController)





module.exports = router