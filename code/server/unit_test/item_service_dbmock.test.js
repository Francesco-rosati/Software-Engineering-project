const ItemService = require('../services/item_service');
const dao = require('../modules/mock_item_dao');
const skuTable = require('../modules/mock_sku_dao');
const userTable = require('../modules/mock_user_dao');
const item_service = new ItemService(dao, skuTable, userTable);

describe('delete all items', () => {
    beforeEach(() => {
        dao.dropItemsTable.mockReset();
        dao.newItemsTable.mockReset();

        dao.dropItemsTable.mockReturnValueOnce(1);
        dao.newItemsTable.mockReturnValueOnce(0);

    });

    test('delete all items', async () => {
        let res = await item_service.deleteAllItems();

        expect(res).toBe(200);

    });

});

describe('get Item by id', () => {

    beforeEach(() => {
        dao.getStoredItemById.mockReset();
        dao.getStoredItemById.mockReturnValueOnce({
            id: 1,
            description: "a new item1",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        }).mockReturnValueOnce({
            id: 2,
            description: "a new item2",
            price: 12.87,
            SKUId: 1,
            supplierId: 5
        }).mockReturnValue(undefined);
    });

    test('get Item by id', async () => {
        let res = await item_service.getItemsById(1,2);
        expect(res).toEqual({
            id: 1,
            description: "a new item1",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        });

        res = await item_service.getItemsById(2, 5);

        expect(res).toEqual({
            id: 2,
            description: "a new item2",
            price: 12.87,
            SKUId: 1,
            supplierId: 5
        });

        res = await item_service.getItemsById(5, 2);

        expect(res).toEqual(404);
    });

});

describe('get all Items', () => {
    beforeEach(() => {
        dao.getStoredItems.mockReset();
        dao.getStoredItems.mockReturnValueOnce(
            {
                id: 1,
                description: "a new item1",
                price: 10.99,
                SKUId: 1,
                supplierId: 2
            },
            {
                id: 3,
                description: "a new item2",
                price: 12.99,
                SKUId: 4,
                supplierId: 6
            },
            {
                id: 23,
                description: "a new item23",
                price: 8.39,
                SKUId: 2,
                supplierId: 12
            }
        );
    });

    test('get all Items', async () => {
        let res = await item_service.getItems();
        expect(res).toEqual(
            {
                id: 1,
                description: "a new item1",
                price: 10.99,
                SKUId: 1,
                supplierId: 2
            },
            {
                id: 3,
                description: "a new item2",
                price: 12.99,
                SKUId: 4,
                supplierId: 6
            },
            {
                id: 23,
                description: "a new item23",
                price: 8.39,
                SKUId: 2,
                supplierId: 12
            });
    });

});

describe("set Item", () => {
    beforeEach(() => {
        skuTable.getStoredSkuById.mockReset();
        userTable.getUserByIdAndType.mockReset();
        dao.storeItem.mockReset();
        dao.getStoredItemByIdAndSupplierId.mockReset();
        dao.getStoredItemBySKUIdAndSupplierId.mockReset();

        skuTable.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "802134564321",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "1,2"
        }).mockReturnValueOnce(undefined)
            .mockReturnValueOnce({
                description: "Sku 1",
                weight: 20,
                volume: 30,
                notes: "Note sku 1",
                position: "802134564321",
                availableQuantity: 15,
                price: 3.99,
                testDescriptors: "1,2"
            }).mockReturnValueOnce({
                description: "Sku 1",
                weight: 20,
                volume: 30,
                notes: "Note sku 1",
                position: "802134564321",
                availableQuantity: 15,
                price: 3.99,
                testDescriptors: "1,2"
            }).mockReturnValueOnce({
                description: "Sku 1",
                weight: 20,
                volume: 30,
                notes: "Note sku 1",
                position: "802134564321",
                availableQuantity: 15,
                price: 3.99,
                testDescriptors: "1,2"
            });

        userTable.getUserByIdAndType.mockReturnValueOnce({
            id: 3,
            name: "John",
            surname: "Snow",
            email: "user1@ezwh.com",
            type: "supplier"
        }).mockReturnValue(undefined);

        dao.getStoredItemByIdAndSupplierId.mockReturnValueOnce(undefined)
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce({
                id: 1,
                description: "a new item1",
                price: 10.99,
                SKUId: 1,
                supplierId: 2
            })
            .mockReturnValue(undefined);

        dao.getStoredItemBySKUIdAndSupplierId.mockReturnValueOnce(undefined)
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce({
                id: 1,
                description: "a new item1",
                price: 10.99,
                SKUId: 1,
                supplierId: 2
            }).mockReturnValue(undefined);

    })
    test('set Item', async () => {

        const item1 = {
            "id": 12,
            "description": "a new item",
            "price": 10.99,
            "SKUId": 1,
            "supplierId": 3
        }

        const item2 = {
            "id": 12,
            "description": "a new item",
            "price": 10.99,
            "SKUId": 2,
            "supplierId": 5
        }

        let res = await item_service.setItem(item1.id, item1.description, item1.price, item1.SKUId, item1.supplierId);

        //first call, first parameter passed
        expect(dao.storeItem.mock.calls[0][0]).toBe(item1.id);
        //first call, second parameter passed
        expect(dao.storeItem.mock.calls[0][1]).toBe(item1.description);
        //first call, third parameter passed
        expect(dao.storeItem.mock.calls[0][2]).toBe(item1.price);
        //first call, fourth parameter passed
        expect(dao.storeItem.mock.calls[0][3]).toBe(item1.SKUId);
        //first call, fifth parameter passed
        expect(dao.storeItem.mock.calls[0][4]).toBe(item1.supplierId);

        res = await item_service.setItem(item2.id, item2.description, item2.price, item2.SKUId, item2.supplierId);
        expect(res).toBe("c404");

        res = await item_service.setItem(item2.id, item2.description, item2.price, item2.SKUId, item2.supplierId);
        expect(res).toBe("c422");

        res = await item_service.setItem(item2.id, item2.description, item2.price, item2.SKUId, item2.supplierId);
        expect(res).toBe("c422");

    });
});

