const express = require('express');

const { check, body, validationResult } = require('express-validator');

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const router = express.Router();
const db = require('../modules/dbManager').InternalOrder_DAO;
const skuTable = require('../modules/dbManager').sku_positionDAO;

const InternalOrderService = require('../services/InternalOrder_service');

const internalOrder_service = new InternalOrderService(db, skuTable);



// INTERNAL ORDERS APIs ----------------------------------------------------------------------

// GET /api/internalOrders
router.get('/internalOrders', async (req, res) => {


    const result = await internalOrder_service.getInternalOrders();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }
});


// GET /api/internalOrdersIssued
router.get('/internalOrdersIssued', async (req, res) => {


    const result = await internalOrder_service.getInternalOrdersIssued();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }
});


// GET /api/internalOrdersAccepted
router.get('/internalOrdersAccepted', async (req, res) => {

    const result = await internalOrder_service.getInternalOrdersAccepted();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }
});


// GET /api/internalOrders/:id
router.get('/internalOrders/:id', [check('id').notEmpty().isInt({ min: 1 })], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of id failed!");
        return res.status(422).json({ error: "Validation of id failed" });
    }

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }

    const result = await internalOrder_service.getInternalOrdersById(req.params.id);

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


// POST /api/internalOrders
router.post('/internalOrders',
    body('issueDate').isString(),
    body('customerId').isInt({ min: 1 }),
    body('products').isArray(),	
    body('products.*.SKUId').isInt({ min: 1 }),
    body('products.*.description').isString(),
    body('products.*.price').isFloat(),
    body('products.*.qty').isInt({ min: 1 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty body request" });
        }
        if (!(dayjs(req.body.issueDate, ['YYYY/MM/DD', 'YYYY/MM/DD HH:mm'], true).isValid())) {
            console.log("Invalid date");
            return res.status(422).json({ error: "Unprocessable Entity" });
        }

        if (Object.keys(req.body).length !== 3 || !(req.body.issueDate && req.body.products && req.body.customerId)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await internalOrder_service.setInternalOrder(req.body.issueDate, req.body.products, req.body.customerId);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not Found" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(201).json(result);
        }

    });


// PUT /api/internalOrders/:id
router.put('/internalOrders/:id',
    [check('id').notEmpty().isInt({ min: 1 })],
    body('newState').isString(),
    // body('products').isArray(),	
    // body('products.*.SkuID').isInt({ min: 1 }),
    // body('products.*.RFID').isNumeric().isLength({ min: 32, max: 32 }),
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

        if (Object.keys(req.body).length !== 1 && Object.keys(req.body).length !== 2) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body or id failed!");
            return res.status(422).json({ error: "Validation of request body or id failed" });
        }

        //If only newState has been passed, then check it
        if (Object.keys(req.body).length === 1) {
            if (!(req.body.newState)) {
                console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
            }

        const result= await internalOrder_service.modifyInternalOrder(req.body.newState, req.body.products, req.params.id);  
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
        }
        //If newState and products has been passed, then check both
        if (Object.keys(req.body).length === 2) {
            if (!(req.body.newState) && !(req.body.products)) {
                console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
            }

        const result= await internalOrder_service.modifyInternalOrder(req.body.newState, req.body.products, req.params.id);  
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
        }
    });

//DELETE /api/internalOrders/:id
router.delete('/internalOrders/:id', [check('id').notEmpty().isInt({ min: 1 })],async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of id failed!");
        return res.status(422).json({ errors: errors.array() })
    }

    if (!req.params) {
        return res.status(422).json({ error: "Empty parameter request" });
    }

    const result = await internalOrder_service.deleteInternalOrder(req.params.id);

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



// DELETE /api/allInternalOrder
router.delete('/allInternalOrder', async (req, res) => {

    const result = await internalOrder_service.deleteAllInternalOrder();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

module.exports = router;