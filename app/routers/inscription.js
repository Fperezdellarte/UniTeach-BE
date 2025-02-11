const express = require("express");
const {
  getInscription,
  getInscriptions,
  createInscriptionController,
  deleteInscriptionController,
  getInscriptionByUser,
} = require("../controllers/inscription");
const { authentication, isAdmin } = require("../middleware/authentication");

const router = express.Router();

router.get("/", authentication, getInscriptions);

router.get("/myinscriptions", authentication, getInscriptionByUser);

router.get("/:id", isAdmin, getInscription);

router.post("/", authentication, createInscriptionController);

router.delete("/:id", authentication, deleteInscriptionController);

module.exports = router;
