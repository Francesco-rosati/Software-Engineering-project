class ItemsDAO {

    sqlite = require('sqlite3');

    constructor(db) {
        this.db = db;
        this.newSKUItemsTable();
        this.newItemsTable();
    }

    //TABLE FOR ITEMS

    closeItemTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    newItemsTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS ITEMS(ID INTEGER PRIMARY KEY, DESCRIPTION VARCHAR(255), PRICE FLOAT, SKUID INTEGER, SUPPLIERID INTEGER, UNIQUE(ID, SUPPLIERID), UNIQUE(ID, SKUID));";
            this.db.run(sql, (err) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                }
                resolve(this.lastID);
            });
        });
    }

    dropItemsTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS ITEMS;";
            this.db.run(sql, function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                }
                resolve(this.lastID);
            })

        });
    }

    storeItem(id, description, price, SKUId, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO ITEMS(ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID) VALUES (?,?,?,?,?);";
            this.db.run(sql, [id, description, price, SKUId, supplierId], function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                }
                resolve(id);
            });
        });
    }

    getStoredItems() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEMS;";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    const items = rows.map((el) => {
                        return {
                            id: el.ID,
                            description: el.DESCRIPTION,
                            price: el.PRICE,
                            SKUId: el.SKUID,
                            supplierId: el.SUPPLIERID
                        }
                    });
                    resolve(items);
                }
            })
        })
    }

    getStoredItemById(id, supid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEMS WHERE ID = ? AND SUPPLIERID=?;";
            this.db.get(sql, [id, supid], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    if (row != undefined) {
                        const item = {
                            id: row.ID,
                            description: row.DESCRIPTION,
                            price: row.PRICE,
                            SKUId: row.SKUID,
                            supplierId: row.SUPPLIERID
                        }
                        resolve(item)
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    getStoredItemByIdAndSupplierId(id, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEMS WHERE ID = ? AND SUPPLIERID = ?;";
            this.db.get(sql, [id, supplierId], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    if (row != undefined) {
                        const item = {
                            id: row.ID,
                            description: row.DESCRIPTION,
                            price: row.PRICE,
                            SKUId: row.SKUID,
                            supplierId: row.SUPPLIERID
                        }
                        resolve(item)
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    getStoredItemBySKUIdAndSupplierId(SKUid, supplierId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEMS WHERE SKUID = ? AND SUPPLIERID = ?;";
            this.db.get(sql, [SKUid, supplierId], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    if (row != undefined) {
                        const item = {
                            id: row.ID,
                            description: row.DESCRIPTION,
                            price: row.PRICE,
                            SKUId: row.SKUID,
                            supplierId: row.SUPPLIERID
                        }
                        resolve(item)
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    modifyItem(description, price, id, supid) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE ITEMS SET DESCRIPTION = ?, PRICE = ? WHERE ID = ? AND SUPPLIERID=?";
            this.db.run(sql, [description, price, id, supid], (err) => {
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


    deleteItem(id, supid) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ITEMS WHERE ID = ? AND SUPPLIERID=?";
            this.db.run(sql, [id, supid], function (err) {
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

    // --------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------

    //TABLE FOR SKUITEMS

    closeSkuItemTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    newSKUItemsTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS SKUITEMS (ID INTEGER PRIMARY KEY, RFID VARCHAR(32) UNIQUE, SKUId INTEGER, Available INTEGER DEFAULT 0, DateOfStock VARCHAR(16))";
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

    dropSKUItemsTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS SKUITEMS";
            this.db.run(sql, function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    getStoredSKUItemByRfid(rfid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUITEMS WHERE RFID = ?;";
            this.db.get(sql, [rfid], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    if (row != undefined) {
                        const SKUitem = {
                            id: row.ID,
                            RFID: row.RFID,
                            SKUId: row.SKUId,
                            Available: row.Available,
                            DateOfStock: row.DateOfStock
                        }
                        resolve(SKUitem);
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    getStoredSKUItems() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUITEMS;";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    const skuitems = rows.map((el) => {
                        return {
                            RFID: el.RFID,
                            SKUId: el.SKUId,
                            Available: el.Available,
                            DateOfStock: el.DateOfStock
                        }
                    });
                    resolve(skuitems);
                }
            });
        });
    }

    getAvailableSKUItems(skuid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUITEMS WHERE SKUId = ? AND Available = 1;";
            this.db.all(sql, [skuid], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    const skuitems = rows.map((el) => {
                        return {
                            RFID: el.RFID,
                            SKUId: el.SKUId,
                            DateOfStock: el.DateOfStock
                        }
                    });
                    resolve(skuitems);
                }
            });
        });
    }

    storeSKUItem(RFID, SKUId, DateOfStock) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO SKUITEMS(RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?);";
            this.db.run(sql, [RFID, SKUId, DateOfStock], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifySKUItem(newRFID, newAvailable, newDateOfStock, rfid) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE SKUITEMS SET RFID = ?, Available = ?, DateOfStock = ? WHERE RFID = ?";
            this.db.run(sql, [newRFID, newAvailable, newDateOfStock, rfid], (err) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    deleteSKUItem(rfid) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM SKUITEMS WHERE RFID=?";
            this.db.run(sql, [rfid], (err) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

}

module.exports = ItemsDAO;