describe("modify Item", () => {
    beforeEach(() => {

        dao.getStoredItemById.mockReset();
        dao.modifyItem.mockReset();

        dao.modifyItem.mockReturnValueOnce(true);
        dao.getStoredItemById.mockReturnValueOnce({
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        }).mockReturnValueOnce({
            id: 3,
            description: "a new sku",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        }).mockReturnValueOnce(undefined);

    });

    test('modify Item', async () => {

        const modItem1 = {
            newDescription: "a new sku1",
            newPrice: 10.99
        }

        const modItem2 = {
            newDescription: "a new sku2",
            newPrice: 15.99
        }

        let res = await item_service.modifyItem(3, 2, modItem1.newDescription, modItem1.newPrice);
        //first call, first parameter passed
        expect(dao.modifyItem.mock.calls[0][0]).toBe(modItem1.newDescription);
        //first call, second parameter passed
        expect(dao.modifyItem.mock.calls[0][1]).toBe(modItem1.newPrice);
        //first call, third parameter passed
        expect(dao.modifyItem.mock.calls[0][2]).toBe(3);
        //first call, fourth parameter passed
        expect(dao.modifyItem.mock.calls[0][3]).toBe(2);

        expect(res).toBe(true);

        res = await item_service.getItemsById(3, 2);

        expect(res).toEqual({
            id: 3,
            description: "a new sku",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        });

        res = await item_service.modifyItem(4, 2, modItem2.newDescription, modItem2.newPrice);

        expect(res).toEqual(404);

    });
});

describe("delete Item", () => {

    beforeEach(() => {
        dao.getStoredItemById.mockReset();
        dao.deleteItem.mockReset();

        dao.getStoredItemById.mockReturnValueOnce({
            id: 1,
            description: "a new item1",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        }).mockReturnValueOnce(undefined)
            .mockReturnValue(undefined);

        dao.deleteItem.mockReturnValueOnce(true);
    });

    test('delete Item', async () => {

        let res = await item_service.deleteItem(1, 2);

        //first call, first parameter passed
        expect(dao.deleteItem.mock.calls[0][0]).toBe(1);
         //first call, second parameter passed
         expect(dao.deleteItem.mock.calls[0][1]).toBe(2);
        expect(res).toEqual(true);
       
        res = await item_service.deleteItem(1,2);
        expect(res).toEqual(404);

        res = await item_service.deleteItem(2,5);
        expect(res).toBe(404);

    });
});

describe("test with closed connection to item table", () => {

    beforeEach(() => {
        dao.closeItemTable.mockReset();
        dao.closeItemTable.mockReturnValueOnce(true);

        dao.dropItemsTable.mockReset();
        dao.dropItemsTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeItem.mockReset();
        dao.storeItem.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.modifyItem.mockReset();
        dao.modifyItem.mockImplementationOnce(() => {
            throw new Error();
        });

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockImplementation(() => {
            throw new Error();
        });

        userTable.getUserByIdAndType.mockReset();
        userTable.getUserByIdAndType.mockImplementation(() => {
            throw new Error();
        });

        dao.getStoredItems.mockReset();
        dao.getStoredItems.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredItemById.mockReset();
        dao.getStoredItemById.mockImplementation(() => {
            throw new Error();
        });

        dao.getStoredItemByIdAndSupplierId.mockReset();
        dao.getStoredItemByIdAndSupplierId.mockImplementation(() => {
            throw new Error();
        });

        dao.getStoredItemBySKUIdAndSupplierId.mockReset();
        dao.getStoredItemBySKUIdAndSupplierId.mockImplementation(() => {
            throw new Error();
        });

        dao.deleteItem.mockReset();
        dao.deleteItem.mockImplementation(() => {
            throw new Error();
        });

    });

    test('test with closed connection to item table', async () => {

        const item = {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 2
        }

        await item_service.closeConnectionItem();

        let res = await item_service.setItem(item.id,item.description,item.price,item.SKUId,item.supplierId);
        expect(res).toEqual("c503");

        res = await item_service.getItems();
        expect(res).toEqual(500);

        res = await item_service.getItemsById(item.id,item.supplierId);
        expect(res).toEqual(500);

        res = await item_service.modifyItem(item.id,item.supplierId,"new description",11.35);
        expect(res).toEqual(503);

        res = await item_service.deleteItem(item.id,item.supplierId);
        expect(res).toEqual(503);

        res = await item_service.deleteAllItems();
        expect(res).toEqual(503);

    });

});