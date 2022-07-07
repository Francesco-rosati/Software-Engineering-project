const UserService = require('../services/user_service');
const dao = require('../modules/mock_user_dao');
const user_service = new UserService(dao);
const bcrypt = require("bcrypt");

describe('delete all users', () => {
    beforeEach(() => {
        dao.dropUsersTable.mockReset();
        dao.newUsersTable.mockReset();

        dao.dropUsersTable.mockReturnValueOnce(1);
        dao.newUsersTable.mockReturnValueOnce(0);

    });

    test('delete all users', async () => {
        let res = await user_service.deleteAllUsers();

        expect(res).toBe(200);

    });

});

describe('check User', () => {

    beforeEach(() => {

        dao.getUserByUsernameAndType.mockReset();
        dao.getUserByUsernameAndType.mockReturnValueOnce({
            id: 1,
            name: "John",
            surname: "Smith",
            email: "user1@ezwh.com",
            password: "$2b$10$WfJg.hb4rnbeC.tFJVtPYu/K/Mq8yleFIzKP6ZJqhwHFfTG6Yt6lC",
            type: "customer"
        }).mockReturnValueOnce(undefined)
            .mockReturnValueOnce({
                id: 3,
                name: "Claire",
                surname: "Adams",
                email: "user3@ezwh.com",
                password: "$2b$10$WfJg.hb4rnbeC.tFJVtPYu/K/Mq8yleFIzKP6ZJqhwHFfTG6Yt6lC",
                type: "clerk"
            });

    });

    test('check User', async () => {

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);

        // now we set user password to hashed password
        let hashPassword = await bcrypt.hash("testpassword", salt);

        const user1 = {
            username: "user1@ezwh.com",
            password: "testpassword",
            type: "supplier"
        };

        const user2 = {
            username: "user2@ezwh.com",
            password: "testpassword",
            type: "deliveryEmployee"
        };

        const user3 = {
            username: "user3@ezwh.com",
            password: "testpassssword",
            type: "clerk"
        };

        let res = await user_service.checkUser(user1.username, user1.password, user1.type);

        //first call, first parameter passed
        expect(dao.getUserByUsernameAndType.mock.calls[0][0]).toBe(user1.username);
        //first call, second parameter passed
        expect(dao.getUserByUsernameAndType.mock.calls[0][1]).toBe(user1.type);

        expect(res).toEqual({
            id: 1,
            username: "user1@ezwh.com",
            name: "John"
        });

        res = await user_service.checkUser(user2.username, user2.password, user2.type);
        expect(res).toBe(401);

        res = await user_service.checkUser(user3.username, user3.password, user3.type);
        expect(res).toBe(401);

    });

});

describe('get all suppliers', () => {
    beforeEach(() => {
        dao.getStoredSuppliers.mockReset();
        dao.getStoredSuppliers.mockReturnValueOnce(
            {
                id: 1,
                name: "John",
                surname: "Snow",
                email: "john.snow@supplier.ezwh.com"
            },
            {
                id: 2,
                name: "James",
                surname: "Jones",
                email: "james.jones@supplier.ezwh.com"
            },
            {
                id: 4,
                name: "Claire",
                surname: "Adams",
                email: "claire.adams@supplier.ezwh.com"
            }
        );
    });

    test('get all suppliers', async () => {
        let res = await user_service.getSuppliers();
        expect(res).toEqual(
            {
                id: 1,
                name: "John",
                surname: "Snow",
                email: "john.snow@supplier.ezwh.com"
            },
            {
                id: 2,
                name: "James",
                surname: "Jones",
                email: "james.jones@supplier.ezwh.com"
            },
            {
                id: 4,
                name: "Claire",
                surname: "Adams",
                email: "claire.adams@supplier.ezwh.com"
            });
    });

});

describe('get all users', () => {
    beforeEach(() => {
        dao.getStoredUsers.mockReset();
        dao.getStoredUsers.mockReturnValueOnce(
            {
                id: 1,
                name: "John",
                surname: "Snow",
                email: "john.snow@supplier.ezwh.com",
                type: "supplier"
            },
            {
                id: 2,
                name: "Michael",
                surname: "Jordan",
                email: "michael.jordan@supplier.ezwh.com",
                type: "supplier"
            },
            {
                id: 3,
                name: "Claire",
                surname: "Adams",
                email: "user3@ezwh.com",
                type: "clerk"
            },
            {
                id: 4,
                name: "Marco",
                surname: "Rossi",
                email: "user4@ezwh.com",
                type: "deliveryEmployee"
            }
        );
    });

    test('get all users', async () => {
        let res = await user_service.getUsers();
        expect(res).toEqual(
            {
                id: 1,
                name: "John",
                surname: "Snow",
                email: "john.snow@supplier.ezwh.com",
                type: "supplier"
            },
            {
                id: 2,
                name: "Michael",
                surname: "Jordan",
                email: "michael.jordan@supplier.ezwh.com",
                type: "supplier"
            },
            {
                id: 3,
                name: "Claire",
                surname: "Adams",
                email: "user3@ezwh.com",
                type: "clerk"
            },
            {
                id: 4,
                name: "Marco",
                surname: "Rossi",
                email: "user4@ezwh.com",
                type: "deliveryEmployee"
            });
    });

});


