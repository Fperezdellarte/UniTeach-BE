const express = require("express");
const { getCareers } = require("../controllers/careers");

const router = express.Router();

router.get("/", getCareers);

module.exports = router;