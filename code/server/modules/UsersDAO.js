class UsersDAO {

    sqlite = require('sqlite3');

    constructor(db){
        this.db = db;
        this.newUsersTable();
    }

    closeUserTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    newUsersTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS USERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR(50), SURNAME VARCHAR(50), EMAIL VARCHAR(50), PASSWORD VARCHAR(200), TYPE VARCHAR(20), UNIQUE(EMAIL,TYPE));";
            this.db.run(sql, function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    dropUsersTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS USERS";
            this.db.run(sql, function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(true);
            })

        });
    }

    getStoredSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT ID, NAME, SURNAME, EMAIL FROM USERS WHERE TYPE = 'supplier'";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    const suppliers = rows.map((el) => {
                        return {
                            id: el.ID,
                            name: el.NAME,
                            surname: el.SURNAME,
                            email: el.EMAIL
                        }
                    });
                    resolve(suppliers);
                }
            })
        })
    }

    getStoredUsers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT ID, NAME, SURNAME, EMAIL, TYPE FROM USERS WHERE TYPE <> 'manager'";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err)
                } else {
                    const users = rows.map((el) => {
                        return {
                            id: el.ID,
                            name: el.NAME,
                            surname: el.SURNAME,
                            email: el.EMAIL,
                            type: el.TYPE
                        }
                    });
                    resolve(users)
                }
            })
        })
    }

    getUserByUsernameAndType(username, type) {

        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM USERS WHERE EMAIL = ? AND TYPE = ?";
            this.db.get(sql, [username, type], (err, data) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    if (data !== undefined) {
                        const user = {
                            id: data.ID,
                            name: data.NAME,
                            surname: data.SURNAME,
                            email: data.EMAIL,
                            password: data.PASSWORD,
                            type: data.TYPE
                        }
                        resolve(user);
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    getUserByIdAndType(id, type) {

        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM USERS WHERE ID = ? AND TYPE = ?";
            this.db.get(sql, [id, type], (err, data) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    if (data !== undefined) {
                        const user = {
                            id: data.ID,
                            name: data.NAME,
                            surname: data.SURNAME,
                            email: data.EMAIL,
                            type: data.TYPE
                        }
                        resolve(user);
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    storeUser(username,password,name,surname,type) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO USERS(NAME,SURNAME,EMAIL,PASSWORD,TYPE) VALUES (?,?,?,?,?)";
            this.db.run(sql, [name,surname,username,password,type], function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifyUser(username,oldType,newType) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE USERS SET TYPE = ? WHERE EMAIL=? AND TYPE = ?";
            this.db.run(sql, [newType,username,oldType], function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

    deleteUser(username, type) {

        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM USERS WHERE EMAIL=? AND TYPE=?";
            this.db.run(sql, [username, type], function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

}

module.exports = UsersDAO;