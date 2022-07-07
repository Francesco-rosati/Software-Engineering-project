const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Internal Orders apis', () => {

    emptyInternalOrderTable(200);

     // TEST /POST api for Internal Orders
    newInternalOrder(201, "2021/11/29 09:33", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},
    {"SKUId":2,"description":"another product","price":11.99,"qty":3}], 1);
    newInternalOrder(201, "2021/11/29 09:33", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},
    {"SKUId":2,"description":"another product","price":11.99,"qty":3}], 1);
    
    //no body
    newInternalOrder(422);

    // TEST /GET api for Internal Orders
    getInternalOrderbyId(200, 1, "2021/11/29 09:33", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},
    {"SKUId":2,"description":"another product","price":11.99,"qty":3}], 1);
    //wrong internalorderid
    getInternalOrderbyId(404, 50, "2021/11/29 09:33", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1);

    getAllInternalOrders(200);

    getIssuedInternalOrders(200);

    modifyInternalOrder(200, 1, "ACCEPTED");
    getAcceptedInternalOrders(200);

    modifyInternalOrder(200, 1, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);
    //wrong internalorderid 
    modifyInternalOrder(404, 6, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);

    deleteInternalOrder(204, 2)
});

//DELETE
function emptyInternalOrderTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allInternalOrder')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}

//POST
function newInternalOrder(expectedHTTPStatus, issueDate, products, customerId) {
    it('adding a new Internal Order', function (done) {
        if (issueDate !== undefined && products !== undefined && customerId !== undefined  ) {
            let Internalorder = { issueDate: issueDate, products: products, customerId: customerId }
            agent.post('/api/internalOrders')
                .send(Internalorder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/internalOrders') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

//GET by id
function getInternalOrderbyId(expectedHTTPStatus, id, issueDate, products, customerId) {
    it('getting Internal Orders by id ', function (done) {
        agent.get('/api/internalOrders/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 404 || r.status === 422 || r.status === 500) {
                    done();
                }
                r.body.id.should.equal(id);
                r.body.issueDate.should.equal(issueDate);
                r.body.state.should.equal("ISSUED");
                r.body.customerId.should.equal(customerId);
                done();
            });
    });
}

//GET all
function getAllInternalOrders(expectedHTTPStatus) {
    it('getting all Internal Orders from the system', function (done) {
        agent.get('/api/internalOrders')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                Object.keys(r.body).length.should.equal(2);
                done();
            });
    });
}

//GET issued
function getIssuedInternalOrders(expectedHTTPStatus) {
    it('getting all issued Orders from the system', function (done) {
        agent.get('/api/internalOrdersIssued')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                Object.keys(r.body).length.should.equal(2);
                done();
            });
    });
}
//GET accepted
function getAcceptedInternalOrders(expectedHTTPStatus) {
    it('getting all Accepted Internal Orders from the system', function (done) {
        agent.get('/api/internalOrdersAccepted')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                Object.keys(r.body).length.should.equal(1);
                done();
            });
    });
}


// PUT + GET
function modifyInternalOrder(expectedHTTPStatus, id, newState, products) {
    it('modify Internal Order', function (done) {
        let modInternalOrder = { newState: newState, products: products};
        agent.put('/api/internalOrders/' + id)
            .send(modInternalOrder)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/InternalOrders/' + id)
            .then(function (r) {
                r.body.id.should.equal(id);
                r.body.state.should.equal(newState);
                if(products!==undefined){
                    r.body.products.should.equal(products);
                }
                done();
            });
    });
}

//DELETE + GET
function deleteInternalOrder(expectedHTTPStatus, id) {
    it('delete a InternalOrder from the system', function (done) {
        agent.delete('/api/internalOrders/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/internalOrders/' + id)
            .then(function (r) {
                r.should.have.status(404);
                done();
            });
    });
}