describe("set manager fo initialization", () => {
    beforeEach(() => {

        dao.getUserByUsernameAndType.mockReset();
        dao.storeUser.mockReset();

        dao.storeUser.mockReturnValueOnce(1);
        dao.getUserByUsernameAndType.mockReturnValueOnce(undefined)
            .mockReturnValueOnce({
                username: "manager1@ezwh.com",
                name: "Clair",
                surname: "Adams",
                password: "testpassword",
                type: "manager"
            });

    })
    test('set manager fo initialization', async () => {

        const user1 = {
            username: "manager1@ezwh.com",
            name: "Clair",
            surname: "Adams",
            password: "testpassword",
            type: "manager"
        }

        let res = await user_service.setManager(user1.username, user1.name, user1.surname, user1.password, user1.type);
        expect(res).toBe(1);

        //first call, first parameter passed
        expect(dao.storeUser.mock.calls[0][0]).toBe(user1.username);
        //first call, second parameter passed
        expect(dao.storeUser.mock.calls[0][1]).toBe(user1.password);
        //first call, third parameter passed
        expect(dao.storeUser.mock.calls[0][2]).toBe(user1.name);
        //first call, fourth parameter passed
        expect(dao.storeUser.mock.calls[0][3]).toBe(user1.surname);
        //first call, fifth parameter passed
        expect(dao.storeUser.mock.calls[0][4]).toBe(user1.type);

        res = await user_service.setManager(user1.username, user1.name, user1.surname, user1.password, user1.type);
        expect(res).toBe("c409");

    });
});


describe("set user", () => {
    beforeEach(() => {

        dao.getUserByUsernameAndType.mockReset();
        dao.storeUser.mockReset();

        dao.storeUser.mockReturnValueOnce(1);
        dao.getUserByUsernameAndType.mockReturnValueOnce(undefined)
            .mockReturnValueOnce({
                username: "user2@ezwh.com",
                name: "Clair",
                surname: "Adams",
                password: "testpassword",
                type: "deliveryEmployee"
            });

    })
    test('set user', async () => {

        const user1 = {
            username: "user1@ezwh.com",
            name: "John",
            surname: "Smith",
            password: "testpassword",
            type: "clerk"
        }

        let res = await user_service.setUser(user1.username, user1.name, user1.surname, user1.password, user1.type);
        expect(res).toBe(1);

        //first call, first parameter passed
        expect(dao.storeUser.mock.calls[0][0]).toBe(user1.username);
        //first call, second parameter passed
        expect(dao.storeUser.mock.calls[0][1]).toBe(user1.password);
        //first call, third parameter passed
        expect(dao.storeUser.mock.calls[0][2]).toBe(user1.name);
        //first call, fourth parameter passed
        expect(dao.storeUser.mock.calls[0][3]).toBe(user1.surname);
        //first call, fifth parameter passed
        expect(dao.storeUser.mock.calls[0][4]).toBe(user1.type);

        res = await user_service.setUser(user1.username, user1.name, user1.surname, user1.password, "administrator");
        expect(res).toBe("c422");

        res = await user_service.setUser(user1.username, user1.name, user1.surname, user1.password, "manager");
        expect(res).toBe("c422");

        res = await user_service.setUser(user1.username, user1.name, user1.surname, user1.password, "admin");
        expect(res).toBe("c422");

        res = await user_service.setUser(user1.username, user1.name, user1.surname, user1.password, user1.type);
        expect(res).toBe("c409");

    });
});

