const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test position apis', () => {

    emptyPositionTable(200);

    // TEST /POST api of Position
    newPosition(201, "800234543412", "8002","3454", "3412", 1000, 1000);
    newPosition(201, "700234543412", "7002","3454", "3412", 2000, 1000);
    newPosition(201, "600234543412", "6002","3454", "3412", 1000, 1300);
    newPosition(201, "500234543412", "6002","3454", "3412", 1000, 1300);
    newPosition(422);

     // TEST /GET api of Position
    getAllPositions(200);
    //getAllPositions(401);
    //getAllPositions(500);

     // TEST /PUT api of Position
    modifyPosition(200, "800234543412", "1002","3454", "3412", 1000, 1000, 200, 200);
    modifyPosition(404, "111234543412", "1002","3454", "3412", 1000, 1000, 200, 200);
    modifyPosition(422, "12", "1002","3454", "3412", 1000, 1000, 200, 200);

    changePositionID(200, "500234543412", "200234543412");
    changePositionID(404, "232234543412", "200234543412");
    changePositionID(422, "500234543412", 123);

    // TEST /DELETE api of Position
    deletePosition(204, "200234543412");
    deletePosition(422, "2002345434121245567");
});

function emptyPositionTable(expectedHTTPStatus) {
    it('delete all data from the system', function (done) {
        agent.delete('/api/allPositions')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}

function newPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('adding a new position', function (done) {
        if (positionID !== undefined) {
            let position = {  positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume }
            agent.post('/api/position')
                .send(position)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    //res.body.username.should.equal(username);
                    done();
                });
        } else {
            agent.post('/api/position') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function getAllPositions(expectedHTTPStatus) {
    it('getting all the positions from the system', function (done) {
        agent.get('/api/positions')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 404) {
                    done();
                }
                Object.keys(r.body).length.should.equal(4);
                done();
            });
    });
}

function modifyPosition(expectedHTTPStatus, positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
    it('modify position', function (done) {
        let modPosition = { newAisleID: newAisleID, newRow: newRow, newCol: newCol, newMaxWeight: newMaxWeight, newMaxVolume: newMaxVolume, newOccupiedWeight: newOccupiedWeight, newOccupiedVolume: newOccupiedVolume};
        agent.put('/api/position/' + positionID)
            .send(modPosition)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}

function changePositionID(expectedHTTPStatus, positionID, newPositionID) {
    it('change positionID', function (done) {
        let modPosition = { newPositionID: newPositionID };
        agent.put('/api/position/' + positionID + '/changeID')
            .send(modPosition)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}

function deletePosition(expectedHTTPStatus, positionID) {
    it('delete a position from the system', function (done) {
        agent.delete('/api/position/' + positionID)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(r.status === 500) {
                    done();
                }
                done();
            });
    });
}