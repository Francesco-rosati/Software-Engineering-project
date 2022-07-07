const express = require('express');

const { check, body, validationResult } = require('express-validator');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const router = express.Router();
const db = require('../modules/dbManager').RestockOrder_DAO;
const skuTable = require('../modules/dbManager').sku_positionDAO;

const RestockOrderService = require('../services/RestockOrder_service');

const restockOrder_service = new RestockOrderService(db, skuTable);

// RESTOCK ORDERS APIs ----------------------------------------------------------------------

//GET /api/restockOrders
router.get('/restockOrders', async (req, res) => {
    
    const result = await restockOrder_service.getRestockOrder();
  
    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }
  });
  
  
// GET /api/restockOrdersIssued
router.get('/restockOrdersIssued', async (req, res) => {
  
    const result = await restockOrder_service.getRestockOrderIssued();
   
    const result1=  result.map(item => ({
        id: item.id,
        issueDate: item.issueDate,
        state: item.state,
        products: item.products,
        supplierId: item.supplierId,
        skuItems: item.skuItems,
        })
    );
      switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result1);
    }
});
  
// GET /api/restockOrders/:id
router.get('/restockOrders/:id',[check('id').notEmpty().isInt({ min: 1 })] ,async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Validation of id failed!");
        return res.status(422).json({ error: "Validation of id failed" });
    }

    if (!req.params) {
        console.log("Error in request parameters!");
        return res.status(422).json({ error: "Error in request parameters" });
    }
    
   
    const result = await restockOrder_service.getRestockOrderById(req.params.id);
    const result1= {
        issueDate: result.issueDate,
        state: result.state,
        products: result.products,
        supplierId: result.supplierId,
        transportNote: result.transportNote,
        skuItems: result.skuItems,
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
  
//GET /api/restockOrders/:id/returnItems
router.get('/restockOrders/:id/returnItems',[check('id').notEmpty().isInt({ min: 1 })], async (req, res) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation of id failed!");
            return res.status(422).json({ error: "Validation of id failed" });
        }

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        const result = await restockOrder_service.getRestockOrderReturnItemsById(req.params.id);
      
       
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
  
//POST /api/restockOrder
router.post('/restockOrder', 
    body('issueDate').isString(),
        body('supplierId').isInt({ min: 1 }),
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
    
        if (Object.keys(req.body).length !== 3 || !(req.body.issueDate && req.body.products && req.body.supplierId)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body failed!");
            return res.status(422).json({ errors: errors.array() });
        }
        
        const result = await restockOrder_service.setRestockOrder(req.body.issueDate, req.body.products, req.body.supplierId);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "No sku associated to SKUId!" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(201).json(result);
        }
    });
  
  
// PUT /api/restockOrder/:id
router.put('/restockOrder/:id', 
[check('id').notEmpty().isInt({ min: 1 })],
body('newState').isString(),
    async (req, res) => {
        
        const errors = validationResult(req);

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length === 0 ) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (!(req.body.newState) ) {
          console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body or id failed!");
            return res.status(422).json({ error: "Validation of request body or id failed" });
        }

        const result = await restockOrder_service.modifyRestockOrderState(req.body.newState, req.params.id);
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






// PUT /api/restockOrder/:id/skuItems
router.put('/restockOrder/:id/skuItems', 
[check('id').notEmpty().isInt({ min: 1 })],
body('skuItems').isArray(),
body('products.*.SkuID').isInt({ min: 1 }),
body('products.*.RFID').isNumeric().isLength({ min: 32, max: 32 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length === 0 ) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (!(req.body.skuItems) ) {
          console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body or id failed!");
            return res.status(422).json({ error: "Validation of request body or id failed" });
        }

        const result = await restockOrder_service.modifyRestockOrderSKUItemsById(req.body.skuItems, req.params.id);
         
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
  
  
// PUT /api/restockOrder/:id/transportNote
router.put('/restockOrder/:id/transportNote', 
[check('id').notEmpty().isInt({ min: 1 })],
async (req, res) => {
  
    const errors = validationResult(req);

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length === 0 ) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (!(req.body.transportNote) ) {
          console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Validation of request body or id failed!");
            return res.status(422).json({ error: "Validation of request body or id failed" });
        }
     

        const result = await restockOrder_service.modifyRestockOrderTransportNote(req.body.transportNote, req.params.id);
        
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
  
//DELETE /api/restockOrder/:id

router.delete('/restockOrder/:id', 
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
  
    const result= await restockOrder_service.deleteRestockOrder(req.params.id);
    
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

// DELETE /api/allRestockOrder
router.delete('/allRestockOrder', async (req, res) => {

    const result = await restockOrder_service.deleteAllRestockOrder();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});
  
module.exports = router;