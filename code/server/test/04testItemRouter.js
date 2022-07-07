const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test item apis', () => {

    emptyItemTable(200);

    getAllItems(200, 0);

    //Testing POST /api/item
    newItem(201, 12, "a new item1", 10.99, 1, 8);
    newItem(422, 13, "a new item2", 15.99, 1, 8);
    newItem(201, 14, "a new item3", 11.99, 2, 8);
    newItem(404, 21, "a new item", 10.99, 5, 8);
    newItem(201, 32, "a new item", 10.99, 2, 45);
    newItem(422, 15, 433, 10.99, 1, 8);
    newItem(422, 12, "", 10.99, 1, 8);
    newItem(422, 12, "", 10.99, "sku", 8);
    newItem(422, "", "", "", "", "");

    getAllItems(200, 3);

    //Testing GET /api/items/:id
    getItem(200, 12, "a new item1", 10.99, 1, 8);
    getItem(404, 56, "a new item1", 10.99, 1, 8);
    getItem(200, 12, "a new item1", 10.99, 1, 8);
    getItem(422, "id", "a new item1", 10.99, 1, 8);

    //Testing PUT /api/item/:id
    modifyItem(200,12,"a new SKU",15.99, 8);
    modifyItem(422,"id","a new SKU",15.99, 7);
    modifyItem(200,12,"a new SKU",17, 8);
    modifyItem(404,45,"a new SKU",15.99, 7);
    modifyItem(422,12,"","",8);
    modifyItem(422,12,"a new SKU","",8);
    modifyItem(422,12,"",15.99,8);
    modifyItem(422,12,"a new SKU","number",8);
    modifyItem(422,12,432,15.99,8);

    //Testing DELETE /api/items/:id
    deleteItem(204,12,8);
    getAllItems(200,2);
    deleteItem(422,"id",8);
    deleteItem(422,"id_err",8);
    deleteItem(404,12,8);

});

function emptyItemTable(expectedHTTPStatus) {
    it('delete all data from the item table', function (done) {
        agent.delete('/api/allItems')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function newItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('adding a new item', function (done) {
        let item = { id: id, description: (description !== "" ? description : undefined), price: (price !== "" ? price : undefined), SKUId: (SKUId !== "" ? SKUId : undefined), supplierId: (supplierId !== "" ? supplierId : undefined) }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getAllItems(expectedHTTPStatus, number) {
    it('getting all items from the item table', function (done) {
        agent.get('/api/items')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 500) {
                    done();
                }
                Object.keys(r.body).length.should.equal(number);
                done();
            });
    });
}

function getItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('getting item data from the db', function (done) {
        agent.get('/api/items/' + id + '/' + supplierId)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 404 || r.status === 422 || r.status === 500) {
                    done();
                }
                r.body.id.should.equal(id);
                r.body.description.should.equal(description);
                r.body.price.should.equal(price);
                r.body.SKUId.should.equal(SKUId);
                r.body.supplierId.should.equal(supplierId);
                done();
            });
    });
}

function modifyItem(expectedHTTPStatus, id, newDescription, newPrice, supplierId) {
    it('modify item', function (done) {
        let modItem = { newDescription: (newDescription !== "" ? newDescription : undefined), newPrice: (newPrice !== "" ? newPrice : undefined) };

        agent.put('/api/item/' + id + '/' + supplierId)
            .send(modItem)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function deleteItem(expectedHTTPStatus, id, supplierId) {
    it('delete an item from the db', function (done) {
        agent.delete('/api/items/' + id + '/' + supplierId)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}