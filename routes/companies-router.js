const router = require('express').Router();
const Company = require('../models/company');

router.get('/', async (req, res, next) => {
    try {
        const companies = await Company.getAll();
        res.send(companies);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const company = await Company.getById(id);
        res.send(company);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
