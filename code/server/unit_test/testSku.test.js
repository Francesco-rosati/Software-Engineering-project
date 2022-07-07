const skuDao = require('../modules/dbManager').sku_positionDAO;

describe('sku Dao', () => {
    beforeAll(async () => {
        await skuDao.dropSkuTable();
        await skuDao.newSkusTable();
    });

    test('delete db', async () => {
        var res = await skuDao.getStoredSkus();
        expect(res.length).toStrictEqual(0);
    });

    testNewSku(1, "Desc sku 1", 10, 20, "Notes sku 1", 13.99, 25);
    testNewSku(2, "Desc sku 2", 40, 30, "Notes sku 2", 16.99, 5);
    TestSetTestDescriptorSku(1, 2);
    testNewSku(3, "Desc sku 3", 20, 10, "Notes sku 3", 12.99, 20);

    TestGetStoredSkus();

    testDeleteSku(2);

    testModifySku(3, "Mod sku 3", 20, 30, "Notes mod sku 3", 14.99, 15)

    TestModifySkuPosition("987654321089", 1);
    TestModifySkuPosition("987654321777", 3);

    testGetPosOccupied(1, "Desc sku 1", 10, 20, "Notes sku 1", 13.99, 25, "987654321089");
    testGetPosOccupied(4, "Desc sku 4", 20, 40, "Notes sku 4", 14.99, 15, "987123321111");

    TestUpdateSkuPosition(1,"010199998888", "987654321089")

    TestDeleteSkuPos(1, "010199998888");

    TestSetTestDescriptorSku(1, 3);
    TestSetTestDescriptorSku(2, 3);

    testGetPosOccupied(3, "Mod sku 3", 20, 30, "Notes mod sku 3", 14.99, 15, "987654321777");

    TestDeleteTestDescriptorSku(2, 1);
    TestDeleteTestDescriptorSku(1, 3);
    TestDeleteTestDescriptorSku(2, 3);

    TestModifyTestDescSku(2, 1, 3);
    TestModifyTestDescSku(2, 3, 3);

    // CLOSE CONNECTION TO SKU TABLE
    TestCloseSkusTable();

    testNewSku(1, "Desc sku 1", 10, 20, "Notes sku 1", 13.99, 25);

    TestSetTestDescriptorSku(1, 2);

    TestGetStoredSkus();

    TestModifyTestDescSku(2, 1, 3);

    TestDeleteTestDescriptorSku(2, 3);

    testDeleteSku(2);

    testModifySku(3, "Mod sku 3", 20, 30, "Notes mod sku 3", 14.99, 15)

    TestModifySkuPosition("987654321089", 1);

    testGetPosOccupied(1, "Desc sku 1", 10, 20, "Notes sku 1", 13.99, 25, "887654321089"); // ?

    TestUpdateSkuPosition(1,"010199998888", "987654321089")

    TestDeleteSkuPos(1, "010199998888");

    testDropAndCreateTable();
});

