class Sku_Position {
        //TABLE FOR POSITION

        sqlite = require('sqlite3');

        constructor(db){
            this.db = db;
            this.newPositionTable();
            this.newSkusTable();
        }

        closePositionTable() {
            return new Promise((resolve, reject) => {
                this.db.close();
                resolve(true);
            });
        }
    
        dropPositionTable(){
            return new Promise((resolve,reject) => {
                const sql = "DROP TABLE IF EXISTS POSITION";
                this.db.run(sql, (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                })
    
            });
        }
    
        newPositionTable(){
            return new Promise((resolve,reject) => {
                const sql = "CREATE TABLE IF NOT EXISTS POSITION(POSITIONID VARCHAR(12) PRIMARY KEY, AISLEID VARCHAR(40), ROW VARCHAR(40), COL VARCHAR(40), MAXWEIGHT INTEGER, MAXVOLUME INTEGER, OCCUPIEDWEIGHT INTEGER, OCCUPIEDVOLUME INTEGER)";
                this.db.run(sql, (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        }

        // TEST CREATED
        // MODIFICATA DA CONTROLLARE ALTRE CHIAMATE IN ALTRI fILE
        storePosition(positionID, aisleID, row, col, maxWeight, maxVolume){
            return new Promise((resolve,reject) => {
                const sql = "INSERT INTO POSITION(POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?,?,?,?,?,?,?,?)";
                this.db.run(sql, [positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0], function (err) {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        }

        // TEST CREATED
        getStoredPositions(){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM POSITION";
                this.db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        const positions = rows.map((el) => {
                            return {
                                positionID: el.POSITIONID,
                                aisleID: el.AISLEID,
                                row: el.ROW,
                                col: el.COL,
                                maxWeight: el.MAXWEIGHT,
                                maxVolume: el.MAXVOLUME,
                                occupiedWeight: el.OCCUPIEDWEIGHT,
                                occupiedVolume: el.OCCUPIEDVOLUME
                            }
                        });
                        resolve(positions)
                    }
                })
            })
        }

        // TEST CREATED
        getPosById(posId){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM POSITION WHERE POSITIONID=?";
                this.db.get(sql, [posId], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        if(row != undefined) {
                            const position = {
                                    positionID: row.POSITIONID,
                                    aisleID: row.AISLEID,
                                    row: row.ROW,
                                    col: row.COL,
                                    maxWeight: row.MAXWEIGHT,
                                    maxVolume: row.MAXVOLUME,
                                    occupiedWeight: row.OCCUPIEDWEIGHT,
                                    occupiedVolume: row.OCCUPIEDVOLUME
                            }
                            resolve(position)
                        }
                        else resolve(undefined);
                    }
                })
            })
        }

        // TEST CREATED
        modifyPos(newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, positionID){
            return new Promise((resolve, reject) => {
                const sql = "UPDATE POSITION SET POSITIONID=?, AISLEID=?, ROW=?, COL=?, MAXWEIGHT=?, MAXVOLUME=?, OCCUPIEDWEIGHT=?, OCCUPIEDVOLUME=? WHERE POSITIONID=?";
                this.db.run(sql, [newAisleID + newRow + newCol, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, positionID], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Position successfully updated!");
                    }
                })
            })
        }
 
        // TEST CREATED
        // MODIFICATA DA CONTROLLARE ALTRE CHIAMATE IN ALTRI fILE
        modifyPositionID(newPositionID, positionID){
            return new Promise((resolve, reject) => {
                const sql = "UPDATE POSITION SET POSITIONID=?, AISLEID=?, ROW=?, COL=? WHERE POSITIONID=?";
                this.db.run(sql, [newPositionID, newPositionID.substring(0, 4), newPositionID.substring(4, 8), newPositionID.substring(8, 12), positionID], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Position ID successfully updated!");
                    }
                })
            })
        }

        
        // TEST CREATED
        reduceWVposition = async (positionID, newOccW, newOccV, occW, occV) => {
            
            const posToUpdate = await this.getPosById(positionID);
            if(posToUpdate != undefined) {
                let occW = posToUpdate.occupiedWeight;
                let occV = posToUpdate.occupiedVolume;
            
            
                return new Promise((resolve, reject) => {
                    const sql = "UPDATE POSITION SET OCCUPIEDWEIGHT=?, OCCUPIEDVOLUME=? WHERE POSITIONID=?";
                    this.db.run(sql, [occW - newOccW, occV - newOccV, positionID], (err, row) => {
                        if (err) {
                            console.log('Error running sql: ' + sql)
                            console.log(err)
                            reject(err)
                        } else {
                            resolve("Position weight and volume successfully reduced!");
                        }
                    })
                })
            }
            else return 0;
        }
        

        // TEST CREATED
        updateWVposition(positionID, newOccW, newOccV) {
            return new Promise((resolve, reject) => {
                const sql = "UPDATE POSITION SET OCCUPIEDWEIGHT=?, OCCUPIEDVOLUME=? WHERE POSITIONID=?";
                this.db.run(sql, [newOccW, newOccV, positionID], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Position weight and volume successfully updated!");
                    }
                })
            })

        }

        // TEST CREATED
        deletePosition(positionID){
            return new Promise((resolve, reject) => {
                const sql = "DELETE FROM POSITION WHERE POSITIONID=?";
                this.db.run(sql, [positionID], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Position successfully deleted!")
                    }
                })
            })
        }

        // ------------- SKU ------------------------------------------

        closeSkusTable() {
            return new Promise((resolve, reject) => {
                this.db.close();
                resolve(true);
            });
        }

        dropSkuTable(){
            return new Promise((resolve,reject) => {
                const sql = "DROP TABLE IF EXISTS SKU";
                this.db.run(sql, (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                })
    
            });
        }
    
        newSkusTable(){
            return new Promise((resolve,reject) => {
                const sql = "CREATE TABLE IF NOT EXISTS SKU(ID INTEGER PRIMARY KEY AUTOINCREMENT, DESCRIPTION VARCHAR(50), WEIGHT INTEGER, VOLUME INTEGER, POSITION VARCHAR(12), NOTES VARCHAR(50), PRICE FLOAT, AVAILABLEQUANTITY INTEGER, TESTDESCRIPTOR VARCHAR(50))";
                this.db.run(sql, (err) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        }

        // TEST CREATED
        // MODIFICATA DA CONTROLLARE ALTRE CHIAMATE IN ALTRI fILE
        storeSku(description, weight, volume, notes, price, availableQuantity){
            return new Promise((resolve,reject) => {
                const sql = "INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?,?,?,?,?,?)";
                this.db.run(sql, [description, weight, volume, notes, price, availableQuantity], function (err) {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        }

        // TEST CREATED
        getStoredSkus(){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM SKU";
                this.db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        const skus = rows.map((el) => {
                            let testDesc;
                            if(el.TESTDESCRIPTOR === null) {
                                testDesc = null;
                            }
                            else {
                                testDesc = "[" + el.TESTDESCRIPTOR +  "]"
                            }
                            return {
                                id: el.ID,
                                description: el.DESCRIPTION,
                                weight: el.WEIGHT,
                                volume: el.VOLUME,
                                notes: el.NOTES,
                                position: el.POSITION,
                                availableQuantity: el.AVAILABLEQUANTITY,
                                price: el.PRICE,
                                testDescriptors: testDesc
                            }
                        });
                        resolve(skus)
                    }
                })
            })
        }

        // TEST CREATED
        getStoredSkuById(id){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM SKU WHERE ID=?";
                this.db.get(sql, [id], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        if (row != undefined) {
                            let testDesc;
                            if(row.TESTDESCRIPTOR === null) {
                                testDesc = null;
                            }
                            else {
                                testDesc = "[" + row.TESTDESCRIPTOR +  "]"
                            }
                            const sku = {
                                    description: row.DESCRIPTION,
                                    weight: row.WEIGHT,
                                    volume: row.VOLUME,
                                    notes: row.NOTES,
                                    position: row.POSITION,
                                    availableQuantity: row.AVAILABLEQUANTITY,
                                    price: row.PRICE,
                                    testDescriptors: testDesc
                                }
                                resolve(sku)
                            }
                        else resolve(undefined);
                    }
                })
            })
        }

        // TEST CREATED
        getPosOccupied(posID){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM SKU WHERE POSITION=?";
                this.db.get(sql, [posID], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        if (row != undefined) {
                            let testDesc;
                            if(row.TESTDESCRIPTOR === null) {
                                testDesc = null;
                            }
                            else {
                                testDesc = "[" + row.TESTDESCRIPTOR +  "]"
                            }
                            const sku = {
                                    description: row.DESCRIPTION,
                                    weight: row.WEIGHT,
                                    volume: row.VOLUME,
                                    notes: row.NOTES,
                                    position: row.POSITION,
                                    availableQuantity: row.AVAILABLEQUANTITY,
                                    price: row.PRICE,
                                    testDescriptors: testDesc
                                }
                                resolve(sku)
                            }
                        else resolve(undefined);
                    }
                })
            })
        }

        // TEST CREATED
        setTestDescriptorSku = async (testId, id)  => {
            const sku = await this.getStoredSkuById(id);
            const testdesc = sku.testDescriptors;
            let updatedTests;
            if(testdesc === "[null]" || testdesc === undefined || testdesc === null) {
                updatedTests = testId.toString();
            }
            else {
                updatedTests = (testdesc.slice(1, -1) + "," + testId.toString()).split(",").sort((a, b) => a - b).join(',').toString();
            }

            return new Promise((resolve, reject) => {
                const sql = "UPDATE SKU SET TESTDESCRIPTOR=? WHERE ID=?";
                this.db.run(sql, [updatedTests, id], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Sku successfully updated!");
                    }
                })
            })
        }

        // TEST CREATED
        deleteTestDescriptorSku = async (testId, id)  => {
            const sku = await this.getStoredSkuById(id);
            const testdesc = sku.testDescriptors;
            if(testdesc === null || testdesc === "")
                return;

            const descList = testdesc.slice(1, -1).split(",");
            let newDescList = descList.filter(el => el != testId.toString()).join(',').toString();
            if(newDescList.length === 0) {
                newDescList = null;
            }

            return new Promise((resolve, reject) => {
                const sql = "UPDATE SKU SET TESTDESCRIPTOR=? WHERE ID=?";
                this.db.run(sql, [newDescList, id], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Sku successfully updated!");
                    }
                })
            })

        }

        // TEST CREATED
        // MODIFICATA DA CONTROLLARE ALTRE CHIAMATE IN ALTRI fILE
        modifySku(newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, id){
            return new Promise((resolve, reject) => {
                const sql = "UPDATE SKU SET DESCRIPTION=?, WEIGHT=?, VOLUME=?, NOTES=?, PRICE=?, AVAILABLEQUANTITY=? WHERE ID=?";
                this.db.run(sql, [newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, id], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Sku successfully updated!");
                    }
                })
            })
        }

        // TEST CREATED
        updateSkuPosition(newPos, oldPos){
            return new Promise((resolve, reject) => {
                const sql = "UPDATE SKU SET POSITION=? WHERE POSITION=?";
                this.db.run(sql, [newPos, oldPos], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Sku Position successfully updated!");
                    }
                })
            })
        }

        // TEST CREATED
        modifySkuPosition(position, id){
            return new Promise((resolve, reject) => {
                const sql = "UPDATE SKU SET POSITION=? WHERE ID=?";
                this.db.run(sql, [position, id], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Sku Position successfully updated!");
                    }
                })
            })
        }


        // TEST CREATED
        modifyTestDescSku = async (testId, newIdSKU, oldIdSKU) => {
            if(newIdSKU === oldIdSKU)
                return 0;
            // Elimiare dal vecchio SKU il testDesc
            await this.deleteTestDescriptorSku(testId, oldIdSKU);

            // Aggiungere al nuovo SKU il TestDesc
            await this.setTestDescriptorSku(testId, newIdSKU);

            return 1;
        }

        // TEST CREATED
        deleteSku(id){
            return new Promise((resolve, reject) => {
                const sql = "DELETE FROM SKU WHERE ID=?";
                this.db.run(sql, [id], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Sku successfully deleted!")
                    }
                })
            })
        }

        // TEST CREATED
        deleteSkuPos(posID){ 
            return new Promise((resolve, reject) => {
                const sql = "UPDATE SKU SET POSITION=? WHERE POSITION=?";
                this.db.run(sql, [null, posID], (err, row) => {
                    if (err) {
                        console.log('Error running sql: ' + sql)
                        console.log(err)
                        reject(err)
                    } else {
                        resolve("Position successfully deleted!")
                    }
                })
            })
        }
}

module.exports = Sku_Position;
