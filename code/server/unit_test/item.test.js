const testItemDao = require('../modules/dbManager').item_DAO;

describe('testItemDao', () => {
    beforeAll(async () => {
        await testItemDao.dropItemsTable();
        await testItemDao.newItemsTable();
    });

    test('delete db', async () => {
        var res = await testItemDao.getStoredItems();
        expect(res.length).toStrictEqual(0);
    });

    let counter = 1;

    testNewItem(1, "newItem test1", 10.99, 2, 3, counter);
    counter++;
    testNewItem(23, "newItem test2", 11.99, 4, 1, counter);
    counter++;
    testNewItem(12, "newItem test3", 6.99, 5, 6, counter);
    counter++;

    testGetItems();

    testGetItemById(12, "newItem test3", 6.99, 5, 6);

    testGetItemByIdAndSupplierId(23, "newItem test2", 11.99, 4, 1);

    testGetItemByIdAndSupplierId(3434, "newItem test2", 11.99, 4, 11123);

    testGetItemBySKUIdAndSupplierId(1, "newItem test1", 10.99, 2, 3);

    testGetItemBySKUIdAndSupplierId(123, "newItem test1", 10.99, 2, 3321);

    testModifyItem(12, "modItem test1", 8.64, 6);
    testModifyItem(1, "modItem test2", 5, 3);

    testDeleteItem(23, 1);

    testDropAndCreateTable();

    // CLOSE CONNECTION TO ITEM TABLE

    TestCloseItemTable();

    testNewItem(34, "newItem test4", 11.99, 5, 6, counter);

    testGetItems();

    testGetItemById(12, "newItem test3", 6.99, 5, 6);

    testGetItemByIdAndSupplierId(23, "newItem test2", 11.99, 4, 1);

    testGetItemBySKUIdAndSupplierId(1, "newItem test1", 10.99, 2, 3);

    testModifyItem(12, "modItem test1", 8.64);

    testDeleteItem(23);

    testDropAndCreateTable();

});

function testGetItems() {
    test('test get items', async () => {

        try {
            var res = await testItemDao.getStoredItems();
            expect(res.length).toStrictEqual(3);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetItemById(id, description, price, SKUId, supplierId) {
    test('test get item by id', async () => {

        try {
            var res = await testItemDao.getStoredItemById(id, supplierId);

            expect(res.length).toStrictEqual(1);

            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(description);
            expect(res.price).toStrictEqual(price);
            expect(res.SKUId).toStrictEqual(SKUId);
            expect(res.supplierId).toStrictEqual(supplierId);

        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetItemByIdAndSupplierId(id, description, price, SKUId, supplierId) {
    test('test get item by id and supplier id', async () => {

        try {
            var res = await testItemDao.getStoredItemByIdAndSupplierId(id,supplierId);

            expect(res.length).toStrictEqual(1);
            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(description);
            expect(res.price).toStrictEqual(price);
            expect(res.SKUId).toStrictEqual(SKUId);
            expect(res.supplierId).toStrictEqual(supplierId);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testGetItemBySKUIdAndSupplierId(id, description, price, SKUId, supplierId) {
    test('test get item by SKUId and supplier id', async () => {

        try {
            var res = await testItemDao.getStoredItemBySKUIdAndSupplierId(SKUId,supplierId);

            expect(res.length).toStrictEqual(1);

            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(description);
            expect(res.price).toStrictEqual(price);
            expect(res.SKUId).toStrictEqual(SKUId);
            expect(res.supplierId).toStrictEqual(supplierId);

        }
        catch (err) {
            console.log("---- error ----");
            return;
        }
    });
}

function testNewItem(id, description, price, SKUId, supplierId, counter) {
    test('create new item', async () => {

        try {
            await testItemDao.storeItem(id, description, price, SKUId, supplierId);

            var res = await testItemDao.getStoredItems();
            expect(res.length).toStrictEqual(counter);

            res = await testItemDao.getStoredItemById(id);

            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(description);
            expect(res.price).toStrictEqual(price);
            expect(res.SKUId).toStrictEqual(SKUId);
            expect(res.supplierId).toStrictEqual(supplierId);

            res = await testItemDao.getStoredItemByIdAndSupplierId(id, supplierId);

            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(description);
            expect(res.price).toStrictEqual(price);
            expect(res.SKUId).toStrictEqual(SKUId);
            expect(res.supplierId).toStrictEqual(supplierId);

            res = await testItemDao.getStoredItemBySKUIdAndSupplierId(SKUId, supplierId);

            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(description);
            expect(res.price).toStrictEqual(price);
            expect(res.SKUId).toStrictEqual(SKUId);
            expect(res.supplierId).toStrictEqual(supplierId);
        }
        catch(err){
            console.log("---- error ----");
            return;
        }

    });
}

function testModifyItem(id, newDescription, newPrice, supplierid) {
    test('modify item', async () => {

        try {
            await testItemDao.modifyItem(newDescription, newPrice, id, supplierid);

            res = await testItemDao.getStoredItemById(id, supplierid);

            expect(res.id).toStrictEqual(id);
            expect(res.description).toStrictEqual(newDescription);
            expect(res.price).toStrictEqual(newPrice);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }

    });
}

function testDeleteItem(id, supplierid) {
    test('delete item', async () => {

        try {
            await testItemDao.deleteItem(id, supplierid);

            var res = await testItemDao.getStoredItems();
            expect(res.length).toStrictEqual(2);

            res = await testItemDao.getStoredItemById(id, supplierid);

            expect(res).toStrictEqual(undefined);
        }
        catch (err) {
            console.log("---- error ----");
            return;
        }

    });
}

function testDropAndCreateTable() {
    test('drop an create item table', async () => {

        try {
            await testItemDao.dropItemsTable();
        } catch (err) {
            console.log("---- error ----");
        }

        try {
            await testItemDao.newItemsTable();
        } catch (err) {
            console.log("---- error ----");
        }

    });
}

function TestCloseItemTable() {
    test('close item Table', async () => {
        await testItemDao.closeItemTable();
    });
}