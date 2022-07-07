const SKUItemService = require('../services/sku_item_service');
const dao = require('../modules/mock_item_dao');
const skuTable = require('../modules/mock_sku_dao');
const skuitem_service = new SKUItemService(dao, skuTable);

describe('delete all skuitems', () => {
    beforeEach(() => {
        dao.dropSKUItemsTable.mockReset();
        dao.newSKUItemsTable.mockReset();

        dao.dropSKUItemsTable.mockReturnValueOnce(1);
        dao.newSKUItemsTable.mockReturnValueOnce(0);

    });

    test('delete all skuitems', async () => {
        let res = await skuitem_service.deleteAllSKUItems();

        expect(res).toBe(200);

    });

});

describe('get skuitem by rfid', () => {
    beforeEach(() => {
        dao.getAvailableSKUItems.mockReset();
        dao.getAvailableSKUItems.mockReturnValueOnce({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        {
            RFID: "12345678901234567890123456789016",
            SKUId: 1,
            DateOfStock: ""
        });
        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockReturnValueOnce({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        }).mockReturnValueOnce(undefined);
    });
    test('get skuitem by rfid', async () => {
        let res = await skuitem_service.getAvSKUItems(1);
        expect(res).toEqual({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        {
            RFID: "12345678901234567890123456789016",
            SKUId: 1,
            DateOfStock: ""
        });
        res = await skuitem_service.getAvSKUItems(1);
        expect(res).toEqual(404);
    });
});

describe('get available skuitems by skuid', () => {
    beforeEach(() => {
        dao.getStoredSKUItemByRfid.mockReset();
        dao.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 1,
            DateOfStock: "2021/11/29 12:30"
        }).mockReturnValueOnce({
            RFID: "12345678901234567890123456789014",
            SKUId: 3,
            Available: 0,
            DateOfStock: "2012/02/20"
        }).mockReturnValueOnce({
            RFID: "12345678901234567890123456789013",
            SKUId: 24,
            Available: 0,
            DateOfStock: ""
        }).mockReturnValueOnce(undefined);
    });
    test('get available skuitems by skuid', async () => {
        let res = await skuitem_service.getSKUItemRFID("12345678901234567890123456789015");
        expect(res).toEqual({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 1,
            DateOfStock: "2021/11/29 12:30"
        });
        res = await skuitem_service.getSKUItemRFID("12345678901234567890123456789014");
        expect(res).toEqual({
            RFID: "12345678901234567890123456789014",
            SKUId: 3,
            Available: 0,
            DateOfStock: "2012/02/20"
        });
        res = await skuitem_service.getSKUItemRFID("12345678901234567890123456789013");
        expect(res).toEqual({
            RFID: "12345678901234567890123456789013",
            SKUId: 24,
            Available: 0,
            DateOfStock: ""
        });
        res = await skuitem_service.getSKUItemRFID(5);
        expect(res).toEqual(404);
    });
});

describe('get all skuitems', () => {
    beforeEach(() => {
        dao.getStoredSKUItems.mockReset();
        dao.getStoredSKUItems.mockReturnValueOnce(
        {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 3,
            Available: 0,
            DateOfStock: "2012/02/20"
        },
        {
            RFID: "12345678901234567890123456789013",
            SKUId: 24,
            Available: 0,
            DateOfStock: ""
        });
    });
    test('get all skuitems', async () => {
        let res = await skuitem_service.getSKUItems();
        expect(res).toEqual(
        {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 3,
            Available: 0,
            DateOfStock: "2012/02/20"
        },
        {
            RFID: "12345678901234567890123456789013",
            SKUId: 24,
            Available: 0,
            DateOfStock: ""
        });
    });
});

describe('set skuitem', () => {
    beforeEach(() => {
        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockReturnValueOnce({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        }).mockReturnValueOnce(undefined)
        .mockReturnValueOnce({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        });
        dao.getStoredSKUItemByRfid.mockReset();
        dao.getStoredSKUItemByRfid.mockReturnValueOnce(undefined)
        .mockReturnValueOnce({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 0,
            DateOfStock: "2021/11/29 12:30"
        });
        dao.storeSKUItem.mockReset();
        dao.storeSKUItem.mockReturnValueOnce(1);
    });
    test('set skuitem', async () => {
        const skuitem1 = {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        }
        const skuitem2 = {
            RFID: "12345678901234567890123456789010",
            SKUId: 0,
            DateOfStock: "2022/14/32 15:45:28"
        }
        let res = await skuitem_service.setSKUItem(skuitem1.RFID, skuitem1.SKUId, skuitem1.DateOfStock);
        //first call, first parameter passed
        expect(dao.storeSKUItem.mock.calls[0][0]).toBe(skuitem1.RFID);
        //first call, second parameter passed
        expect(dao.storeSKUItem.mock.calls[0][1]).toBe(skuitem1.SKUId);
        //first call, third parameter passed
        expect(dao.storeSKUItem.mock.calls[0][2]).toBe(skuitem1.DateOfStock);
        res = await skuitem_service.setSKUItem(skuitem2.RFID, skuitem2.SKUId, skuitem2.DateOfStock);
        expect(res).toBe("c404");
        res = await skuitem_service.setSKUItem(skuitem2.RFID, skuitem2.SKUId, skuitem2.DateOfStock);
        expect(res).toBe("c409");
    });
});

