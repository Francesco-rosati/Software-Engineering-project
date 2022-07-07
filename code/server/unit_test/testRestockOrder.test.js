const RestockOrderDao = require('../modules/dbManager').RestockOrder_DAO;

describe('RestockOrderDao', () => {
    beforeAll(async () => {
        await RestockOrderDao.dropRestockOrderTable();
        await RestockOrderDao.newRestockOrderTable();
    });

    test('delete db', async () => {
        var res = await RestockOrderDao.getAllRestockOrder();
        expect(res.length).toStrictEqual(0);
    });

    testNewRestockOrder(1, "11/11/1111", "[{SKUId:1, itemId:10, description:1product,price:111,qty:1}]", 1 );
    testNewRestockOrder(2, "22/22/2222", "[{SKUId:3, itemId:10, description:2product,price:222,qty:2)", 2);
    testNewRestockOrder(3, "33/33/3333", "[{SKUId:4, itemId:10, description:3product,price:333,qty:3}]", 3);
  
    testDeleteRestockOrder(2);

    testModifyRestockOrderState(1, "DELIVERED");
    testModifyRestockOrderSkuItems(1, [{SKUId:1,"itemId":10,rfid:12345678901234567890123456789016}], [{SKUId:2, "itemId":10,rfid:12345678901234567890123456789017}]);
    testModifyRestockOrderSkuItems(1, null, [{SKUId:2, "itemId":10, rfid:12345678901234567890123456789017}]);
    testModifyRestockOrderTransportNote(1, {"deliveryDate":"2021/12/29"});

    // CLOSE CONNECTION TO RestockOrder TABLE
    TestCloseRestockOrderTable();

    testgetAllRestockOrder();
    testgetRestockOrderIssued();
    testgetRestockOrderById(1);
    testgetRestockOrderReturnItemsById(1);

    testModifyRestockOrderState(1, "DELIVERED");
    testModifyRestockOrderSkuItems(1, [{SKUId:1, "itemId":10, rfid:12345678901234567890123456789016}], [{SKUId:2,"itemId":10, rfid:12345678901234567890123456789017}]);
    testModifyRestockOrderSkuItems(1, null, [{SKUId:2,"itemId":10, rfid:12345678901234567890123456789017}]);
    testModifyRestockOrderTransportNote(1, {"deliveryDate":"2021/12/29"});

    testNewRestockOrder(1, "11/11/1111", "[{SKUId:1, itemId:10,description:1product,price:111,qty:1}]", 1 );
    testDeleteRestockOrder(2);
    testModifyRestockOrderState(1, "DELIVERED");
    TestDropAndCreateTable();

});

function testNewRestockOrder(id, issueDate, products, supplierId) {
    test('create new RestockOrder', async () => {
        try{
        await RestockOrderDao.storeRestockOrder(issueDate, products, supplierId);
        }catch(err){
            console.log("--- error ---");
            return;
        }
        var res = await RestockOrderDao.getAllRestockOrder();
        expect(res.length).toStrictEqual(id);
        
        res = await RestockOrderDao.getRestockOrderById(id);
        expect(res.id).toStrictEqual(id);
        expect(res.issueDate).toStrictEqual(issueDate);
        expect(res.products).toStrictEqual(products);
        expect(res.supplierId).toStrictEqual(supplierId);

        var res = await RestockOrderDao.getRestockOrderIssued();
        expect(res.length).toStrictEqual(id);
        for (const iterator of res) {
            
            expect(iterator.state).toEqual("ISSUED");
        }
    
    });
}


function testgetAllRestockOrder() {
    test('testgetAllRestockOrder', async () => {
        try{
            var res = await RestockOrderDao.getAllRestockOrder();
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}

function testgetRestockOrderIssued() {
    test('getRestockOrderIssued', async () => {
        try{
            var res = await RestockOrderDao.getRestockOrderIssued();
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}


function testgetRestockOrderById(id) {
    test('testgetRestockOrderById', async () => {
        try{
            var res = await RestockOrderDao.getRestockOrderById(id);
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}

function testgetRestockOrderReturnItemsById(id) {
    test('testgetRestockOrderReturnItemsById', async () => {
        try{
            var res = await RestockOrderDao.getRestockOrderReturnItemsById(id);
           
        }catch(err){
            console.log("--- error ---");
            return;
        }
       
    });
}


function testDeleteRestockOrder(id) {
    test('delete RestockOrder', async () => {
        
        try{
        await RestockOrderDao.deleteRestockOrder(id);
        }catch(err){
            console.log("--- error ---");
            return;
        }
        var res = await RestockOrderDao.getAllRestockOrder();
        expect(res.length).toStrictEqual(2);
        
        res = await RestockOrderDao.getRestockOrderById(id);

        expect(res).toStrictEqual(undefined);
    });
}

function testModifyRestockOrderState(id, newstate) {
    test('modify RestockOrder State', async () => {
        
        try{
        await RestockOrderDao.modifyRestockOrderState(newstate, id)
        }catch(err){
            console.log("--- error ---");
            return;
        }
        res = await RestockOrderDao.getRestockOrderById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.state).toStrictEqual(newstate);

    });
}


function testModifyRestockOrderSkuItems(id, oldSkuItems, newSkuItems) {
    test('modify RestockOrder SkuItems', async () => {
        
        try{
        await RestockOrderDao.modifyRestockOrderSKUItemsById(oldSkuItems, newSkuItems, id) 
        }catch(err){
            console.log("--- error ---");
            return;
        }

        res = await RestockOrderDao.getRestockOrderById(id);

        expect(res.id).toStrictEqual(id);
        if(oldSkuItems!==null){
            let mergedSkuItems = oldSkuItems.concat(newSkuItems);
            expect(res.skuItems).toStrictEqual(mergedSkuItems);

            res = await RestockOrderDao.getRestockOrderReturnItemsById(id);
            expect(res.skuItems).toStrictEqual(mergedSkuItems);

        }else{
            expect(res.skuItems).toStrictEqual(newSkuItems);

            res = await RestockOrderDao.getRestockOrderReturnItemsById(id);
            expect(res.skuItems).toStrictEqual(newSkuItems);
        }

    });
}


function testModifyRestockOrderTransportNote(id, newtransportNote) {
    test('modify RestockOrder transportNote', async () => {
         
        try{
        await RestockOrderDao.modifyRestockOrderTransportNote(newtransportNote, id);
        }catch(err){
            console.log("--- error ---");
            return;
        }
        res = await RestockOrderDao.getRestockOrderById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.transportNote).toStrictEqual(newtransportNote);

    });
}


function TestDropAndCreateTable() {
    test('drop an create Restock Order table', async () => {

        try {
            await RestockOrderDao.newRestockOrderTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await RestockOrderDao.dropRestockOrderTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestCloseRestockOrderTable() {
    test('close Restock Order Table', async () => {

        await RestockOrderDao.closeRestockOrderTable();
    });
}