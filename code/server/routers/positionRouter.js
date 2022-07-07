const express = require('express');
const bcrypt = require("bcrypt");

const { check, body, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../modules/dbManager').sku_positionDAO;

const PositionService = require('../services/position_service.js');

const position_service = new PositionService(db);

// GET /api/positions
router.get('/positions', async (req, res) => {

    const result = await position_service.getPositions();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }

});


// POST /api/position
router.post('/position',
    body('positionID').isString().isLength({ min:12, max:12 }),
    body('aisleID').isString().isLength({ max:20 }),
    body('row').isString().isLength({ max:20 }),
    body('col').isString().isLength({ max:20 }),
    body('maxWeight').isInt({ min:0 }), 
    body('maxVolume').isInt({ min:0 }),
async (req, res) => {

    const errors = validationResult(req);

    if (Object.keys(req.body).length === 0) {
        console.log("Empty body!");
        return res.status(422).json({ error: "Empty Body" });
    }

    if (Object.keys(req.body).length !== 6 && Object.keys(req.body).length !== 8) {
        console.log("Data not formatted properly!");
        return res.status(422).json({ error: "Data not formatted properly" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in body!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await position_service.createPosition(req.body);

    switch (result) {
        case "c503":
            return res.status(503).json({ error: "Service Unavailable!" });
        default:
            return res.status(201).json(result);
    }

});

// PUT /api/position/:positionID
router.put('/position/:positionID',
    [check('positionID').isString().isLength({ min:12, max:12 }),
    body('newAisleID').isString().isLength({max:40}),
    body('newRow').isString().isLength({max:40}),
    body('newCol').isString().isLength({max:40}),
    body('newMaxWeight').isInt({ min: 1 }),
    body('newMaxVolume').isInt({ min: 1 }),
    body('newOccupiedWeight').isInt({ min: 1 }),
    body('newOccupiedVolume').isInt({ min: 1 })
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

        if (Object.keys(req.body).length !== 7 || !(req.body.newAisleID && req.body.newRow && req.body.newCol && 
                req.body.newMaxWeight && req.body.newMaxVolume && req.body.newOccupiedWeight && req.body.newOccupiedVolume)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await position_service.modifyPosition(req.body, req.params.positionID);

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


// PUT /api/position/:positionID/changeID
router.put('/position/:positionID/changeID',
    [check('positionID').isString().isLength({ min:12, max:12 }),
    body('newPositionID').isString().isLength({ min:12, max:12 })
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

    if (Object.keys(req.body).length !== 1 || !(req.body.newPositionID)) {
        console.log("Data not formatted properly!");
        return res.status(422).json({ error: "Data not formatted properly" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in body!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await position_service.modifyPosID(req.body, req.params.positionID);

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

// DELETE /api/position/:positionID
router.delete('/position/:positionID', 
    [check('positionID').isString().isLength({ min:12, max:12 })],
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

    const result = await position_service.deletePosition(req.params.positionID);

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


// DELETE /api/allPositions
router.delete('/allPositions', 
    async (req, res) => {   

    const result = await position_service.deleteAllPositions();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});


/*
// POST /api/position
app.post('/api/position', body('positionID').isString(), body('aisleID').isString(),
  body('row').isString(), body('col').isString(),
  body('maxWeight').isInt({ min: 0 }), body('maxVolume').isInt({ min: 0 }), async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation of request body failed!");
      return res.status(422).end();
    }

    if (Object.keys(req.body).length === 0) {
      console.log("Empty body!");
      return res.status(422).end();
    }

    try {
      let position = req.body;

      await db3.newPositionTable();
      db3.storePosition(position);
      return res.status(201).end();
    }
    catch (err) {
      console.log("Generic error!");
      return res.status(503).end();
    }

  });

// GET /api/positions
app.get('/api/positions', async (req, res) => {
  try {
    const positions = await db3.getStoredPositions();
    return res.status(200).json(positions);
  } catch (err) {
    return res.status(500).end();
  }
});

// PUT /api/position/:positionID
app.put('/api/position/:positionID', [check('positionID').notEmpty().isString()], body('newAisleID').isString(),
  body('newRow').isString(), body('newCol').isString(),
  body('newMaxWeight').isInt({ min: 0 }), body('newMaxVolume').isInt({ min: 0 }),
  body('newOccupiedWeight').isInt({ min: 0 }), body('newOccupiedVolume').isInt({ min: 0 }), async (req, res) => {

    let position = await db3.getPositionById(req.params.positionID);
    if (position === undefined) {
      console.log("No position associated to positionID!");
      return res.status(404).end();
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation of request body or of positionID failed!");
      return res.status(422).end();
    }

    if (Object.keys(req.body).length === 0) {
      console.log("Empty body!");
      return res.status(422).end();
    }

    try {
      const position = await db3.modifyPosition(req.body, req.params.positionID);
      return res.status(200).json(position);
    } catch (err) {
      return res.status(503).end();
    }

  });

// PUT /api/position/:positionID/changeID
app.put('/api/position/:positionID/changeID', [check('positionID').notEmpty().isString()],
  body('newPositionID').isString(), async (req, res) => {

    let position = await db3.getPositionById(req.params.positionID);
    if (position === undefined) {
      console.log("No position associated to positionID!");
      return res.status(404).end();
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation of request body or of positionID failed!");
      return res.status(422).end();
    }

    if (Object.keys(req.body).length === 0) {
      console.log("Empty body!");
      return res.status(422).end();
    }

    try {
      const position = await db3.modifyPositionID(req.body, req.params.positionID);
      return res.status(200).json(position);
    } catch (err) {
      return res.status(503).end();
    }

  });


// DELETE /api/position/:positionID
app.delete('/api/position/:positionID', [check('positionID').notEmpty().isString()], async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Validation of positionID failed!");
    return res.status(422).end();
  }

  if (!req.params) {
    console.log("Error in request parameters!");
    return res.status(422).end();
  }

  try {
    const item = await db3.deletePosition(req.params.positionID);
    return res.status(204).json(item);
  } catch (err) {
    return res.status(503).end();
  }

});
*/

module.exports = router;