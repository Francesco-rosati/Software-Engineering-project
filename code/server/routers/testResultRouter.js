const express = require('express');

const { check, body, validationResult } = require('express-validator');

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const router = express.Router();
const db = require('../modules/dbManager').test_DAO;
const skuItems = require("../modules/dbManager").item_DAO;

const TestResultService = require('../services/testResult_service');

const testResult_service = new TestResultService(db, skuItems);

// TEST RESULT APIs ----------------------------------------------------------------------

// GET /api/skuitems/:rfid/testResults
router.get('/skuitems/:rfid/testResults', [check('rfid').isNumeric().isLength({ min: 32, max: 32 })], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of rfid failed!");
        return res.status(422).json({ errors: errors.array() });
    }

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    const result = await testResult_service.getTestResults(req.params.rfid);

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

// GET /api/skuitems/:rfid/testResults/:id
router.get('/skuitems/:rfid/testResults/:id',
    [check('rfid').isNumeric().isLength({ min: 32, max: 32 })],
    [check('id').notEmpty().isInt({ min: 1 })],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation of id or of rfid failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        const result = await testResult_service.getTestResultsById(req.params.rfid, req.params.id);

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

// POST /api/skuitems/testResult
router.post('/skuitems/testResult',
    body('rfid').isNumeric().isLength({ min: 32, max: 32 }),
    body('idTestDescriptor').isInt({ min: 1 }),
    body('Date').isString(),
    body('Result').isBoolean(),
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }
        if (!(dayjs(req.body.Date, ['YYYY/MM/DD'], true).isValid())) {
            console.log("Invalid date");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }

        if (Object.keys(req.body).length !== 4 || (!(req.body.rfid && req.body.idTestDescriptor && req.body.Date) && req.body.Result !== "")) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await testResult_service.setTestResult(req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result);

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



// PUT /api/skuitems/:rfid/testResult/:id
router.put('/skuitems/:rfid/testResult/:id',
    [check('rfid').isNumeric().isLength({ min: 32, max: 32 })],
    [check('id').notEmpty().isInt({ min: 1 })],
    body('newIdTestDescriptor').isInt({ min: 1 }),
    body('newDate').isString(),
    body('newResult').isBoolean(),
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }
        if (!(dayjs(req.body.newDate, ['YYYY/MM/DD'], true).isValid())) {
            console.log("Invalid date");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length !== 3 || (!(req.body.newIdTestDescriptor && req.body.newDate) && req.body.newResult !== "")) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body, of id or of rfid failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await testResult_service.modifyTestResult(req.body.newIdTestDescriptor, req.body.newDate, req.body.newResult, req.params.id, req.params.rfid);

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

// DELETE /api/skuitems/:rfid/testResult/:id
router.delete('/skuitems/:rfid/testResult/:id',
    [check('rfid').isNumeric().isLength({ min: 32, max: 32 })],
    [check('id').notEmpty().isInt({ min: 1 })],
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

        const result = await testResult_service.deleteTestResult(req.params.id,req.params.rfid);

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


// DELETE /api/allTestResults
router.delete('/allTestResults',
async (req, res) => {

    const result = await testResult_service.deleteAllTestResults();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

module.exports = router;