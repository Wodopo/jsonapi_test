const router = require('express').Router();
const City = require('../models/city');

router.get('/', async (req, res, next) => {
    try {
        const cities = await City.getAll();
        res.send(cities);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const city = await City.getById(id);
        res.send(city);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
