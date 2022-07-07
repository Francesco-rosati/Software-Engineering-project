class InternalOrderDAO {

    sqlite = require('sqlite3');

    constructor(db){
        this.db = db;
        this.newInternalOrderTable();
    }

    closeInternalOrderTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    dropInternalOrderTable(){
        return new Promise((resolve,reject) => {
            const sql = "DROP TABLE IF EXISTS INTERNALORDERS";
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })

        });
    }

    newInternalOrderTable(){
        return new Promise((resolve,reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS INTERNALORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE TEXT, STATE VARCHAR, PRODUCTS VARCHAR, CUSTOMERID INTEGER)";
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getAllInternalOrders(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM INTERNALORDERS";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    const items = rows.map((el) => {
                        return {
                            id: el.ID,
                            issueDate: el.ISSUEDATE,
                            state: el.STATE,
                            products: JSON.parse(el.PRODUCTS),
                            customerId: el.CUSTOMERID 
                        }
                    });

                    resolve(items)
                }  
            })
        });

    }


    getInternalOrdersIssued(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM INTERNALORDERS WHERE STATE=?";
            this.db.all(sql, ["ISSUED"], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    const item = rows.map((el) => {
                        return {
                            id: el.ID,
                            issueDate: el.ISSUEDATE,
                            state: el.STATE,
                            products: JSON.parse(el.PRODUCTS),
                            customerId: el.CUSTOMERID 
                        }
                    });

                    resolve(item)
                }  
            })
        });

    }

    
    getInternalOrdersAccepted(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM INTERNALORDERS WHERE STATE=?";
            this.db.all(sql, ["ACCEPTED"], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    const item = rows.map((el) => {
                        return {
                            id: el.ID,
                            issueDate: el.ISSUEDATE,
                            state: el.STATE,
                            products: JSON.parse(el.PRODUCTS),
                            customerId: el.CUSTOMERID 
                        }
                    });

                    resolve(item)
                }  
            })
        });

    }

    getInternalOrdersById(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM INTERNALORDERS WHERE ID=?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    if (row!==undefined){
                        const item = {
                            id: row.ID,
                            issueDate: row.ISSUEDATE,
                            state: row.STATE,
                            products: JSON.parse(row.PRODUCTS),
                            customerId: row.CUSTOMERID 
                        }
                        resolve(item)
                    }
                    else resolve(undefined)
                }       
            })
        })
    }


    storeInternalOrder(issueDate, products, customerId){
        return new Promise((resolve,reject) => {
            const sql = "INSERT INTO INTERNALORDERS(ISSUEDATE, STATE, PRODUCTS, CUSTOMERID) VALUES (?,?,?,?)";

            this.db.run(sql, [issueDate, "ISSUED", JSON.stringify(products), customerId], function (err) {
                if(err){
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return 0;
                }
                resolve(this.lastID);
            });
        });
    }


    modifyInternalOrder(newState, products, id){
        return new Promise((resolve, reject) => {
            if(newState==="COMPLETED"){
                const sql = "UPDATE INTERNALORDERS SET STATE=?, PRODUCTS=? WHERE ID=?";
                this.db.run(sql, [newState, JSON.stringify(products), id], (err) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(true);
                    }
                })
            } else {
                    const sql = "UPDATE INTERNALORDERS SET STATE=? WHERE ID=?";
                    this.db.run(sql, [newState, id], (err) => {
                        if (err) {
                            console.log('Error running sql: ' + sql)
                            console.log(err)
                            reject(err)
                        } else {
                            resolve(true);
                        }
                })
            }
        })
    }

    deleteInternalOrder(id){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM INTERNALORDERS WHERE ID=?";
            this.db.run(sql, [id], (err) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true)
                }
            })
        })
    }
   
}


module.exports = InternalOrderDAO;