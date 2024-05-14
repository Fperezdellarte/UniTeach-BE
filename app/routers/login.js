const router = require ("express").Router();
const { login } = require("../controllers/login");
const {jsonResponse} = require("../lib/jsonResponse");




router.post("/", async (req ,res)=>{
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

module.exports = router;