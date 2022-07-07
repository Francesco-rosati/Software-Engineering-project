const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test testDescriptor apis', () => {

    emptyTestDescriptorTable(200);

    // TEST /POST api for Test Descriptor
    newTestDescriptor(201, "Test 1", "Description test 1", 1);
    newTestDescriptor(201, "Test 2", "Description test 2", 1);
    newTestDescriptor(201, "Test 3", "Description test 3", 2);
    newTestDescriptor(404, "Test 1", "Description test 1", 67);
    newTestDescriptor(422);

    // TEST /GET api for Test Descriptor
    getTestDescriptor(200, 1, "Test 1", "Description test 1", 1);
    getTestDescriptor(404, 50, "Test 50", "Description test 50", 2)
    getTestDescriptor(422, "abx", "Test 50", "Description test 50", 2);

    getAllTestDescriptors(200);

    // TEST /PUT api for Test Descriptor
    modifyTestDescriptor(200, 2, "Test 2 Mod", "Description test 2 mod", 1);
    modifyTestDescriptor(404, 2, "Test 2 Mod", "Description test 2 mod", 55);
    modifyTestDescriptor(404, 33, "Test 2 Mod", "Description test 2 mod", 1);
    modifyTestDescriptor(422, "ab", 123, "Description test 2 mod", 1);

    // TEST /DELETE api for Test Descriptor
    deleteTestDescriptor(204, 2);
    deleteTestDescriptor(422, -1);
});

function emptyTestDescriptorTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allTestDescriptors')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}


function newTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('adding a new test descriptor', function (done) {
        if (name !== undefined) {
            let testDescriptor = { name: name, procedureDescription: procedureDescription, idSKU: idSKU }
            agent.post('/api/testDescriptor')
                .send(testDescriptor)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/testDescriptor')
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}


function getTestDescriptor(expectedHTTPStatus, id, name, procedureDescription, idSKU) {
    it('getting test descriptor data from the system', function (done) {
            agent.get('/api/testDescriptors/' + id)
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
                    r.body.id.should.equal(id);
                    r.body.name.should.equal(name);
                    r.body.procedureDescription.should.equal(procedureDescription);
                    r.body.idSKU.should.equal(idSKU);
                    done();
                });
        });
}


function getAllTestDescriptors(expectedHTTPStatus) {
    it('getting all test descriptors from the system', function (done) {
        agent.get('/api/testDescriptors')
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

// PUT /api/testDescriptor/:id
function modifyTestDescriptor(expectedHTTPStatus, id, newName, newProcedureDescription, newIdSKU) {
    it('modify test Descriptor', function (done) {
        let modTestDesc = { newName: newName, newProcedureDescription: newProcedureDescription, newIdSKU: newIdSKU };
        agent.put('/api/testDescriptor/' + id)
            .send(modTestDesc)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/testDescriptors/' + id)
            .then(function (r) {
                r.body.id.should.equal(id);
                r.body.name.should.equal(newName);
                r.body.procedureDescription.should.equal(newProcedureDescription);
                r.body.idSKU.should.equal(newIdSKU);
                done();
            });
    });
}

function deleteTestDescriptor(expectedHTTPStatus, id) {
    it('delete a test descriptor from the system', function (done) {
        agent.delete('/api/testDescriptor/' + id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
            agent.get('/api/testDescriptors/' + id)
            .then(function (r) {
                r.should.have.status(404);
                done();
            });
    });
}
