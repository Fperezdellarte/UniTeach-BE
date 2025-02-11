const httpError = (res, error, statusCode = 500) => {
  const message = typeof error === "string" ? error : error.message;
  console.log(message);
  res
    .status(statusCode)
    .json({ message: message || "Error interno del servidor" });
};

module.exports = { httpError };
