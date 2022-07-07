const express = require('express');

const { check, body, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../modules/dbManager').item_DAO;
const skuDB = require('../modules/dbManager').sku_positionDAO;
const userDB = require('../modules/dbManager').user_DAO;

const ItemService = require('../services/item_service');

const item_service = new ItemService(db, skuDB, userDB);

// ITEM APIs ----------------------------------------------------------------------

// GET /api/items
router.get('/items', async (req, res) => {

    const result = await item_service.getItems();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error" });
        default:
            return res.status(200).json(result);
    }

});


// GET /api/items/:id/:supplierid
router.get('/items/:id/:supplierid',
    [check('id').notEmpty().isNumeric().isInt({ min: 0 })],
    [check('supplierid').notEmpty().isNumeric().isInt({ min: 0 })],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation of id failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        const result = await item_service.getItemsById(req.params.id, req.params.supplierid );

        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/item
router.post('/item',
    body('id').isInt({ min: 0 }),
    body('description').isString().isLength({ max: 255 }),
    body('price').isFloat({ min: 0 }),
    body('SKUId').isInt({ min: 0 }),
    body('supplierId').isInt({ min: 0 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        if (Object.keys(req.body).length !== 5) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        const result = await item_service.setItem(req.body.id, req.body.description, req.body.price, req.body.SKUId, req.body.supplierId);

        switch (result) {
            case "c404":
                return res.status(404).json({ error: "Not Found" });
            case "c422":
                return res.status(422).json({ error: "Unprocessable Entity" });
            case "c503":
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(201).json(result);
        }

    });

// PUT /item/:id/:supplierid
router.put('/item/:id/:supplierid',
    [check('id').notEmpty().isInt({ min: 0 })],
    [check('supplierid').notEmpty().isInt({ min: 0 })],
    body('newDescription').isString().isLength({ max: 255 }),
    body('newPrice').isFloat({ min: 0 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.newDescription && req.body.newPrice)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        const result = await item_service.modifyItem(req.params.id, req.params.supplierid, req.body.newDescription, req.body.newPrice);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(200).end();
        }

    });

// DELETE /items/:id/:supplierid
router.delete('/items/:id/:supplierid',
    [check('id').notEmpty().isNumeric().isInt({ min: 0 })],
    [check('supplierid').notEmpty().isNumeric().isInt({ min: 0 })],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        const result = await item_service.deleteItem(req.params.id, req.params.supplierid);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(204).end();
        }

    });

// DELETE /api/allItems
router.delete('/allItems', async (req, res) => {

    const result = await item_service.deleteAllItems();

    switch (result) {
        case 503:
            return res.status(503).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

module.exports = router;