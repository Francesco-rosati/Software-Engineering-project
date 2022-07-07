const testSKUItemDao = require('../modules/dbManager').item_DAO;

describe ('testSKUItemDao', () => {
    beforeAll(async () => {
        await testSKUItemDao.dropSKUItemsTable();
        await testSKUItemDao.newSKUItemsTable();
    })
    test('delete db', async () => {
        var res = await testSKUItemDao.getStoredSKUItems();
        expect(res.length).toStrictEqual(0);
    });
    let counter = 1;
    testNewSKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30",counter);
    counter++;
    testNewSKUItem("12345678901234567890123456789016",34,"2022/03/10",counter);
    counter++;
    testNewSKUItem("12345678901234567890123456789017",22,"",counter);
    counter++;
    testModifySKUItem("12345678901234567890123456789018",1,"2021/11/30","12345678901234567890123456789015");
    testModifySKUItem("12345678901234567890123456789019",0,"2022/01/31 10:20","12345678901234567890123456789017");
    testDeleteSKUItem("12345678901234567890123456789016");
    testGetSKUItems();
    testGetSKUItemByRfid("12345678901234567890123456789015",1,1,"2021/11/29 12:30");
    testGetAvailableSKUItems("12345678901234567890123456789015",1,"2021/11/29 12:30");
    testDeleteSKUItem("12345678901234567890123456789015");
    testDropAndCreateTable();
    // CLOSE CONNECTION TO SKUITEM TABLE
    TestCloseSKUItemTable();
    testNewSKUItem("12345678901234567890123456789015",1,"2021/11/29 12:30",1);
    testGetSKUItems();
    testModifySKUItem("12345678901234567890123456789018",1,"2021/11/30","12345678901234567890123456789015");
    testGetSKUItemByRfid("12345678901234567890123456789015",1,1,"2021/11/29 12:30");
    testGetAvailableSKUItems("12345678901234567890123456789015",1,"2021/11/29 12:30");
    testDeleteSKUItem("12345678901234567890123456789015");
    testDropAndCreateTable();
});

function testGetSKUItems() {
    test('test get skuitems', async () => {
        try {
            var res = await testSKUItemDao.getStoredSKUItems();
            expect(res.length).toStrictEqual(3);
        } catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetSKUItemByRfid(rfid, skuid, available, dateofstock) {
    test('test get skuitem by rfid', async () => {
        try {
            var res = await testSKUItemDao.getStoredSKUItemByRfid(rfid);
            expect(res.length).toStrictEqual(1);
            expect(res.RFID).toStrictEqual(rfid);
            expect(res.SKUId).toStrictEqual(skuid);
            expect(res.Available).toStrictEqual(available);
            expect(res.DateOfStock).toStrictEqual(dateofstock);
        } catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetAvailableSKUItems(rfid, skuid, dateofstock) {
    test('test get available skuitems by skuid', async () => {
        try {
            var res = await testSKUItemDao.getAvailableSKUItems(skuid);
            expect(res.length).toStrictEqual(1);
            expect(res.RFID).toStrictEqual(rfid);
            expect(res.SKUId).toStrictEqual(skuid);
            expect(res.Available).toStrictEqual(1);
            expect(res.DateOfStock).toStrictEqual(dateofstock);
        } catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testNewSKUItem(rfid, skuid, dateofstock, counter) {
    test('create new skuitem', async () => {
        try {
            await testSKUItemDao.storeSKUItem(rfid, skuid, dateofstock);
            var res = await testSKUItemDao.getStoredSKUItems();
            expect(res.length).toStrictEqual(counter);
            res = await testSKUItemDao.getStoredSKUItemByRfid(rfid);
            expect(res.RFID).toStrictEqual(rfid);
            expect(res.SKUId).toStrictEqual(skuid);
            expect(res.Available).toStrictEqual(0);
            expect(res.DateOfStock).toStrictEqual(dateofstock);
            res = await testSKUItemDao.getAvailableSKUItems(skuid);
            expect(res.length).toStrictEqual(0);
        } catch(err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testModifySKUItem(newrfid, newavailable, newdateofstock, rfid) {
    test ('modify skuitem', async () => {
        try {
            await testSKUItemDao.modifySKUItem(newrfid, newavailable, newdateofstock, rfid);
            var res = await testSKUItemDao.getStoredSKUItemByRfid(newrfid);
            expect(res.RFID).toStrictEqual(newrfid);
            expect(res.Available).toStrictEqual(newavailable);
            expect(res.DateOfStock).toStrictEqual(newdateofstock);
        } catch(err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testDeleteSKUItem(rfid) {
    test('delete skuitem', async () => {
        try {
            await testSKUItemDao.deleteSKUItem(rfid);
            var res = await testSKUItemDao.getStoredSKUItems();
            expect(res.length).toStrictEqual(2);
            res = await testSKUItemDao.getStoredSKUItemByRfid(rfid);
            expect(res).toStrictEqual(undefined);
        } catch(err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testDropAndCreateTable() {
    test('drop an create skuitem table', async () => {
        try {
            await testSKUItemDao.dropSKUItemsTable();
        } catch (err) {
            console.log("---- error ----");
        }
        try {
            await testSKUItemDao.newSKUItemsTable();
        } catch (err) {
            console.log("---- error ----");
        }
    });
}

function TestCloseSKUItemTable() {
    test('close skuitem table', async () => {
        try {
            await testSKUItemDao.closeSkuItemTable();
        } catch (err) {
            console.log("---- error ----");
        }
    });
}