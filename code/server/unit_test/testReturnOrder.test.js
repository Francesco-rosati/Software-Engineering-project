const ReturnOrderDao = require('../modules/dbManager').ReturnOrder_DAO;

describe('ReturnOrderDao', () => {
    beforeAll(async () => {
        await ReturnOrderDao.dropReturnOrderTable();
        await ReturnOrderDao.newReturnOrderTable();
    });

    test('delete db', async () => {
        var res = await ReturnOrderDao.getAllReturnOrder();
        expect(res.length).toStrictEqual(0);
    });

    testNewReturnOrder(1, "test descriptor 1", "This test is described by...", 1);
    testNewReturnOrder(2, "test descriptor 2", "This test is described by...", 1);
    testNewReturnOrder(3, "test descriptor 3", "This test is described by...", 3);

    testDeleteReturnOrder(2);

    // CLOSE CONNECTION TO RestockOrder TABLE
    TestCloseReturnOrderTable();
    testgetReturnOrderById(1);
    testgetAllReturnOrder();
    testNewReturnOrder(1, "test descriptor 1", "This test is described by...", 1);
    testDeleteReturnOrder(2);
    TestDropAndCreateTable();

});

function testgetAllReturnOrder() {
    test('get return Order', async () => {
        try{
            var res = await ReturnOrderDao.getAllReturnOrder();
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}

function testgetReturnOrderById(id) {
    test('get return order by id', async () => {
        try{
            var res = await ReturnOrderDao.getReturnOrderById(id);
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}



function testNewReturnOrder(id, returnDate, products, restockOrderId) {
    test('create new ReturnOrder', async () => {

        try{
        await ReturnOrderDao.storeReturnOrder(returnDate, products, restockOrderId);
       
        var res = await ReturnOrderDao.getAllReturnOrder();
        expect(res.length).toStrictEqual(id);
        
        res = await ReturnOrderDao.getReturnOrderById(id);
       
        expect(res.id).toStrictEqual(id);
        expect(res.returnDate).toStrictEqual(returnDate);
        expect(res.products).toStrictEqual(products);
        expect(res.restockOrderId).toStrictEqual(restockOrderId);
        } catch(err){
            console.log("---- error -----");
        }
    });
}

function testDeleteReturnOrder(id) {
    test('delete ReturnOrder', async () => {
        try {
        await ReturnOrderDao.deleteReturnOrder(id);
        
        var res = await ReturnOrderDao.getAllReturnOrder();
        expect(res.length).toStrictEqual(2);
        
        res = await ReturnOrderDao.getReturnOrderById(id);
    
        expect(res).toStrictEqual(undefined);
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestDropAndCreateTable() {
    test('drop an create Return Order table', async () => {

        try {
            await ReturnOrderDao.newReturnOrderTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await ReturnOrderDao.dropReturnOrderTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestCloseReturnOrderTable() {
    test('close Return Order Table', async () => {

        await ReturnOrderDao.closeReturnOrderTable();
    });
}