describe("modify user", () => {
    beforeEach(() => {

        dao.modifyUser.mockReset();
        dao.getUserByUsernameAndType.mockReset();

        dao.modifyUser.mockReturnValueOnce(true);
        dao.getUserByUsernameAndType.mockReturnValueOnce({
            id: 1,
            name: "John",
            surname: "Smith",
            email: "user1@ezwh.com",
            password: "testpassword",
            type: "clerk"
        }).mockReturnValueOnce(undefined)
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce(undefined)
            .mockReturnValue({
                id: 2,
                name: "Claire",
                surname: "Adams",
                email: "user3@ezwh.com",
                password: "testpassword",
                type: "qualityEmployee"
            });

    });

    test('modify user', async () => {

        const user1 = {
            id: 1,
            name: "John",
            surname: "Smith",
            email: "user1@ezwh.com",
            password: "testpassword",
            type: "clerk"
        }

        const userMod = {
            username: "user1@ezwh.com",
            oldType: "supplier",
            newType: "deliveryEmployee"
        }

        let res = await user_service.modifyUser(userMod.username, userMod.oldType, userMod.newType);

        //first call, first parameter passed
        expect(dao.modifyUser.mock.calls[0][0]).toBe(userMod.username);
        //first call, second parameter passed
        expect(dao.modifyUser.mock.calls[0][1]).toBe(userMod.oldType);
        //first call, third parameter passed
        expect(dao.modifyUser.mock.calls[0][2]).toBe(userMod.newType);

        expect(res).toBe(true);

        res = await user_service.modifyUser(userMod.username, "administrator", userMod.newType);
        expect(res).toBe(422);

        res = await user_service.modifyUser(userMod.username, "manager", userMod.newType);
        expect(res).toBe(422);

        res = await user_service.modifyUser(userMod.username, userMod.oldType, "administrator");
        expect(res).toBe(422);

        res = await user_service.modifyUser(userMod.username, userMod.oldType, userMod.newType);
        expect(res).toBe(404);

        res = await user_service.modifyUser(userMod.username, userMod.oldType, userMod.newType);
        expect(res).toBe(409);

    });
});

describe("delete user", () => {

    beforeEach(() => {
        dao.getUserByUsernameAndType.mockReset();
        dao.deleteUser.mockReset();

        dao.getUserByUsernameAndType.mockReturnValueOnce({
            id: 1,
            name: "John",
            surname: "Snow",
            email: "user1@ezwh.com",
            type: "clerk"
        }).mockReturnValue(undefined);

        dao.deleteUser.mockReturnValueOnce(true);
    });

    test('delete user', async () => {

        const user1 = {
            username: "user1@ezwh.com",
            type: "clerk"
        };

        const user2 = {
            username: "user34@ezwh.com",
            type: "deliveryEmployee"
        };

        let res = await user_service.deleteUser(user1.username, user1.type);

        //first call, first parameter passed
        expect(dao.deleteUser.mock.calls[0][0]).toBe(user1.username);
        //first call, second parameter passed
        expect(dao.deleteUser.mock.calls[0][1]).toBe(user1.type);
        expect(res).toEqual(true);

        res = await user_service.deleteUser(user1.username, "manager");
        expect(res).toEqual(422);

        res = await user_service.deleteUser(user1.username, "administrator");
        expect(res).toEqual(422);

        res = await user_service.deleteUser(user1.username, "admin");
        expect(res).toEqual(422);

        res = await user_service.deleteUser(user2.username, user2.type);
        expect(res).toEqual(204);

    });
});

describe("test with closed connection to user table", () => {

    beforeEach(() => {
        dao.closeUserTable.mockReset();
        dao.closeUserTable.mockReturnValueOnce(true);

        dao.dropUsersTable.mockReset();
        dao.dropUsersTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeUser.mockReset();
        dao.storeUser.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredSuppliers.mockReset();
        dao.getStoredSuppliers.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredUsers.mockReset();
        dao.getStoredUsers.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getUserByIdAndType.mockReset();
        dao.getUserByIdAndType.mockImplementation(() => {
            throw new Error();
        });

        dao.getUserByUsernameAndType.mockReset();
        dao.getUserByUsernameAndType.mockImplementation(() => {
            throw new Error();
        });

        dao.modifyUser.mockReset();
        dao.modifyUser.mockImplementation(() => {
            throw new Error();
        });

        dao.deleteUser.mockReset();
        dao.deleteUser.mockImplementation(() => {
            throw new Error();
        });

    });

    test('test with closed connection to user table', async () => {

        const user = {
            username: "user1@ezwh.com",
            name: "John",
            surname: "Smith",
            password: "testpassword",
            type: "customer"
        }

        await user_service.closeConnectionUser();

        let res = await user_service.setUser(user.username,user.name, user.surname, user.password, user.type);
        expect(res).toEqual("c503");

        res = await user_service.setManager(user.username,user.name, user.surname, user.password, user.type);
        expect(res).toEqual("c503");

        res = await user_service.checkUser(user.username,user.password,user.type);
        expect(res).toEqual(500);

        res = await user_service.getSuppliers();
        expect(res).toEqual(500);

        res = await user_service.getUsers();
        expect(res).toEqual(500);

        res = await user_service.modifyUser(user.username,user.type,"clerk");
        expect(res).toEqual(503);

        res = await user_service.deleteUser(user.username,user.type);
        expect(res).toEqual(503);

        res = await user_service.deleteAllUsers();
        expect(res).toEqual(503);

    });

});