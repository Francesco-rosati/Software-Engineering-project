const express = require('express');

const { check, body, validationResult } = require('express-validator');

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const router = express.Router();
const db = require('../modules/dbManager').ReturnOrder_DAO;
const restockorderTable = require("../modules/dbManager").RestockOrder_DAO;
const skuTable = require('../modules/dbManager').sku_positionDAO;

const ReturnOrderService = require('../services/ReturnOrder_service');

const returnOrder_service = new ReturnOrderService(db, skuTable, restockorderTable );

// RETURN ORDERS APIs ----------------------------------------------------------------------

// GET /api/returnOrders

router.get('/returnOrders', async (req, res) => {
    
  
    const result = await returnOrder_service.getReturnOrder();

    switch (result) {
    case 500:
        return res.status(500).json({ error: "Internal Server Error!" });
    default:
        return res.status(200).json(result);
    }
    
});
  
  
  //GET /api/returnOrders/:id
  router.get('/returnOrders/:id', [check('id').notEmpty().isInt({ min: 1 })], async (req, res) => {
   
  
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of id failed!");
        return res.status(422).json({ error: "Validation of id failed" });
    }

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }
  
    const result = await returnOrder_service.getReturnOrderById(req.params.id);
    const result1= {
        returnDate: result.returnDate,
        products: result.products,
        restockOrderId: result.restockOrderId
    }
    switch (result) {
        case 404:
            return res.status(404).json({ error: "Not Found" });
        case 422:
            return res.status(422).json({ error: "Unprocessable Entity" });
        case 500:
            return res.status(500).json({ error: "Internal Server Error" });
        default:
            return res.status(200).json(result1);
    }

});
  
  
  //POST /api/returnOrder
  router.post('/returnOrder', 
  body('returnDate').isString(),
  body('restockOrderId').isInt({ min: 1 }),
  body('products').isArray(),	
  body('products.*.SKUId').isInt({ min: 1 }),
  body('products.*.description').isString(),
  body('products.*.price').isFloat(),
  body('products.*.RFID').isNumeric().isLength({ min: 32, max: 32 }),

  async (req, res) => {
  
    const errors = validationResult(req);

    if (Object.keys(req.body).length === 0) {
        console.log("Empty body!");
        return res.status(422).json({ error: "Empty body request" });
    }
    if (!(dayjs(req.body.returnDate, ['YYYY/MM/DD', 'YYYY/MM/DD HH:mm'], true).isValid())) {
        console.log("Invalid date");
        return res.status(422).json({ error: "Unprocessable Entity" });
    }

    if (Object.keys(req.body).length !== 3 || !(req.body.returnDate && req.body.products && req.body.restockOrderId)) {
        console.log("Data not formatted properly!");
        return res.status(422).json({ error: "Data not formatted properly" });
    }

    if (!errors.isEmpty()) {
        console.log("Validation of request body failed!");
        return res.status(422).json({ errors: errors.array() });
    }
  
    const result = await returnOrder_service.setReturnOrder(req.body.returnDate, req.body.products, req.body.restockOrderId);

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
  
  
  // DELETE /api/returnOrder/:id
router.delete('/returnOrder/:id',
[check('id').notEmpty().isInt({ min: 1 })],
    async (req, res) => {
  
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation of id failed!");
            return res.status(422).json({ errors: errors.array() })
        }

        if (!req.params) {
            return res.status(422).json({ error: "Empty parameter request" });
        }
    

    const result = await returnOrder_service.deleteReturnOrder(req.params.id);
    
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

// DELETE /api/allReturnOrder
router.delete('/allReturnOrder', async (req, res) => {

    const result = await returnOrder_service.deleteAllReturnOrder();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

module.exports = router;