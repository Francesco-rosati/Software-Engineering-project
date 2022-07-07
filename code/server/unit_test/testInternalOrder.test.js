const InternalOrderDao = require('../modules/dbManager').InternalOrder_DAO;

describe('InternalOrderDao', () => {
    beforeAll(async () => {
        await InternalOrderDao.dropInternalOrderTable();
        await InternalOrderDao.newInternalOrderTable();
    });

    test('delete db', async () => {
        var res = await InternalOrderDao.getAllInternalOrders();
        expect(res.length).toStrictEqual(0);
    });
 
    testNewInternalOrder(1, "11/11/1111", "[{SKUId:1,description:1product,price:111,qty:1}]", 1 );
    testNewInternalOrder(2, "22/22/2222", "[{SKUId:2,description:2product,price:222,qty:2}]", 2 );
    testNewInternalOrder(3, "33/33/3333", "[{SKUId:3,description:3product,price:333,qty:3}]", 3 );
    testNewInternalOrder(4, "33/33/3333", "[{SKUId:3,description:3product,price:333,qty:3}]", 3 );
  
    testDeleteInternalOrder(2);

    testModifyInternalOrder(1, "ACCEPTED");
    testModifyInternalOrder(3, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);

    // CLOSE CONNECTION TO InternalOrder TABLE
    TestCloseInternalOrderTable();

    testNewInternalOrder(1, "11/11/1111", "[{SKUId:1,description:1product,price:111,qty:1}]", 1 );
    testModifyInternalOrder(3, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);
    testDeleteInternalOrder(2);
    testModifyInternalOrder(1, "ACCEPTED");
    testgetAllInternalOrders();
    testgetInternalOrdersIssued();
    testgetInternalOrdersAccepted();
    testgetInternalOrdersById(1);

    TestDropAndCreateTable();

});

function testNewInternalOrder(id, issueDate, products, customerId) {
    test('create new InternalOrder', async () => {
        try{
        await InternalOrderDao.storeInternalOrder(issueDate, products, customerId);
        }catch(err){
            console.log("--- error ---");
            return;
        }
        var res = await InternalOrderDao.getAllInternalOrders();
        expect(res.length).toStrictEqual(id);

        res = await InternalOrderDao.getInternalOrdersById(id); 
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(issueDate);
        expect(res.products).toStrictEqual(products);
        expect(res.customerId).toStrictEqual(customerId);
       
    });
}


function testgetAllInternalOrders() {
    test('create new InternalOrder', async () => {
        try{
            var res = await InternalOrderDao.getAllInternalOrders();
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}

function testgetInternalOrdersIssued() {
    test('create new InternalOrder', async () => {
        try{
            var res = await InternalOrderDao.getInternalOrdersIssued();
    
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}


function testgetInternalOrdersAccepted() {
    test('create new InternalOrder', async () => {
        try{
            var res = await InternalOrderDao.getInternalOrdersAccepted();
          
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}

function testgetInternalOrdersById() {
    test('create new InternalOrder', async () => {
        try{
            var res = await InternalOrderDao.getInternalOrdersById();
            expect(res.length).toStrictEqual(id);
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}

function testDeleteInternalOrder(id) {
    test('delete InternalOrder', async () => {
        try{
        await InternalOrderDao.deleteInternalOrder(id);
        }catch(err){
            console.log("--- error ---");
            return;
        }
        var res = await InternalOrderDao.getAllInternalOrders();
        expect(res.length).toStrictEqual(3);
        
        res = await InternalOrderDao.getInternalOrdersById(id);

        expect(res).toStrictEqual(undefined);
    });
}

function testModifyInternalOrder(id, newstate, newproducts) {
    test('modify InternalOrder', async () => {
        
        try{
        await InternalOrderDao.modifyInternalOrder(newstate, newproducts, id)
        }catch(err){
            console.log("--- error ---");
            return;
        }
        res = await InternalOrderDao.getInternalOrdersById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.state).toStrictEqual(newstate);
        if(newproducts!==undefined){
        expect(res.products).toStrictEqual(newproducts);
        }
        if(newstate==="COMPLETED"){
            res = await InternalOrderDao.getInternalOrdersIssued();
            expect(res.length).toStrictEqual(1);
            for (const iterator of res) {
                expect(iterator.state).toEqual("ISSUED");
            }
        }
        if(newstate==="ACCEPTED"){
            res = await InternalOrderDao.getInternalOrdersAccepted();
            expect(res.length).toStrictEqual(1);
            for (const iterator of res) {
                expect(iterator.state).toEqual("ACCEPTED");
            }
          
        }


    });
}

function TestDropAndCreateTable() {
    test('drop an create Internal Order table', async () => {

        try {
            await InternalOrderDao.newInternalOrderTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await InternalOrderDao.dropInternalOrderTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestCloseInternalOrderTable() {
    test('close Internal Order Table', async () => {

        await InternalOrderDao.closeInternalOrderTable();
    });
}