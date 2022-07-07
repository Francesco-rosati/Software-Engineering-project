class UserService {

    bcrypt = require("bcrypt");

    dao;

    constructor(dao) {
        this.dao = dao;
    }

    checkUser = async (username,password,type) => {
        try{

            const user = await this.dao.getUserByUsernameAndType(username, type);

            if(user === undefined){
                console.log("Wrong username!");
                return 401;
            }

            const validPassword = await this.bcrypt.compare(password, user.password);

            if(validPassword){
                return {id: user.id, username: user.email, name: user.name};
            }
            else{
                console.log("Wrong password!");
                return 401;
            }

        }
        catch(err){
            console.log("Generic error!");
            return 500;
        }
    }

    getSuppliers = async () => {
        try {
            const suppliers = await this.dao.getStoredSuppliers();
            return suppliers;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getUsers = async () => {
        try {
            const users = await this.dao.getStoredUsers();
            return users;
        }
        catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    setManager  = async (username, name, surname, password, type) => {
        try {
            let user = await this.dao.getUserByUsernameAndType(username, type);

            if (user !== undefined) {
                console.log("User with the same type already exists!");
                return "c409";
            }
            const newId = await this.dao.storeUser(username, password, name, surname, type);
            console.log("User successfully created!");
            return newId;
        }
        catch (err) {
            console.log("Generic error!");
            return "c503";
        }
    }

    setUser = async (username, name, surname, password, type) => {

        if (type === 'manager' || type === 'administrator') {
            console.log("Attempted to create manager or administrator account!");
            return "c422";
        }

        if (type !== 'customer' && type !== 'qualityEmployee' && type !== 'clerk'
            && type !== 'supplier' && type !== 'deliveryEmployee') {
            console.log("Type not allowed!");
            return "c422";
        }

        try {

            let user = await this.dao.getUserByUsernameAndType(username, type);

            if (user !== undefined) {
                console.log("User with the same type already exists!");
                return "c409";
            }

            const newId = await this.dao.storeUser(username, password, name, surname, type);
            console.log("User successfully created!");
            return newId;

        }
        catch (err) {
            console.log("Generic error!");
            return "c503";
        }

    }

    modifyUser = async (username,oldType,newType) => {

        if (oldType === "administrator" || oldType === "manager") {
            console.log("Attempted to modify rights to administrator or manager!");
            return 422;
        }

        if (newType !== "customer" && newType !== "clerk" && newType !== "supplier" && newType !== "deliveryEmployee" && newType !== "qualityEmployee") {
            console.log("Wrong type!");
            return 422;
        }

        try{
            const user1 = await this.dao.getUserByUsernameAndType(username, oldType);
            const user2 = await this.dao.getUserByUsernameAndType(username, newType);

            if (user1 === undefined) {
                console.log("User doesn't exist or old type is wrong!");
                return 404;
            }

            if (user2 !== undefined) {
                console.log("User with the same type already exists!");
                return 409;
            }

            const result = await this.dao.modifyUser(username,oldType,newType);
            console.log("User successfully updated!");
            return result;
        }
        catch(err){
            console.log("Generic error!");
            return 503;
        }

    }

    deleteUser = async (username, type) => {

        if (type === 'manager' || type === 'administrator') {
            console.log("Attempted to delete a manager or an administrator");
            return 422;
        }

        if (type !== "customer" && type !== "clerk" && type !== "supplier" && type !== "deliveryEmployee" && type !== "qualityEmployee") {
            console.log("Wrong type!");
            return 422;
        }

        try {
            const user = await this.dao.getUserByUsernameAndType(username, type);

            if (user === undefined) {
                console.log("User not found or wrong type!");
                return 204;
            }

            const result = await this.dao.deleteUser(username, type);
            console.log("User successfully deleted!");
            return result;

        }
        catch(err){
            console.log("Generic error!");
            return 503;
        }

    }

    deleteAllUsers = async () => {
        try {

            this.dao.dropUsersTable();
            this.dao.newUsersTable();
            console.log("Users Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 503;
        }

    }

    closeConnectionUser = async () => {
        await this.dao.closeUserTable();
        return true;
    }
    
}

module.exports = UserService;
