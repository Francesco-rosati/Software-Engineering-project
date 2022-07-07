class TestsDAO {

    sqlite = require('sqlite3');

    constructor(db) {
        this.db = db;
        this.newTestDescriptorTable();
        this.newTestResultTable();
    }

    //TABLE FOR TEST RESULTS

    closeTestResultTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    newTestResultTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS TEST_RESULT(ID INTEGER PRIMARY KEY AUTOINCREMENT, RFID VARCHAR(32), ID_TEST_DESCRIPTOR INTEGER, DATE VARCHAR(10) NOT NULL, RESULT BIT);";
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

    dropTestResultTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS TEST_RESULT;";
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

    getStoredTestResults(rfid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_RESULT WHERE RFID = ?";
            this.db.all(sql, [rfid], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    const testResults = rows.map((el) => {
                        return {
                            id: el.ID,
                            idTestDescriptor: el.ID_TEST_DESCRIPTOR,
                            Date: el.DATE,
                            Result: Boolean(el.RESULT)
                        }
                    });
                    resolve(testResults);
                }
            })
        })
    }

    getStoredTestResultById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_RESULT WHERE ID = ?;";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    if (row != undefined) {
                        const testResult = {
                            id: row.ID,
                            idTestDescriptor: row.ID_TEST_DESCRIPTOR,
                            Date: row.DATE,
                            Result: Boolean(row.RESULT)
                        }
                        resolve(testResult)
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    // Test CREATED
    getStoredTestResultByIdAndRfid(id, rfid) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_RESULT WHERE ID = ? AND RFID = ?;";
            this.db.get(sql, [id, rfid], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    if (row != undefined) {
                        const testResult = {
                            id: row.ID,
                            idTestDescriptor: row.ID_TEST_DESCRIPTOR,
                            Date: row.DATE,
                            Result: Boolean(row.RESULT)
                        }
                        resolve(testResult)
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    // Test CREATED
    storeTestResult(rfid, idTestDescriptor, date, result) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO TEST_RESULT(RFID, ID_TEST_DESCRIPTOR, DATE, RESULT) VALUES (?,?,?,?)";
            this.db.run(sql, [rfid, idTestDescriptor, date, result], function (err) {
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

// Test CREATED
    modifyTestResult(idTestDesc, Date, result, id, rfid) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE TEST_RESULT SET ID_TEST_DESCRIPTOR = ?, DATE = ?, RESULT = ? WHERE ID = ? AND RFID = ?;";
            this.db.run(sql, [idTestDesc, Date, result, id, rfid], function (err) {
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

    // Test CREATED
    deleteTestResult(id, rfid) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM TEST_RESULT WHERE ID = ? AND RFID = ?;";
            this.db.run(sql, [id, rfid], function (err) {
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

    //TABLE FOR TEST DESCRIPTORS

    closeTestDescriptorTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    newTestDescriptorTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR(255), PROCEDURE_DESCRIPTION VARCHAR(255), IDSKU INTEGER);";
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

    dropTestDescriptorTable() {
        return new Promise((resolve, reject) => {
            //const sql = "DROP TABLE TEST_DESCRIPTOR;";
            const sql = "DROP TABLE IF EXISTS TEST_DESCRIPTOR;";
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

    getStoredTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_DESCRIPTOR;";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    const testDescriptors = rows.map((el) => {
                        return {
                            id: el.ID,
                            name: el.NAME,
                            procedureDescription: el.PROCEDURE_DESCRIPTION,
                            idSKU: el.IDSKU
                        }
                    });
                    resolve(testDescriptors);
                }
            })
        })
    }

    getStoredTestDescriptorById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_DESCRIPTOR WHERE ID = ?;";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    if (row !== undefined) {
                        const testDescriptor = {
                            id: row.ID,
                            name: row.NAME,
                            procedureDescription: row.PROCEDURE_DESCRIPTION,
                            idSKU: row.IDSKU
                        }
                        resolve(testDescriptor)
                    }
                    else resolve(undefined);
                }
            })
        })
    }

    storeTestDescriptor(name, procedureDescription, idSKU) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO TEST_DESCRIPTOR(NAME, PROCEDURE_DESCRIPTION, IDSKU) VALUES (?,?,?)";
            this.db.run(sql, [name, procedureDescription, idSKU], function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                    return 0;
                }
                resolve(this.lastID);
            });
        });
    }

    modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE TEST_DESCRIPTOR SET NAME = ?, PROCEDURE_DESCRIPTION = ?, IDSKU = ? WHERE ID = ?;";
            this.db.run(sql, [newName, newProcedureDescription, newIdSKU, id], function (err) {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err)
                    reject(err)
                } else {
                    resolve(true);
                }
            })
        })
    }

    deleteTestDescriptor(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM TEST_DESCRIPTOR WHERE ID = ?;";
            this.db.run(sql, [id], function (err) {
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
};



module.exports = TestsDAO;