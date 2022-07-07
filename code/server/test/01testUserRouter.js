const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test user apis', () => {

    //Testing POST /api/newUser
    newUser(201, "user50@ezwh.com", "John", "Smith", "testpassword", "customer");
    newUser(201, "user50@ezwh.com", "John", "Smith", "testpassword", "deliveryEmployee");
    newUser(201, "user2@ezwh.com", "Claire", "Adams", "testpassword", "supplier");
    newUser(422, "user3@ezwh.com", "Marco", "Ravano", "testpassword", "admin");
    newUser(201, "user3@ezwh.com", "Marco", "Ravano", "testpassword", "deliveryEmployee");
    newUser(201, "user4@ezwh.com", "Fabio", "Rossi", "testpassword", "qualityEmployee");
    newUser(201, "user5@ezwh.com", "Jack", "Jones", "testpassword", "clerk");
    newUser(201, "user6@ezwh.com", "Jeff", "Zane", "testpassword", "clerk");
    newUser(422, "user4@ezwh.com", "Jayden", "Ross", "testpassword", "manager");
    newUser(409, "user50@ezwh.com", "John", "Smith", "testpassword", "customer");
    newUser(422, "user50@ezwhcom", "John", "Smith", "testpassword", "customer");
    newUser(422, "user50@ezwh.com", "John", "testpassword", "customer");
    newUser(422);

    getAllUsers(200, 12);
    getAllSuppliers(200, 2);

    //Testing POST /api/sessions
    checkLogin(401, "user50@ezwh.com", "testpassword", "/api/managerSessions");
    checkLogin(200, "user50@ezwh.com", "testpassword", "/api/customerSessions");
    checkLogin(200, "user2@ezwh.com", "testpassword", "/api/supplierSessions");
    checkLogin(200, "user3@ezwh.com", "testpassword", "/api/deliveryEmployeeSessions");
    checkLogin(200, "user4@ezwh.com", "testpassword", "/api/qualityEmployeeSessions");
    checkLogin(200, "user5@ezwh.com", "testpassword", "/api/clerkSessions");
    checkLogin(422, "user50@ezwhcom", "testpassword", "/api/customerSessions");
    checkLogin(422, "user50@ezwhcom", "testpasswsdord", "/api/customerSessions");
    checkLogin(422, "user50@ezwhcom", "", "/api/customerSessions");
    checkLogin(422, undefined, undefined, "/api/supplierSessions");

    //Testing PUT /api/users/:username
    modifyUser(409, "user50@ezwh.com", "customer", "deliveryEmployee");
    modifyUser(200, "user6@ezwh.com", "clerk", "customer");
    modifyUser(404, "user6@ezwh.com", "clerk", "customer");
    modifyUser(404, "user65@ezwh.com", "clerk", "customer");
    modifyUser(422, "user6@ezwhcom", "clerk", "customer");
    modifyUser(422, "user6@ezwhcom", "", "customer");
    modifyUser(422, "user6@ezwhcom", "clerk", "");
    modifyUser(422, "user6@ezwhcom", "", "");

    //Testing DELETE /api/users/:username/:type
    deleteUser(204, "user50@ezwh.com", "customer");
    getAllUsers(200, 11);
    deleteUser(422, "user50@ezwhcom", "customer");
    getAllUsers(200, 11);
    deleteUser(422, "user50@ezwh.com", "manager");
    deleteUser(422, "user50@ezwhcom", "managerdajsldjlaskjdlaksjdlaksjdldjaslkdjaljsdalkdj");
    deleteUser(204, "user8@ezwh.com", "clerk");

});

function emptyUserTable(expectedHTTPStatus) {
    it('delete all data from the user table', function (done) {
        agent.delete('/api/allUsers')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function newUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('adding a new user', function (done) {
        if (username !== undefined && password !== undefined) {
            let user = { username: username, name: name, surname: surname, password: password, type: type }
            agent.post('/api/newUser')
                .send(user)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/newUser')
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function getAllUsers(expectedHTTPStatus, number) {
    it('getting all users from the user table', function (done) {
        agent.get('/api/users')
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

function getAllSuppliers(expectedHTTPStatus, number) {
    it('getting all suppliers from the user table', function (done) {
        agent.get('/api/suppliers')
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

function checkLogin(expectedHTTPStatus, username, password, APIpath) {
    it('checking user login', function (done) {
        if (username !== undefined && password !== undefined) {
            let userCredentials = { username: (username !== "" ? username : undefined), password: (password !== "" ? password : undefined) }
            agent.post(APIpath)
                .send(userCredentials)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post(APIpath)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyUser(expectedHTTPStatus, username, oldType, newType) {
    it('modify user', function (done) {
        let modUser = { oldType: (oldType !== "" ? oldType : undefined), newType: (newType !== "" ? newType : undefined) };

        agent.put('/api/users/' + username)
            .send(modUser)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}

function deleteUser(expectedHTTPStatus, username, type) {
    it('delete a user from the db', function (done) {
        agent.delete('/api/users/' + username + '/' + type)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status === 503) {
                    done();
                }
                done();
            });
    });
}
