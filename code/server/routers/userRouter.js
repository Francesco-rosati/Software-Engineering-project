const express = require('express');
const bcrypt = require("bcrypt");

const { check, body, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../modules/dbManager').user_DAO;

const UserService = require('../services/user_service');

const user_service = new UserService(db);

// USER APIs ----------------------------------------------------------------------

// GET /api/suppliers
router.get('/suppliers', async (req, res) => {

    const result = await user_service.getSuppliers();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error!" });
        default:
            return res.status(200).json(result);
    }

});

// GET /api/users
router.get('/users', async (req, res) => {

    const result = await user_service.getUsers();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "Internal Server Error" });
        default:
            return res.status(200).json(result);
    }

});

// POST /api/newUser
router.post('/newUser',
    body('username').isEmail(),
    body('password').isAlphanumeric().isLength({ min: 8 }),
    body('name').isString().isLength({ max: 50 }),
    body('surname').isString().isLength({ max: 50 }),
    body('type').isAlpha().isLength({ max: 20 }),
    async (req, res) => {

        const errors = validationResult(req);
        let result = "";

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if(req.body.createM !== 1){
            if (Object.keys(req.body).length !== 5 || !(req.body.username && req.body.password && req.body.name && req.body.surname && req.body.type)) {
                console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
            }
    
            if (!errors.isEmpty()) {
                console.log("Error in body!");
                return res.status(422).json({ errors: errors.array() });
            }
    
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
    
            // now we set user password to hashed password
            const password = await bcrypt.hash(req.body.password, salt);
    
            if (password.length <= 200) {
                result = await user_service.setUser(req.body.username, req.body.name, req.body.surname, password, req.body.type);
            }
            else {
                result = "c422";
            }
        } else {
            if (Object.keys(req.body).length !== 6 || !(req.body.username && req.body.password && req.body.name && req.body.surname && req.body.type)) {
                console.log("Data not formatted properly!");
                return res.status(422).json({ error: "Data not formatted properly" });
            }
    
            if (!errors.isEmpty()) {
                console.log("Error in body!");
                return res.status(422).json({ errors: errors.array() });
            }
    
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
    
            // now we set user password to hashed password
            const password = await bcrypt.hash(req.body.password, salt);
    
            if (password.length <= 200) {
                result = await user_service.setManager(req.body.username, req.body.name, req.body.surname, password, req.body.type);
            }
            else {
                result = "c422";
            }

        }

        switch (result) {
            case "c409":
                return res.status(409).json({ error: "Conflict" });
            case "c422":
                return res.status(422).json({ error: "Unprocessable Entity" });
            case "c503":
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(201).json(result);
        }

    });

// POST /api/managerSessions
router.post('/managerSessions',
    [body('username').isEmail().isLength({ max: 50 }),
    body('password').isAlphanumeric().isLength({ min: 8 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.username && req.body.password)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.checkUser(req.body.username, req.body.password, "manager");

        switch (result) {
            case 401:
                return res.status(401).json({ error: "Unauthorized" })
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/customerSessions
router.post('/customerSessions',
    [body('username').isEmail().isLength({ max: 50 }),
    body('password').isAlphanumeric().isLength({ min: 8 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.username && req.body.password)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.checkUser(req.body.username, req.body.password, "customer");

        switch (result) {
            case 401:
                return res.status(401).json({ error: "Unauthorized" })
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/supplierSessions
router.post('/supplierSessions',
    [body('username').isEmail().isLength({ max: 50 }),
    body('password').isAlphanumeric().isLength({ min: 8 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.username && req.body.password)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.checkUser(req.body.username, req.body.password, "supplier");

        switch (result) {
            case 401:
                return res.status(401).json({ error: "Unauthorized" })
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/clerkSessions
router.post('/clerkSessions',
    [body('username').isEmail().isLength({ max: 50 }),
    body('password').isAlphanumeric().isLength({ min: 8 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.username && req.body.password)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.checkUser(req.body.username, req.body.password, "clerk");

        switch (result) {
            case 401:
                return res.status(401).json({ error: "Unauthorized" })
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/qualityEmployeeSessions
router.post('/qualityEmployeeSessions',
    [body('username').isEmail().isLength({ max: 50 }),
    body('password').isAlphanumeric().isLength({ min: 8 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.username && req.body.password)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.checkUser(req.body.username, req.body.password, "qualityEmployee");

        switch (result) {
            case 401:
                return res.status(401).json({ error: "Unauthorized" })
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/deliveryEmployeeSessions
router.post('/deliveryEmployeeSessions',
    [body('username').isEmail().isLength({ max: 50 }),
    body('password').isAlphanumeric().isLength({ min: 8 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.username && req.body.password)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.checkUser(req.body.username, req.body.password, "deliveryEmployee");

        switch (result) {
            case 401:
                return res.status(401).json({ error: "Unauthorized" })
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 500:
                return res.status(500).json({ error: "Internal Server Error" });
            default:
                return res.status(200).json(result);
        }

    });

// PUT /api/users/:username
router.put('/users/:username',
    [check('username').isEmail().isLength({ max: 50 }),
    body('oldType').isAlpha().isLength({ max: 20 }),
    body('newType').isAlpha().isLength({ max: 20 })
    ], async (req, res) => {

        const errors = validationResult(req);

        if (!req.params) {
            console.log("Error in request parameters!");
            return res.status(422).json({ error: "Error in request parameters" });
        }

        if (Object.keys(req.body).length === 0) {
            console.log("Empty body!");
            return res.status(422).json({ error: "Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !(req.body.oldType && req.body.newType)) {
            console.log("Data not formatted properly!");
            return res.status(422).json({ error: "Data not formatted properly" });
        }

        if (!errors.isEmpty()) {
            console.log("Error in body!");
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await user_service.modifyUser(req.params.username, req.body.oldType, req.body.newType);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "Not found" });
            case 409:
                return res.status(409).json({ error: "Conflict" });
            case 422:
                return res.status(422).json({ error: "Unprocessable Entity" });
            case 503:
                return res.status(503).json({ error: "Service Unavailable" });
            default:
                return res.status(200).end();
        }

    });

// DELETE /api/users/:username/:type
router.delete('/users/:username/:type', [check('username').isEmail().isLength({ max: 50 }), check('type').isAlpha().isLength({ max: 20 })], async (req, res) => {

    const errors = validationResult(req);

    if (!req.params.username) {
        console.log("Empty username parameter!");
        return res.status(422).json({ error: "Empty username parameter" });
    }
    if (!req.params.type) {
        console.log("Empty type parameter!");
        return res.status(422).json({ error: "Empty type parameter" });
    }

    if (!errors.isEmpty()) {
        console.log("Error in request!");
        return res.status(422).json({ errors: errors.array() });
    }

    const result = await user_service.deleteUser(req.params.username, req.params.type);

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

// DELETE /api/allUsers
router.delete('/allUsers', async (req, res) => {

    const result = await user_service.deleteAllUsers();

    switch (result) {
        case 503:
            return res.status(503).json({ error: "Service Unavailable" });
        default:
            return res.status(200).end();
    }

});

module.exports = router;
