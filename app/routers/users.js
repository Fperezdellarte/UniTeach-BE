const express = require ('express')
const { getUser, getUsers, updateUser, deleteUserController, createUserController, login } = require('../controllers/users')
const router = express.Router()

router.get('/',getUsers)

router.get('/:id',getUser)

router.post('/',createUserController)

router.patch('/:id',updateUser)

router.delete('/:id',deleteUserController)

router.post("/login", async (req ,res)=>{
    const{ Username, Password} = req.body;
    if(!!!Username || !!!Password)
       {
        return res.status(400).json(jsonResponse(400,{
            error:"Complete ambos campos"
        })
    );
    }
    else{
        login(req, res);
    }
      ;
    
});

router.post("/signup", async (req ,res)=>{
    const{ Username, Name, Password, DNI,Legajo,TypeOfUser,Mail,University} = req.body;
    if(!!!Name|| !!!Username || !!!Password || !!!DNI || !!!Legajo || !!!TypeOfUser || !!!Mail || !!!University)
       {
        return res.status(400).json(jsonResponse(400,{
            error:"Fiels are required",
        })
    );
    }else{
        createUserController(req ,res); 
    }
    
} ,);


module.exports = router