function testNewSku(id, description, weight, volume, notes, price, availableQuantity) {
    test('create new Sku', async () => {

        try {
            await skuDao.storeSku(description, weight, volume, notes, price, availableQuantity);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        var res = await skuDao.getStoredSkus();
        expect(res.length).toStrictEqual(id);
        
        res = await skuDao.getStoredSkuById(id);

        expect(res.description).toStrictEqual(description);
        expect(res.weight).toStrictEqual(weight);
        expect(res.volume).toStrictEqual(volume);
        expect(res.notes).toStrictEqual(notes);
        expect(res.price).toStrictEqual(price);
        expect(res.availableQuantity).toStrictEqual(availableQuantity);
    });
}

function TestGetStoredSkus() {
    test('get all Skus', async () => {
        try {
            res = await skuDao.getStoredSkus();
        } catch(err){
            console.log("---- error -----");
            return;
        }

        expect(res.length).toStrictEqual(3);

    });
}

function testDeleteSku(id) {
    test('delete Sku', async () => {

        try {
            await skuDao.deleteSku(id);
        } catch(err){
            console.log("---- error -----");
            return;
        }
            
        var res = await skuDao.getStoredSkus();
        expect(res.length).toStrictEqual(2);
        
        res = await skuDao.getStoredSkuById(id);

        expect(res).toStrictEqual(undefined);
    });
}

function testModifySku(id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) {
    test('Modify Sku', async () => {

        try {
            await skuDao.modifySku(newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, id)
        } catch(err){
            console.log("---- error -----");
            return;
        }
            
        res = await skuDao.getStoredSkuById(id);

        expect(res.description).toStrictEqual(newDescription);
        expect(res.weight).toStrictEqual(newWeight);
        expect(res.volume).toStrictEqual(newVolume);
        expect(res.notes).toStrictEqual(newNotes);
        expect(res.price).toStrictEqual(newPrice);
        expect(res.availableQuantity).toStrictEqual(newAvailableQuantity);
    });
}

function TestModifySkuPosition(positionID, id) {
    test('Insert positionID in Sku', async () => {

        try {
            await skuDao.modifySkuPosition(positionID, id)
        } catch(err){
            console.log("---- error -----");
            return;
        }
            
        res = await skuDao.getStoredSkuById(id);
        expect(res.position).toStrictEqual(positionID);
    });
}

function testGetPosOccupied(id, description, weight, volume, notes, price, availableQuantity, positionID) {
    test('Get sku with a certain position', async () => {

        if(positionID === "987123321111") {
            res = await skuDao.getPosOccupied(positionID);
            expect(res).toStrictEqual(undefined);
            return;
        }

        try {
            res = await skuDao.getPosOccupied(positionID);
        } catch(err){
            console.log("---- error -----");
            return;
        }

        expect(res.description).toStrictEqual(description);
        expect(res.weight).toStrictEqual(weight);
        expect(res.volume).toStrictEqual(volume);
        expect(res.notes).toStrictEqual(notes);
        expect(res.position).toStrictEqual(positionID);
        expect(res.price).toStrictEqual(price);
        expect(res.availableQuantity).toStrictEqual(availableQuantity);
    });
}

function TestUpdateSkuPosition(id, newPositionID, oldPositionID) {
    test('Modify the position of a Sku given his previous positionID', async () => {

        try {
            await skuDao.updateSkuPosition(newPositionID, oldPositionID);
        } catch(err){
            console.log("---- error -----");
            return;
        }

        res = await skuDao.getStoredSkuById(id);

        expect(res.position).toStrictEqual(newPositionID);
    });
}

function TestDeleteSkuPos(id, positionID) {
    test('Delete the position from a Sku', async () => {
        if(positionID === undefined) {
            try {
                res = await skuDao.deleteSkuPos(positionID);
            } catch(err){
                console.log("---- error -----");
                return;
            }
            expect(res).toStrictEqual(null);
        }

        try {
            await skuDao.deleteSkuPos(positionID);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        res = await skuDao.getStoredSkuById(id);
        expect(res.position).toStrictEqual(null);
    });
}

function TestSetTestDescriptorSku(testId, id) {
    test('Add a testDescriptor to a Sku', async () => {

        try {
            res = await skuDao.getStoredSkuById(id);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        if(res.testDescriptors != null) {
            testDesc = res.testDescriptors.slice(1, -1);

            try {
                await skuDao.setTestDescriptorSku(testId, id);
            } catch(err){
                console.log("---- error -----");
                return;
            }
            res = await skuDao.getStoredSkuById(id);
            expect(res.testDescriptors).toStrictEqual("[" + testDesc + "," + String(testId) + "]");
        }
        else {
            try {
                await skuDao.setTestDescriptorSku(testId, id);
            } catch(err){
                console.log("---- error -----");
                return;
            }
            res = await skuDao.getStoredSkuById(id);
            expect(res.testDescriptors).toStrictEqual("[" + String(testId) + "]");
        }
    });
}

function TestDeleteTestDescriptorSku(testId, id) {
    test('Delete a testDescriptor from a Sku', async () => {

        try {
            res = await skuDao.getStoredSkuById(id);
        } catch(err){
            console.log("---- error -----");
            return;
        }

        if(res.testDescriptors != null && res.testDescriptors != "") {
            testDesc = res.testDescriptors.slice(1, -1).split(",");;
            newDescList = testDesc.filter(el => el != testId.toString()).join(',').toString();
            if(newDescList.length === 0) {
                await skuDao.deleteTestDescriptorSku(testId, id);
                res = await skuDao.getStoredSkuById(id);
                expect(res.testDescriptors).toStrictEqual(null);
            } else {
                await skuDao.deleteTestDescriptorSku(testId, id);
                res = await skuDao.getStoredSkuById(id);
                expect(res.testDescriptors).toStrictEqual("[" + newDescList + "]");
            }
        }
        else {
            await skuDao.deleteTestDescriptorSku(testId, id);
            res = await skuDao.getStoredSkuById(id);
            expect(res.testDescriptors).toStrictEqual(null);
        }
    });
}


function TestModifyTestDescSku(testId, newIdSKU, oldIdSKU) {
    test('Delete the testDescriptor from a the old Sku and add it to the new Sku', async () => {

        if(newIdSKU === oldIdSKU){
            try {
                res = await skuDao.modifyTestDescSku(testId, newIdSKU, oldIdSKU);
            } catch(err){
                console.log("---- error -----");
                return;
            }
            expect(res).toBe(0);     
            return;   
        }

        try {
            res1 = await skuDao.getStoredSkuById(newIdSKU);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        res2 = await skuDao.getStoredSkuById(oldIdSKU);
        if(res1.testDescriptors != null) {
            newtestDesc = res1.testDescriptors.slice(1, -1);

            oldtestDesc = res2.testDescriptors.slice(1, -1).split(",");;
            newDescList = oldtestDesc.filter(el => el != testId.toString()).join(',').toString();


            await skuDao.modifyTestDescSku(testId, newIdSKU, oldIdSKU) 
            res = await skuDao.getStoredSkuById(newIdSKU);
            expect(res.testDescriptors).toStrictEqual("[" + testDesc + "," + String(testId) + "]");

            res = await skuDao.getStoredSkuById(oldIdSKU);
            expect(res.testDescriptors).toStrictEqual("[" + newDescList + "]");
        }
        else {
            await skuDao.modifyTestDescSku(testId, newIdSKU, oldIdSKU) 
            res = await skuDao.getStoredSkuById(newIdSKU);
            expect(res.testDescriptors).toStrictEqual("[" + String(testId) + "]");
        }

    });
}

function testDropAndCreateTable() {
    test('drop an create testResult table', async () => {

        try {
            await skuDao.dropSkuTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await skuDao.newSkusTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestCloseSkusTable() {
    test('close Sku Table', async () => {

        await skuDao.closeSkusTable();
    });
}