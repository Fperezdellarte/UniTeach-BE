const router = require ("express").Router();
const usernameExist = require("../services/userService");
const {jsonResponse} = require("../lib/jsonResponse");
const { createUserController } = require("../controllers/users");


router.post("/", async (req ,res)=>{
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

module.exports = router;