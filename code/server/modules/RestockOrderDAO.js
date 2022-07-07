class RestockOrderDAO {

    //TABLE FOR RestockOrders

    sqlite = require('sqlite3');

    constructor(db){
        this.db = db;
        this.newRestockOrderTable();
    }

    closeRestockOrderTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }


    dropRestockOrderTable(){
        return new Promise((resolve,reject) => {
            const sql = "DROP TABLE IF EXISTS RESTOCKORDERS";
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    newRestockOrderTable(){
        return new Promise((resolve,reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS RESTOCKORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, ISSUEDATE VARCHAR(16), STATE VARCHAR, PRODUCTS VARCHAR, SUPPLIERID INTEGER, TRANSPORTNOTE VARCHAR, SKUITEMS VARCHAR)";
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    getAllRestockOrder(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM RESTOCKORDERS";
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
                            supplierId: el.SUPPLIERID,
                            transportNote: JSON.parse(el.TRANSPORTNOTE),
                            skuItems: JSON.parse(el.SKUITEMS)
                        }
                    });

                    resolve(items)
                }  
            })
        });

    }


    getRestockOrderIssued(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM RESTOCKORDERS WHERE STATE=?";
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
                            supplierId: el.SUPPLIERID,
                            transportNote: JSON.parse(el.TRANSPORTNOTE),
                            skuItems: JSON.parse(el.SKUITEMS),
                        }
                       
                    });
                    
                    resolve(item)
                }  
            })
        });

    }

    
    getRestockOrderById(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM RESTOCKORDERS WHERE ID=?";
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
                            supplierId: row.SUPPLIERID,
                            transportNote: JSON.parse(row.TRANSPORTNOTE),
                            skuItems: JSON.parse(row.SKUITEMS)
                        }
                        resolve(item)
                    } else resolve(undefined)
                }
               
            })
        })
    }

    
    getRestockOrderReturnItemsById(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT SKUITEMS FROM RESTOCKORDERS WHERE ID=?";
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    const item = rows.map((el) => {
                        return {
                            skuItems: JSON.parse(el.SKUITEMS),
                        }
                    });
                    resolve(item[0])
                }
            })
        })
    }


    storeRestockOrder(issueDate, products, supplierId){
   
        return new Promise((resolve,reject) => {
            const sql = "INSERT INTO RESTOCKORDERS(ISSUEDATE, STATE, PRODUCTS, SUPPLIERID, TRANSPORTNOTE, SKUITEMS) VALUES (?,?,?,?,?,?)";
            this.db.run(sql, [issueDate, "ISSUED", JSON.stringify(products), supplierId, null , null ], function (err) {
                if(err){
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    modifyRestockOrderState(newState, id){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE RESTOCKORDERS SET STATE=? WHERE ID=?";
            this.db.run(sql, [newState, id], function(err) {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            })
        })
    }


    modifyRestockOrderSKUItemsById(oldSkuItems, newSkuItems, id){
        return new Promise((resolve, reject) => { 
            if(oldSkuItems!==null){

                let mergedSkuItems=oldSkuItems.concat(newSkuItems);
             
                
                let finalSkuItems=JSON.stringify(mergedSkuItems);
  

                const sql = "UPDATE RESTOCKORDERS SET SKUITEMS=? WHERE ID=?";
                this.db.run(sql, [finalSkuItems, id], function(err) {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(this.lastID)
                    }
                });
            
            } else {
                const sql = "UPDATE RESTOCKORDERS SET SKUITEMS=? WHERE ID=?";
                this.db.run(sql, [JSON.stringify(newSkuItems), id], function(err) {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(this.lastID)
                    }
                });

            }
        });
    }

    
    modifyRestockOrderTransportNote(newtransportNote, id){
        return new Promise((resolve, reject) => {

           const stringnewtransportNote=JSON.stringify(newtransportNote);
            const sql = "UPDATE RESTOCKORDERS SET TRANSPORTNOTE=? WHERE ID=?";
            this.db.run(sql, [stringnewtransportNote, id], function(err) {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            })
        })
    }

    deleteRestockOrder(id){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RESTOCKORDERS WHERE ID=?";
            this.db.run(sql, [id], (err) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            })
        })
    }

















}

module.exports = RestockOrderDAO;