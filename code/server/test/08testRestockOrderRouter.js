const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test Restock Orders apis', () => {

    emptyRestockOrderTable(200);

     // TEST /POST api for Restock Orders
    newRestockOrder(201,"2021/11/29", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2, "itemId":12,"description":"another product","price":11.99,"qty":20}], 1);
    newRestockOrder(201,"2021/11/29", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2, "itemId":11,"description":"another product","price":11.99,"qty":20}], 1);

    //no body
    newRestockOrder(422);

    // TEST /GET api for Restock Orders
    getRestockOrder(200, 2,"2021/11/29", "ISSUED", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99,"qty":30},{"SKUId":2, "itemId":10,"description":"another product","price":11.99,"qty":20}], 1);
    //wrong RestockOrderid
    getRestockOrder(404, 50, "2021/11/29", [{"SKUId":1, "itemId":10,"description":"a product","price":10.99,"qty":3},
    {"SKUId":180, "itemId":10,"description":"another product","price":11.99,"qty":3}], 1);

    getAllRestockOrders(200);

    getIssuedRestockOrders(200);
    
    modifyRestockOrderStateById(200, 1, "COMPLETED");
     
    modifyRestockOrderSKUItemsById(200, 2, [{"SKUId":1,  "itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":2, "itemId":11,"rfid":"12345678901234567890123456789017"}]);
    getRestockOrderReturnItemsById(200, 2, [{"SKUId":1, "itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":2, "itemId":11,"rfid":"12345678901234567890123456789017"}]);

    modifyRestockOrderStateById(200, 1, "DELIVERY");
    modifyTransportNoteById(200, 1, {"deliveryDate":"2023/12/29"});

    deleteRestockOrder(204, 1)
});

//DELETE
function emptyRestockOrderTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allRestockOrder')
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
function newRestockOrder(expectedHTTPStatus, issueDate, products, supplierId) {
    it('adding a new Restock Order', function (done) {
        if (issueDate !== undefined && products !== undefined && supplierId !== undefined ) {
            let RestockOrder = { issueDate: issueDate, products: products, supplierId: supplierId }
            agent.post('/api/restockOrder')
                .send(RestockOrder)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/restockOrder') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

//GET by id
function getRestockOrder(expectedHTTPStatus, id, issueDate, state, products, supplierId) {
    it('getting Restock Orders by id data from the system', function (done) {
                agent.get('/api/restockOrders/' + id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        if(r.status === 404) {
                        done();
                    }
                    if(r.status === 422) {
                        done();
                    }
                    if(r.status === 500) {
                        done();
                    }
                        
                        r.body.issueDate.should.equal(issueDate);
                        r.body.state.should.equal(state);
                        r.body.supplierId.should.equal(supplierId);
                        done();
                    });
            });
}

//GET all
function getAllRestockOrders(expectedHTTPStatus) {
    it('getting all Restock Orders from the system', function (done) {
        agent.get('/api/restockOrders')
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
function getIssuedRestockOrders(expectedHTTPStatus) {
    it('getting all issued Orders from the system', function (done) {
        agent.get('/api/restockOrdersIssued')
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

//GET /api/restockOrders/:id/returnItems
function getRestockOrderReturnItemsById(expectedHTTPStatus, id, skuitems) {
    it('getting return items of Restock Order by id', function (done) {
                agent.get('/api/restockOrders/' + id + '/returnItems')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        if(r.status === 404) {
                        done();
                    }
                    if(r.status === 422) {
                        done();
                    }
                    if(r.status === 500) {
                        done();
                    }
                    Object.keys(r.body).length.should.equal(1);
                        done();
                    });
            });
}

// PUT state+ GET
function modifyRestockOrderStateById(expectedHTTPStatus, id, newState) {
    it('modify Restock Order State by id', function (done) {
        let modRestockOrder = {newState: newState};
        agent.put('/api/restockOrder/' + id )

            .send(modRestockOrder)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/restockOrders/' + id)
            .then(function (r) {
                r.body.id.should.equal(id);
                r.body.state.should.equal(newState);
                done();
            });
    });
}
        
// PUT SkuItems + GET
function modifyRestockOrderSKUItemsById(expectedHTTPStatus, id, skuItems) {
    it('modify Restock Order SKUItems by id', function (done) {
        let modRestockOrder = { skuItems: skuItems};
        agent.put('/api/restockOrder/' + id + '/skuItems')
            .send(modRestockOrder)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/restockOrders/' + id)
            .then(function (r) {
                r.body.id.should.equal(id);
                done();
            });
    });
}

// PUT TransportNote + GET
function modifyTransportNoteById(expectedHTTPStatus, id, transportNote) {
    it('modify Restock Order Transportnote by id', function (done) {
        let modRestockOrder = {transportNote: transportNote};
        agent.put('/api/restockOrder/' + id + '/transportNote')
            .send(modRestockOrder)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/restockOrders/' + id)
            .then(function (r) {
                r.body.id.should.equal(id);
                r.body.transportNote.should.equal(transportNote);
                done();
            });
    });
}



//DELETE + GET
function deleteRestockOrder(expectedHTTPStatus, id) {
    it('delete a Restock Order from the system', function (done) {
        agent.delete('/api/restockOrder/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/restockOrders/' + id)
            .then(function (r) {
                r.should.have.status(404);
                done();
            });
    });
}
