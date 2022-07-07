class ReturnOrderDAO {

    //TABLE FOR ReturnOrders

    sqlite = require('sqlite3');

    constructor(db){
        this.db = db;
        this.newReturnOrderTable();
    }

    closeReturnOrderTable() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve(true);
        });
    }

    dropReturnOrderTable(){
        return new Promise((resolve,reject) => {
            const sql = "DROP TABLE IF EXISTS RETURNORDERS";
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        });
    }

    newReturnOrderTable(){
        return new Promise((resolve,reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS RETURNORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT, RETURNDATE VARCHAR(16), PRODUCTS VARCHAR, RESTOCKORDERID INTEGER)";
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getAllReturnOrder(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM RETURNORDERS";
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    const items = rows.map((el) => {
                        return {
                            id: el.ID,
                            returnDate: el.RETURNDATE,
                            products: JSON.parse(el.PRODUCTS),
                            restockOrderId: el.RESTOCKORDERID
                        }
                    });
                    resolve(items)
                }  
            })
        });

    }

    getReturnOrderById(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM RETURNORDERS WHERE ID=?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                }else {
                    if (row!=undefined){
                        const item = {
                            id: row.ID,
                            returnDate: row.RETURNDATE,
                            products: JSON.parse(row.PRODUCTS),
                            restockOrderId: row.RESTOCKORDERID
                        }
                    resolve(item)
                }else resolve(undefined)
                }
            })
        })
    }

    
    storeReturnOrder(returnDate, products, restockOrderId){
        return new Promise((resolve,reject) => {
            const sql = "INSERT INTO RETURNORDERS(RETURNDATE, PRODUCTS, RESTOCKORDERID) VALUES (?,?,?)";
            this.db.run(sql, [returnDate, JSON.stringify(products), restockOrderId], function (err) {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }


    deleteReturnOrder(id){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM RETURNORDERS WHERE ID=?";
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

module.exports = ReturnOrderDAO;