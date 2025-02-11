const { httpError } = require("../helpers/handleError");
const { getAllCareers } = require("../models/careersModels");

const getCareers = async (req, res) => {
  try {
    const careers = await getAllCareers();
    res.status(200).json({ careers });
  } catch (error) {
    httpError(res, error);
  }
};

module.exports = { getCareers };