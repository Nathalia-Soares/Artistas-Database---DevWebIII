const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/artistas', (req, res) => {
    res.render("admin/artistas/artista");
});

module.exports = router;