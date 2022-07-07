const express = require('express');

const { check, body, validationResult } = require('express-validator');

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const router = express.Router();
const db = require('../modules/dbManager').item_DAO;
const sku = require("../modules/dbManager").sku_positionDAO;

const SKUItemService = require('../services/sku_item_service');

const SKUitem_service = new SKUItemService(db, sku);

// SKU ITEM APIs ----------------------------------------------------------------------

// GET /api/skuitems
router.get('/skuitems', async (req, res) => {
    const result = await SKUitem_service.getSKUItems();
    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error" });
        default:
            return res.status(200).json(result);
    }
});

// GET /api/skuitems/sku/:id
router.get('/skuitems/sku/:id',
    [check('id').notEmpty().isNumeric()],
    async (req, res) => {
        if (!req.params) {
            console.log("Empty parameter request");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Invalid parameter request");
            return res.status(422).json({ errors: errors.array() });
        }
        const result = await SKUitem_service.getAvSKUItems(req.params.id);
        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }
    });

// GET /api/skuitems/:rfid
router.get('/skuitems/:rfid',
    [check('rfid').isNumeric().isLength({ min: 32, max: 32 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!req.params) {
            console.log("Empty parameter request");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        if (!errors.isEmpty()) {
            console.log("Invalid parameter request");
            return res.status(422).json({ errors: errors.array() });
        }
        const result = await SKUitem_service.getSKUItemRFID(req.params.rfid);
        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }
    });

// POST /api/skuitem
router.post('/skuitem',
    [body('RFID').isNumeric().isLength({ min: 32, max: 32 }),
    body('SKUId').notEmpty().isInt({ min: 1 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty body request" });
        }
        if (Object.keys(req.body).length < 2) {
            console.log("Invalid body request");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        if ((req.body.DateOfStock !== null && req.body.DateOfStock !== undefined && req.body.DateOfStock !== "") &&
            !(dayjs(req.body.DateOfStock, ['YYYY/MM/DD', 'YYYY/MM/DD HH:mm'], true).isValid())) {
            console.log("Invalid date");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        if (!errors.isEmpty()) {
            console.log("Invalid body request");
            return res.status(422).json({ errors: errors.array() });
        }
        const result = await SKUitem_service.setSKUItem(req.body.RFID, req.body.SKUId, req.body.DateOfStock);
        switch (result) {
            case "c404":
                return res.status(404).json({ error: "Not Found" });
            case "c409":
                return res.status(409).json({ error: "Conflict" });
            case "c503":
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(201).end();
        }
    });

// PUT /api/skuitems/:rfid
router.put('/skuitems/:rfid',
    [check('rfid').isNumeric().isLength({ min: 32, max: 32 }),
    body('newRFID').isNumeric().isLength({ min: 32, max: 32 }),
    body('newAvailable').notEmpty().isIn([0, 1])],
    async (req, res) => {
        const errors = validationResult(req);
        if (!req.params) {
            console.log("Empty parameter request");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty body request" });
        }
        if (Object.keys(req.body).length < 2) {
            console.log("Invalid body request");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        if ((req.body.newDateOfStock !== null && req.body.newDateOfStock !== undefined && req.body.newDateOfStock !== "") &&
            !(dayjs(req.body.newDateOfStock, ['YYYY/MM/DD', 'YYYY/MM/DD HH:mm'], true).isValid())) {
            console.log("Invalid date");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }
        if (!errors.isEmpty()) {
            console.log("Invalid parameter/body request");
            return res.status(422).json({ errors: errors.array() });
        }
        const result = await SKUitem_service.modSKUItem(req.body.newRFID, req.body.newAvailable, req.body.newDateOfStock, req.params.rfid);
        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 409:
                return res.status(409).json({ error: "Conflict" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(200).end();
        }
    });

// DELETE /api/skuitems/:rfid
router.delete('/skuitems/:rfid',
    [check('rfid').isNumeric().isLength({ min: 32, max: 32 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!req.params) {
            console.log("Empty parameter request");
            return res.status(422).json({ error: "Empty parameter request" });
        }
        if (!errors.isEmpty()) {
            console.log("Invalid parameter request");
            return res.status(422).json({ errors: errors.array() });
        }
        const result = await SKUitem_service.delSKUItem(req.params.rfid);
        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(204).end();
        }
    });

    // DELETE /api/allSKUItems
    router.delete('/allSKUItems', async (req, res) => {
        const result = await SKUitem_service.deleteAllSKUItems();
        switch (result) {
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(200).end();
        }
    });

module.exports = router;