describe('modify skuitem', () => {
    beforeEach(() => {
        dao.getStoredSKUItemByRfid.mockReset();
        dao.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 0,
            DateOfStock: "2021/11/29 12:30"
        }).mockReturnValueOnce(undefined)
        .mockReturnValueOnce({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 0,
            DateOfStock: "2021/11/29 12:30"
        })
        .mockReturnValueOnce(undefined)
        .mockReturnValue({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 0,
            DateOfStock: "2021/11/29 12:30"
        });
        dao.modifySKUItem.mockReset();
        dao.modifySKUItem.mockReturnValue(true);
    });
    test('modify skuitem', async () => {
        const skuitem1 = {
            newRFID: "12345678901234567890123456789015",
            newAvailable: 1,
            newDateOfStock: "2021/11/29 12:30",
            rfid: "12345678901234567890123456789011"
        }
        let res = await skuitem_service.modSKUItem(skuitem1.newRFID, skuitem1.newAvailable, skuitem1.newDateOfStock, skuitem1.rfid);
        //first call, first parameter passed
        expect(dao.modifySKUItem.mock.calls[0][0]).toBe(skuitem1.newRFID);
        //first call, second parameter passed
        expect(dao.modifySKUItem.mock.calls[0][1]).toBe(skuitem1.newAvailable);
        //first call, third parameter passed
        expect(dao.modifySKUItem.mock.calls[0][2]).toBe(skuitem1.newDateOfStock);
        //first call, fourth parameter passed
        expect(dao.modifySKUItem.mock.calls[0][3]).toBe(skuitem1.rfid);
        res = await skuitem_service.modSKUItem(skuitem1.newRFID, skuitem1.newAvailable, skuitem1.newDateOfStock, skuitem1.newRFID);
        expect(res).toBe(true);
        res = await skuitem_service.modSKUItem(skuitem1.newRFID, skuitem1.newAvailable, skuitem1.newDateOfStock, skuitem1.rfid);
        expect(res).toBe(404);
        res = await skuitem_service.modSKUItem(skuitem1.newRFID, skuitem1.newAvailable, skuitem1.newDateOfStock, skuitem1.rfid);
        expect(res).toBe(409);
    });
});

describe('delete skuitem', () => {
    beforeEach(() => {
        dao.getStoredSKUItemByRfid.mockReset();
        dao.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 0,
            DateOfStock: "2021/11/29 12:30"
        }).mockReturnValue(undefined);
        dao.deleteSKUItem.mockReset();
        dao.deleteSKUItem.mockReturnValueOnce(true);
    });
    test('delete skuitem', async () => {
        let res = await skuitem_service.delSKUItem("12345678901234567890123456789015");
        expect(dao.deleteSKUItem.mock.calls[0][0]).toBe("12345678901234567890123456789015");
        expect(res).toEqual(true);
        res = await skuitem_service.delSKUItem("12345678901234567890123456789015");
        expect(res).toEqual(404);
    });
});

describe('test with closed db connection', () => {
    beforeEach(() => {
        dao.closeSkuItemTable.mockReset();
        dao.closeSkuItemTable.mockReturnValueOnce(true);
        dao.dropSKUItemsTable.mockReset();
        dao.dropSKUItemsTable.mockImplementation(() => {
            throw new Error();
        });
        dao.storeSKUItem.mockReset();
        dao.storeSKUItem.mockImplementation(() => {
            throw new Error();
        });
        dao.getStoredSKUItems.mockReset();
        dao.getStoredSKUItems.mockImplementation(() => {
            throw new Error();
        });
        dao.getStoredSKUItemByRfid.mockReset();
        dao.getStoredSKUItemByRfid.mockImplementation(() => {
            throw new Error();
        });
        dao.getAvailableSKUItems.mockReset();
        dao.getAvailableSKUItems.mockImplementation(() => {
            throw new Error();
        });
        dao.modifySKUItem.mockReset();
        dao.modifySKUItem.mockImplementation(() => {
            throw new Error();
        });
        dao.deleteSKUItem.mockReset();
        dao.deleteSKUItem.mockImplementation(() => {
            throw new Error();
        });
        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockImplementation(() => {
            throw new Error();
        });
    });
    test('test with closed db connection', async () => {
        const skuitem = {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 1,
            DateOfStock: "2021/11/29 12:30"
        }
        await skuitem_service.closeConnectionSkuItem();
        let res = await skuitem_service.setSKUItem(skuitem.RFID, skuitem.SKUId, skuitem.DateOfStock);
        expect(res).toEqual("c503");
        res = await skuitem_service.getSKUItems();
        expect(res).toEqual(500);
        res = await skuitem_service.getAvSKUItems(skuitem.SKUId);
        expect(res).toEqual(500);
        res = await skuitem_service.getSKUItemRFID(skuitem.RFID);
        expect(res).toEqual(500);
        res = await skuitem_service.modSKUItem(skuitem.RFID, skuitem.SKUId, skuitem.DateOfStock, skuitem.RFID);
        expect(res).toEqual(503);
        res = await skuitem_service.delSKUItem(skuitem.RFID);
        expect(res).toEqual(503);
        res = await skuitem_service.deleteAllSKUItems();
        expect(res).toEqual(503);
    });
});