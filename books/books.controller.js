const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const { uploadImg } = require('./book.service');
const bookService = require('./book.service');


// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create , uploadImg);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;


// route functions

function getAll(req, res, next) {
    bookService.getAll()
        .then(books => res.json(books))
        .catch(next);
}

function getById(req, res, next) {
    bookService.getById(req.params.id)
        .then(book => res.json(book))
        .catch(next);
}

function create(req, res, next) {
    bookService.create(req.body)
        .then(() => res.json({ message: 'Book created' }))
        .catch(next);
}

function update(req, res, next) {
    bookService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Book updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    bookService.delete(req.params.id)
        .then(() => res.json({ message: 'Book deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        description: Joi.string().empty(''),
        image: req.file.path, 
    });
    validateRequest(req, next, schema);
}
