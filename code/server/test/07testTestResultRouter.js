const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test test Result apis', () => {

    emptyTestResultTable(200);

    // TEST /POST api for Test Result
    newTestResult(201, "12345678901234567890123456789011", 1, "2021/11/28", true);
    newTestResult(201, "12345678901234567890123456789011", 3, "2021/11/28", true);
    newTestResult(201, "12345678901234567890123456789022", 3, "2021/11/28", true);
    newTestResult(201, "12345678901234567890123456789022", 1, "2020/04/03", false);
    newTestResult(404, "12345678901234567890123456789222", 1, "2021/11/28", true);
    newTestResult(404, "12345678901234567890123456789011", 55, "2021/11/28", true);
    newTestResult(422);
    newTestResult(422, "1234", 1, "2021/11/28", true);
    newTestResult(422, "12345678901234567890123456789011", "abc", "2021/11/28", true);

    // TEST /GET api for Test Result
    getTestResult(200,  1, "12345678901234567890123456789011", 1, "2021/11/28", true);
    getTestResult(404,  44, "12345678901234567890123456789011", 1, "2021/11/28", true);
    getTestResult(404,  1, "12345678901234567890123456789888", 1, "2021/11/28", true);
    getTestResult(422,  "asd", "12345678901234567890123456789011", 1, "2021/11/28", true);
    getTestResult(422,  1, "123", 1, "2021/11/28", true);

    getSomeTestResult(200, "12345678901234567890123456789011");
    getSomeTestResult(404, "12345678901234567890123456789333");
    getSomeTestResult(422, "12345");

    // TEST /PUT api for Test Result
    modifyTestResult(200, 1, "12345678901234567890123456789011", 3, "2021/11/11", false);
    modifyTestResult(404, 1, "12345678901234567890123456789222", 3, "2021/11/11", false);
    modifyTestResult(404, 1, "12345678901234567890123456789011", 55, "2021/11/11", false);
    modifyTestResult(404, 44, "12345678901234567890123456789011", 55, "2021/11/11", false);
    modifyTestResult(422, 1);
    modifyTestResult(422, "acd", "12345678901234567890123456789011", 3, "2021/11/11", false);
    modifyTestResult(422, 1, "1234", 3, "2021/11/11", false);

    // TEST /DELETE api for Test Result
    deleteTestResult(204, 4, "12345678901234567890123456789013");
    deleteTestResult(422, "asd", "12345678901234567890123456789013");
    deleteTestResult(422, 4, "1234");
});

function emptyTestResultTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allTestResults')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}

function newTestResult(expectedHTTPStatus, rfid, idTestDescriptor, Date, Result) {
    it('adding a new test result', function (done) {
        if (rfid !== undefined) {
            let testResult = { rfid: rfid, idTestDescriptor: idTestDescriptor, Date: Date, Result: Result }
            agent.post('/api/skuitems/testResult')
                .send(testResult)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/skuitems/testResult')
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

// GET /api/skuitems/:rfid/testResults/:id
function getTestResult(expectedHTTPStatus, id, rfid, idTestDescriptor, Date, Result) {
    it('getting a test result from the system', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 404 || r.status == 422) {
                    done();
                }
                
                r.body.id.should.equal(id);
                r.body.idTestDescriptor.should.equal(idTestDescriptor);
                r.body.Date.should.equal(Date);
                r.body.Result.should.equal(Result);
                done();
            });
    });
}

// GET /api/skuitems/:rfid/testResults
function getSomeTestResult(expectedHTTPStatus, rfid) {
    it('getting all test results from the system', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500 || r.status === 404 || r.status === 422) {
                    done();
                }
                Object.keys(r.body).length.should.equal(2);  
                done();
            });
    });
}

// PUT /api/skuitems/:rfid/testResult/:id
function modifyTestResult(expectedHTTPStatus, id, rfid, newIdTestDescriptor, newDate, newResult) {
    it('modify Test Result', function (done) {
        let modTestResult = { newIdTestDescriptor: newIdTestDescriptor, newDate: newDate, newResult: newResult };
        agent.put('/api/skuitems/' + rfid + '/testResult/' + id)
            .send(modTestResult)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                r.body.id.should.equal(id);
                r.body.idTestDescriptor.should.equal(newIdTestDescriptor);
                r.body.Date.should.equal(newDate);
                r.body.Result.should.equal(newResult);
                done();
            });
    });
}


// DELETE /api/skuitems/:rfid/testResult/:id
function deleteTestResult(expectedHTTPStatus, id, rfid) {
    it('delete a test result from the system', function (done) {
        agent.delete('/api/skuitems/' + rfid + '/testResult/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/skuitems/' + rfid + '/testResults/' + id)
            .then(function (r) {
                r.should.have.status(404);
                done();
            });
    });
}
