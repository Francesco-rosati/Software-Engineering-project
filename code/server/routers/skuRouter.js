const express = require('express');
const bcrypt = require("bcrypt");

const { check, body, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../modules/dbManager').sku_positionDAO;

const SkuService = require('../services/sku_service.js');

const sku_service = new SkuService(db);

// GET /api/skus
router.get('/skus', async (req, res) => {

    const result = await sku_service.getSkus();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }

});

// GET /api/skus/:id
router.get('/skus/:id', 
    [check('id').notEmpty().isInt({ min: 1 })],
    async (req, res) => {

    const errors = validationResult(req);
  
    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in body!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await sku_service.getSkuById(req.params.id);
  
    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        case 404:
            return res.status(404).json({ error: "No sku associated to id!" });
        default:
            return res.status(200).json(result);
    }
  });


// POST /api/sku
router.post('/sku',
    body('description').isString().isLength({ max:20 }),
    body('weight').isInt({ min:1 }), 
    body('volume').isInt({ min:1 }),
    body('notes').isString().isLength({ max:20 }),
    body('price').isFloat({ min:0.1 }), 
    body('availableQuantity').isInt({ min:0 }),
async (req, res) => {

    const errors = validationResult(req);

    if (Object.keys(req.body).length === 0) {
        console.log("Empty body!");
        return res.status(422).json({ error: "Empty Body" });
    }

    if (Object.keys(req.body).length !== 6 || !(req.body.description && req.body.weight && req.body.volume
            && req.body.notes && req.body.price && req.body.availableQuantity)) {
        console.log("Data not formatted properly!");
        return res.status(422).json({ error: "Data not formatted properly" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in body!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await sku_service.createSku(req.body);

    switch (result) {
        case "c503":
            return res.status(503).json({ error: "Service Unavailable!" });
        default:
            return res.status(201).json(result);
    }

});

// PUT /api/sku/:id
router.put('/sku/:id',
    [check('id').notEmpty().isInt({ min: 1 }),
    body('newDescription').isString().isLength({max:40}),
    body('newVolume').isInt({ min: 1 }),
    body('newWeight').isInt({ min: 1 }),
    body('newNotes').isString().isLength({max:40}),
    body('newPrice').isFloat({ min: 1 }),
    body('newAvailableQuantity').isInt({ min: 1 })
    ],  async (req, res) => {

        const errors = validationResult(req);

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 6 || !(req.body.newDescription && req.body.newVolume && req.body.newWeight && 
                req.body.newNotes && req.body.newPrice && req.body.newAvailableQuantity)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await sku_service.modifySku(req.body, req.params.id);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not found" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(200).end();
        }

    });


// PUT /api/sku/:id/position
router.put('/sku/:id/position',
[check('id').notEmpty().isInt({ min: 1 }),
body('position').isString().isLength({ min:12, max:12 })
],  async (req, res) => {

    const errors = validationResult(req);

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    if (Object.keys(req.body).length === 0) {
        console.log("Empty body!");
        return res.status(422).json({ error: "Empty Body" });
    }

    if (Object.keys(req.body).length !== 1 || !(req.body.position)) {
        console.log("Data not formatted properly!");
        return res.status(422).json({ error: "Data not formatted properly" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in body!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await sku_service.modifySkuPosition(req.body.position, req.params.id);

    switch (result) {
        case 404:
            return res.status(404).json({ error: "Not found" });
        case 422:
            return res.status(422).json({ error: "Unprocessable Entity" });
        case 503:
            return res.status(503).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

// DELETE /api/skus/:id
router.delete('/skus/:id', 
    [check('id').notEmpty().isInt({ min: 0 })],  
    async (req, res) => {   

    const errors = validationResult(req);

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in request!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await sku_service.deleteSku(req.params.id);

    switch (result) {
        case 404:
            return res.status(404).json({ error: "Not found" });
        case 422:
            return res.status(422).json({ error: "Unprocessable Entity" });
        case 503:
            return res.status(503).json({ error: "Service Unavailable" });
        default:
            return res.status(204).end();
    }

});

// DELETE /api/allSkus
router.delete('/allSkus', 
    async (req, res) => {   

    const result = await sku_service.deleteAllSkus();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }
});

module.exports = router;
