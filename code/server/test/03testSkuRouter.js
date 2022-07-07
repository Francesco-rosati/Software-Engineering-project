const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test sku apis', () => {
    emptySkuTable(200);

    //Testing POST /api/sku
    newSku(201, "a new sku", 100, 50, "first SKU", 10.99, 50);
    newSku(201, "secondsku", 30, 10, "second SKU", 10.99, 10);
    newSku(201, "secondsku", 80, 40, "second SKU", 10.99, 30);
    newSku(422);

    //Testing GET /api/skus
    getSku(200, 1, "a new sku", 100, 50, "first SKU", 10.99, 50);
    getSku(404, 33, "a new sku", 100, 50, "first SKU", 10.99, 50);
    getSku(422, "ab", "a new sku", 100, 50, "first SKU", 10.99, 50);

    getAllSkus(200);

    //Testing DELETE /api/skus
    deleteSku(204, 3);
    deleteSku(422, "ab");

    //Testing PUT /api/skus
    modSkuPosition(200, 2, "700234543412");
    modSkuPosition(404, 50, "700234543412");
    modSkuPosition(404, 2, "550234543412");
    modSkuPosition(422, 1, "700234543412");


    modifySku(200, 1, "mod sku", 20, 30, "mod first SKU", 12.99, 45);
    modifySku(404, 34, "mod sku", 20, 30, "mod first SKU", 12.99, 45);
    modifySku(422, 1, 13, 20, 30, "mod first SKU", 12.99, "err");
    modifySku(422, 2, "mod sku", 200, 300, "mod first SKU", 12.99, 45); 
});

function emptySkuTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allSkus')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}

function newSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('adding a new sku', function (done) {
        if (description !== undefined) {
            let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/sku')
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function getSku(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {
    it('getting sku data from the system', function (done) {
        agent.get('/api/skus/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 401) {
                    done();
                }
                if(r.status === 404) {
                    done();
                }
                if(r.status === 422) {
                    done();
                }
                r.body.description.should.equal(description);
                r.body.weight.should.equal(weight);
                r.body.volume.should.equal(volume);
                r.body.notes.should.equal(notes);
                r.body.price.should.equal(price);
                r.body.availableQuantity.should.equal(availableQuantity);
                done();
            });
    });
}

function getAllSkus(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {
    it('getting all skus from the system', function (done) {
        agent.get('/api/skus/')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                Object.keys(r.body).length.should.equal(3);
                done();
            });
    });
}


function modifySku(expectedHTTPStatus, id, newDescription, newVolume, newWeight, newNotes, newPrice, newAvailableQuantity) {
    it('modify sku', function (done) {
        let modSku = { newDescription: newDescription, newVolume: newVolume, newWeight: newWeight, newNotes: newNotes, newPrice: newPrice, newAvailableQuantity: newAvailableQuantity };
        agent.put('/api/sku/' + id)
            .send(modSku)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/skus/' + id)
            .then(function (r) {
                r.body.description.should.equal(newDescription);
                r.body.weight.should.equal(weight);
                r.body.volume.should.equal(newWeight);
                r.body.notes.should.equal(newNotes);
                r.body.price.should.equal(newPrice);
                r.body.availableQuantity.should.equal(newAvailableQuantity);
                done();
            });
    });
}
function modSkuPosition(expectedHTTPStatus, id, position) {
    it('modify sku position', function (done) {
        let pos = { position: position };
        agent.put('/api/sku/' + id + '/position')
            .send(pos)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/skus/' + id)
            .then(function (r) {
                r.body.position.should.equal(position);
                done();
            });
    });
}



function deleteSku(expectedHTTPStatus, id) {
    it('delete a sku from the system', function (done) {
        agent.delete('/api/skus/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/skus/' + id)
            .then(function (r) {
                r.should.have.status(404);
                done();
            });
    });
}