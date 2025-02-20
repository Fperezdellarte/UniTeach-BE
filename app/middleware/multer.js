const multer = require("multer");
const path = require("path");

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Asegúrate de que la carpeta existe
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const imageLoad = upload.single("Avatar_URL"); // Nombre del campo debe coincidir

module.exports = { imageLoad };
