const sqlite = require("sqlite3");

const db = new sqlite.Database('EZWH.db', (err) => {
    if(err) throw err;
});

const UsersDAO = require('./UsersDAO');
const TestsDAO = require('./TestsDAO');
const Sku_Position = require('./Sku&Position');
const ItemsDAO = require('./ItemsDAO');
const InternalOrderDAO = require('./InternalOrderDAO');
const RestockOrderDAO = require('./RestockOrderDAO');
const ReturnOrderDAO = require('./ReturnOrderDAO');

const user_DAO = new UsersDAO(db);
const test_DAO = new TestsDAO(db);
const sku_positionDAO = new Sku_Position(db);
const item_DAO = new ItemsDAO(db);
const InternalOrder_DAO = new InternalOrderDAO(db);
const RestockOrder_DAO = new RestockOrderDAO(db);
const ReturnOrder_DAO = new ReturnOrderDAO(db);

module.exports = {user_DAO, test_DAO, sku_positionDAO, item_DAO, InternalOrder_DAO, RestockOrder_DAO, ReturnOrder_DAO};
