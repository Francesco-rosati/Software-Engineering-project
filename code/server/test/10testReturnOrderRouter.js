const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Return Orders apis', () => {

    emptyReturnOrderTable(200);

     // TEST /POST api for Return Orders
    newReturnOrder(201, "2021/11/29 09:33", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
    {"SKUId":2, "itemId":11,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}], 2);
    newReturnOrder(201, "2021/11/29 09:33", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
    {"SKUId":2, "itemId":11,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}], 2);
    //no body
    newReturnOrder(422);
    //wrong restock order id
    newReturnOrder(404, "2021/11/29 09:33", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
    {"SKUId":2, "itemId":11,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}], 100);

    // TEST /GET api for Return Orders
    getReturnOrderbyId(200, 1, "2021/11/29 09:33", 2);

    getAllReturnOrders(200);

    deleteReturnOrder(204, 2);
});

//DELETE
function emptyReturnOrderTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allReturnOrder')
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
function newReturnOrder(expectedHTTPStatus, returnDate, products, restockOrderId) {
    it('adding a new Return Order', function (done) {
        if (returnDate !== undefined && products !== undefined && restockOrderId !== undefined  ) {
            let Returnorder = { returnDate: returnDate, products: products, restockOrderId: restockOrderId }
            agent.post('/api/returnOrder')
                .send(Returnorder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/returnOrder') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

//GET by id
function getReturnOrderbyId(expectedHTTPStatus, id, returnDate, customerId) {
    it('getting Return Orders by id ', function (done) {
        agent.get('/api/returnOrders/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 404 || r.status === 422 || r.status === 500) {
                    done();
                }
                r.body.returnDate.should.equal(returnDate);
            
                done();
            });
    });
}

//GET all
function getAllReturnOrders(expectedHTTPStatus) {
    it('getting all Return Orders from the system', function (done) {
        agent.get('/api/returnOrders')
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

//DELETE + GET
function deleteReturnOrder(expectedHTTPStatus, id) {
    it('delete a ReturnOrder from the system', function (done) {
        agent.delete('/api/returnOrder/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/returnOrders/' + id)
            .then(function (r) {
                r.should.have.status(404);
                done();
            });
    });
}
