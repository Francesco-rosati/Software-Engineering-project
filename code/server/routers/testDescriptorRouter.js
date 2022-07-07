const express = require('express');

const { check, body, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../modules/dbManager').test_DAO;
const dbPos = require('../modules/dbManager').sku_positionDAO;

const TestDescriptorService = require('../services/testDescriptor_service');

const testDescriptor_service = new TestDescriptorService(db, dbPos);

// TEST DESCRIPTOR APIs ----------------------------------------------------------------------

// GET /api/testDescriptors
router.get('/testDescriptors', async (req, res) => {

    const result = await testDescriptor_service.getTestDescriptors();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error" });
        default:
            return res.status(200).json(result);
    }

});

// GET /api/testDescriptors/:id
router.get('/testDescriptors/:id', [check('id').notEmpty().isInt({ min: 1 })], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of id failed!");
        return res.status(422).json({ errors: errors.array() });
    }

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    const result = await testDescriptor_service.getTestDescriptorById(req.params.id);

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

// POST /api/testDescriptor
router.post('/testDescriptor',
    body('name').isString().isLength({ max: 255 }),
    body('procedureDescription').isString().isLength({ max: 255 }),
    body('idSKU').isInt({ min: 1 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 3 || !(req.body.name && req.body.procedureDescription && req.body.idSKU)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await testDescriptor_service.setTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);

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


// PUT /api/testDescriptor/:id
router.put('/testDescriptor/:id', [check('id').notEmpty().isInt({ min: 1 })],
    body('newName').isString().isLength({ max: 255 }),
    body('newProcedureDescription').isString().isLength({ max: 255 }),
    body('newIdSKU').isInt({ min: 1 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 3 || !(req.body.newName && req.body.newProcedureDescription && req.body.newIdSKU)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body or of failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await testDescriptor_service.modifyTestDescriptor(req.params.id, req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU);

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

// DELETE /api/testDescriptor/:id
router.delete('/testDescriptor/:id', [check('id').notEmpty().isInt({ min: 1 })], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of id failed!");
        return res.status(422).json({ errors: errors.array() })
    }

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    const result = await testDescriptor_service.deleteTestDescriptor(req.params.id);

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

// DELETE /api/allTestDescriptors
router.delete('/allTestDescriptors', async (req, res) => {

    const result = await testDescriptor_service.deleteAllTestDescriptors();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

module.exports = router;