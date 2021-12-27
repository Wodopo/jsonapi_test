const router = require('express').Router();
const People = require('../models/person');

router.get('/', async (req, res, next) => {
    try {
        const people = await People.getAll();
        res.send(people);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const person = await People.getById(id);
        res.send(person);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const person = await People.add(name, email);
        res.send(person);
    } catch (e) {
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const person = await People.update(id, name, email);
        res.send(person);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteCount = await People.delete(id);
        res.send({ message: `${deleteCount} entries deleted` });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
