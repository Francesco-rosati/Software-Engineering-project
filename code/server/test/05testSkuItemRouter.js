const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test skuitem apis', () => {
    emptySKUItemTable(200);

    getAllSKUItems(200, 0);

    newSKUItem(201, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    newSKUItem(422);
    newSKUItem(422, "1", 1, "2021/11/29 12:30");
    newSKUItem(404, "12345678901234567890123456789023", 32489, "2021/11/29 12:30");
    newSKUItem(409, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    newSKUItem(201, "12345678901234567890123456789013", 1);
    newSKUItem(201, "12345678901234567890123456789012", 1, "");
    newSKUItem(422, "12345678901234567890123456789015", undefined, "2021/11/29 12:30");
    newSKUItem(422);
    newSKUItem(422, "12345678901234567890123456789013", 1, "1234/013");
    newSKUItem(422, "we9f2438723483837fswf987sdf8df87", 1, "");
    newSKUItem(422, "12345678901234567890123456789013", 0, undefined);

    getAllSKUItems(200, 3);

    getSKUItemRFID(200, "12345678901234567890123456789015", 1, 0, "2021/11/29 12:30");
    getSKUItemRFID(404, "12390809123129381231232222123123", 1, 0, "");
    getSKUItemRFID(422, "we9f2438723483837fswf987sdf8df87", 1, 0, "2022/01/31");
    getSKUItemRFID(422, "1", 1, 0, "");
    getSKUItemRFID(422);

    modifySKUItem(200, "12345678901234567890123456789000", 1, undefined, "12345678901234567890123456789015");
    modifySKUItem(200, "12345678901234567890123456789011", 0, "2022/01/31", "12345678901234567890123456789013");
    modifySKUItem(200, "12345678901234567890123456789022", 1, "", "12345678901234567890123456789012");
    modifySKUItem(422, "1", 0, "", "12345678901234567890123456789013");
    modifySKUItem(422, "12345678901234567890123456789019", 0, null, "1");
    modifySKUItem(422, "12345678901234567890123456789017", 32, "", "12345678901234567890123456789013");
    modifySKUItem(422, "12345678901234567890123456789013", 1, "2022/01/31", undefined);
    modifySKUItem(422);
    modifySKUItem(422, "we9f2438723483837fswf987sdf8df87", 0, null, "12345678901234567890123456789000");
    modifySKUItem(422, "12345678901234567890123456789017", undefined, null, "12345678901234567890123456789015");
    modifySKUItem(422, "12345678901234567890123456789017", 1, "43324/43", "12345678901234567890123456789015");
    modifySKUItem(404, "12345678901234567890123456789012", 1, "2022/01/31", "12345678901234567890123456789099");
    modifySKUItem(422, "12345678901234567890123456789017", 1, "", "we9f2438723483837fswf987sdf8df87");
    modifySKUItem(409, "12345678901234567890123456789011", 1, "2022/01/31", "12345678901234567890123456789000");

    getAvailableSKUItems(200, 1, 2);
    getAvailableSKUItems(422,);
    getAvailableSKUItems(422, "one");
    getAvailableSKUItems(404, 13249);

    getSKUItemRFID(200, "12345678901234567890123456789022", 1, 1, "");

    deleteSKUItem(204, "12345678901234567890123456789000");
    getAllSKUItems(200, 2);
    deleteSKUItem(404, "12345678901234567890123456789000");
    deleteSKUItem(422, "1");
    deleteSKUItem(422, "we9f2438723483837fswf987sdf8df87");
    deleteSKUItem(422);
});

function emptySKUItemTable(expectedHTTPStatus) {
    it('delete all data from the skuitem table', function (done) {
        agent.delete('/api/allSKUItems')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function newSKUItem(expectedHTTPStatus, RFID, SKUId, DateOfStock) {
    it('adding a new skuitem', function (done) {
        let skuitem = { RFID : RFID, SKUId : SKUId, DateOfStock : DateOfStock }
        agent.post('/api/skuitem')
            .send(skuitem)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function getAllSKUItems(expectedHTTPStatus, number) {
    it('getting all skuitems from the skuitem table', function (done) {
        agent.get('/api/skuitems')
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

function getAvailableSKUItems(expectedHTTPStatus, SKUId, number) {
    it('getting available skuitems for one skuid', function (done) {
        agent.get('/api/skuitems/sku/' + SKUId)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 404 || r.status === 422 || r.status === 500) {
                    done();
                }
                Object.keys(r.body).length.should.equal(number);
                done();
            });
    });
}

function getSKUItemRFID(expectedHTTPStatus, RFID, SKUId, Available, DateOfStock) {
    it('getting skuitem matching rfid', function (done) {
        agent.get('/api/skuitems/' + RFID)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 404 || r.status === 422 || r.status === 500) {
                    done();
                }
                r.body.RFID.should.equal(RFID);
                r.body.SKUId.should.equal(SKUId);
                r.body.Available.should.equal(Available);
                r.body.DateOfStock.should.equal(DateOfStock);
                done();
            });
    });
}

function modifySKUItem(expectedHTTPStatus, newRFID, newAvailable, newDateOfStock, RFID) {
    it('modify skuitem', function (done) {
        let skuitem = { newRFID: newRFID, newAvailable: newAvailable, newDateOfStock: newDateOfStock };
        agent.put('/api/skuitems/' + RFID)
            .send(skuitem)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function deleteSKUItem(expectedHTTPStatus, RFID) {
    it('delete one skuitem from the db', function (done) {
        agent.delete('/api/skuitems/' + RFID)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}