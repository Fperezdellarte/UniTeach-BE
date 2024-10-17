const searchModels= require('../models/searchModels');

const searchMentors = async (req, res) => {
    try {
        const { subjectName, university } = req.query;
        if (!subjectName || !university) {
            return res.status(400).json({ error: 'Debe proporcionar el nombre de la materia y la universidad.' });
        }

        const results = await searchModels.searchMentors(subjectName, university);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = { searchMentors };
