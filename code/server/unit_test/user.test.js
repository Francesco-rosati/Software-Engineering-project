const testUserDao = require('../modules/dbManager').user_DAO;
const bcrypt = require("bcrypt");
const { user_DAO } = require('../modules/dbManager');

describe('userDao', () => {
    beforeAll(async () => {
        await testUserDao.dropUsersTable();
        await testUserDao.newUsersTable();
    });

    test('delete db', async () => {
        var res = await testUserDao.getStoredUsers();
        expect(res.length).toStrictEqual(0);
    });

    let counter = 1;

    testNewUser(1, "John", "Snow", "testpassword", "john.snow@supplier.ezwh.com", "supplier", counter);
    counter++;
    testNewUser(2, "Marco", "Rossi", "testpassword", "user1@ezwh.com", "clerk", counter);
    counter++;
    testNewUser(3, "Mark", "James", "testpassword", "user2@ezwh.com", "deliveryEmployee", counter);
    counter++;
    testNewUser(4, "Frank", "Smalling", "testpassword", "user3@ezwh.com", "customer", counter);

    testGetUsers();
    testGetSuppliers();

    testGetUserByIdAndType(2, "Marco", "Rossi", "user1@ezwh.com", "clerk");

    testGetUserByIdAndType(2321, "Marco", "Rossi", "user1@ezwh.com", "whatisthis");

    testGetUserByUsernameAndType(3, "Mark", "James", "testpassword", "user2@ezwh.com", "deliveryEmployee");

    testModifyUser(3, "user2@ezwh.com", "deliveryEmployee", "customer");

    testDeleteUser("user1@ezwh.com", "clerk");

    // CLOSE CONNECTION TO USER TABLE
    TestCloseUserTable();

    testNewUser(5, "Federico", "Marini", "testpassword", "user4@ezwh.com", "clerk", counter);

    testGetUsers();

    testGetSuppliers()

    testGetUserByIdAndType(3, "Mark", "James", "user2@ezwh.com", "deliveryEmployee");

    testGetUserByUsernameAndType(1, "John", "Snow", "testpassword", "john.snow@supplier.ezwh.com", "supplier");

    testModifyUser(4, "user3@ezwh.com", "customer", "deliveryEmployee");

    testDeleteUser("user2@ezwh.com", "customer");

    testDropAndCreateTable();

});

function testNewUser(id, name, surname, password, username, type, counter) {
    test('create new user', async () => {

        const salt = await bcrypt.genSalt(10);

        let hashPassword = await bcrypt.hash(password, salt);

        try {
            await testUserDao.storeUser(username, hashPassword, name, surname, type);

            var res = await testUserDao.getStoredUsers();
            expect(res.length).toStrictEqual(counter);

            res = await testUserDao.getUserByIdAndType(id, type);

            expect(res.id).toStrictEqual(id);
            expect(res.name).toStrictEqual(name);
            expect(res.surname).toStrictEqual(surname);
            expect(res.email).toStrictEqual(username);
            expect(res.type).toStrictEqual(type);

            res = await testUserDao.getUserByUsernameAndType(username, type);

            expect(res.id).toStrictEqual(id);
            expect(res.name).toStrictEqual(name);
            expect(res.surname).toStrictEqual(surname);
            expect(res.password).toStrictEqual(hashPassword);
            expect(res.email).toStrictEqual(username);
            expect(res.type).toStrictEqual(type);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }

    });
}

function testGetUsers() {
    test('test get users', async () => {

        try {
            var res = await testUserDao.getStoredUsers();
            expect(res.length).toStrictEqual(4);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetSuppliers() {
    test('test get suppliers', async () => {

        try {
            var res = await testUserDao.getStoredSuppliers();
            expect(res.length).toStrictEqual(1);

            expect(res).toEqual([
                {
                    "id": 1,
                    "name": "John",
                    "surname": "Snow",
                    "email": "john.snow@supplier.ezwh.com"
                }
            ]);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }


    });
}

function testGetUserByIdAndType(id, name, surname, email, type) {
    test('test get user by id and type', async () => {

        try {
            var res = await testUserDao.getUserByIdAndType(id,type);

            expect(res.length).toStrictEqual(1);

            expect(res.id).toStrictEqual(id);
            expect(res.name).toStrictEqual(name);
            expect(res.surname).toStrictEqual(surname);
            expect(res.email).toStrictEqual(email);
            expect(res.type).toStrictEqual(type);

        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetUserByUsernameAndType(id, name, surname, password, email, type) {
    test('test get user by username and type', async () => {

        try {
            var res = await testUserDao.getUserByUsernameAndType(email,type);

            expect(res.length).toStrictEqual(1);

            expect(res.id).toStrictEqual(id);
            expect(res.name).toStrictEqual(name);
            expect(res.surname).toStrictEqual(surname);
            expect(res.password).toStrictEqual(password);
            expect(res.email).toStrictEqual(email);
            expect(res.type).toStrictEqual(type);

        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testModifyUser(id, username, oldType, newType) {
    test('modify user', async () => {

        try {
            var res = await testUserDao.modifyUser(username, oldType, newType);

            expect(res).toStrictEqual(true);

            res = await testUserDao.getUserByUsernameAndType(username, newType);

            expect(res.id).toStrictEqual(id);
            expect(res.email).toStrictEqual(username);
            expect(res.type).toStrictEqual(newType);

            res = await testUserDao.getUserByUsernameAndType(username, oldType);

            expect(res).toStrictEqual(undefined);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testDeleteUser(username, type) {
    test('delete user', async () => {

        try {
            await testUserDao.deleteUser(username, type);

            var res = await testUserDao.getStoredUsers();
            expect(res.length).toStrictEqual(3);

            res = await testUserDao.getUserByUsernameAndType(username, type);

            expect(res).toStrictEqual(undefined);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }

    });
}

function testDropAndCreateTable() {
    test('drop an create user table', async () => {

        try {
            await user_DAO.dropUsersTable();
        } catch(err){
            console.log("---- error ----");
        }

        try {
            await user_DAO.newUsersTable();
        } catch(err){
            console.log("---- error ----");
        }

    });
}

function TestCloseUserTable() {
    test('close user Table', async () => {
        await user_DAO.closeUserTable();
    });
}