const RestockOrderService = require('../services/RestockOrder_service');
const dao = require('../modules/mock_RestockOrder_dao')
const skuTable = require('../modules/mock_sku_dao')
const RestockOrder_service = new RestockOrderService(dao, skuTable);

describe('get Restock Orderby Id', () => {

    beforeEach(() => {
        dao.getRestockOrderById.mockReset();
        dao.getRestockOrderById.mockReturnValueOnce({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1, "itemId":10, "description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10, "description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null

        }).mockReturnValue({
            id:2,
            issueDate:"2021/11/29",
            state: "ISSUED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 2,
            transportNote: null,
            skuItems : null
        });
    });

    test('get Restock Order by Id', async () => {
        const id = 1;
        let res = await RestockOrder_service.getRestockOrderById(id);
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });
        res = await RestockOrder_service.getRestockOrderById(id);
        expect(res).toEqual({
            id:2,
            issueDate:"2021/11/29",
            state: "ISSUED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 2,
            transportNote: null,
            skuItems : null
        });
    });

});


describe('get all Restock Order ', () => {
    beforeEach(() => {
        dao.getAllRestockOrder.mockReset();
        dao.getAllRestockOrder.mockReturnValueOnce(
            {
                id:1,
                issueDate:"2021/11/29",
                state: "DELIVERED",
                products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                            {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
                supplierId : 1,
                transportNote: null,
                skuItems : null
            },
            {
                id:2,
                issueDate:"2021/11/29",
                state: "ISSUED",
                products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                            {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
                supplierId : 2,
                transportNote: null,
                skuItems : null
            }
        );
    });

    test('get all Restock Order ', async () => {
        let res = await RestockOrder_service.getRestockOrder();
        expect(res).toEqual({
            id:1,
                issueDate:"2021/11/29",
                state: "DELIVERED",
                products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                            {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
                supplierId : 1,
                transportNote: null,
                skuItems : null
        },
        {
            id:2,
            issueDate:"2021/11/29",
            state: "ISSUED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 2,
            transportNote: null,
            skuItems : null
        });
    });

});


describe('get Issued Restock Order', () => {
    beforeEach(() => {
        dao.getRestockOrderIssued.mockReset();
        dao.getRestockOrderIssued.mockReturnValue(
            {
                id:1,
                issueDate:"2021/11/29",
                state: "ISSUED",
                products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                            {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
                supplierId : 1,
                transportNote: null,
                skuItems : null
            });
    });

    test('get Issued Restock Order ', async () => {
        let res = await RestockOrder_service.getRestockOrderIssued();
        expect(res).toEqual({
            id:1,
            issueDate:"2021/11/29",
            state: "ISSUED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });

    });

});


describe('get Restock Order Return Items By Id', () => {

    beforeEach(() => {
        dao.getRestockOrderReturnItemsById.mockReset();
        dao.getRestockOrderReturnItemsById.mockReturnValueOnce({
            skuItems : [{"SKUId":1,"itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":2,"rfid":"12345678901234567890123456789017"}]

        }).mockReturnValue(
            undefined
        );
    });

    test('get Restock Order Return Items By Id', async () => {
        const id = 1;
        let res = await RestockOrder_service.getRestockOrderReturnItemsById(id);
        expect(res).toEqual({
            skuItems : [{"SKUId":1,"itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":2,"rfid":"12345678901234567890123456789017"}]
        });
        let res2 = await RestockOrder_service.getRestockOrderReturnItemsById(id);
        expect(res2).toEqual(404);
    });

});




describe("set Restock Order", () => {
    beforeEach(() => {

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockReturnValueOnce(
            undefined
        ).mockReturnValue({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "802134564321",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "1,2"
        });


    })
    test('set Restock Order', async () => {
        const RO = {
            issueDate:"2021/11/29",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 2
        }
        
      

        let res = await RestockOrder_service.setRestockOrder(RO.issueDate, RO.products, RO.supplierId);
        //first call, first parameter passed
        expect(dao.storeRestockOrder.mock.calls[0][0]).toBe(RO.issueDate);
        //first call, second parameter passed
        expect(dao.storeRestockOrder.mock.calls[0][1]).toBe(RO.products);
        //first call, third parameter passed
        expect(dao.storeRestockOrder.mock.calls[0][2]).toBe(RO.supplierId);
    });

});

describe("modify Restock Order State ", () => {
    beforeEach(() => {
        dao.getRestockOrderById.mockReset();
        dao.getRestockOrderById.mockReturnValueOnce(
            undefined
        ).mockReturnValue({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });

    });

    test('modify Restock Order State', async () => {
        const ModState={
            id: 1,
            newState:"DELIVERED"
        }

        let res0 = await RestockOrder_service.modifyRestockOrderState(ModState.newState, ModState.id);
        expect(res0).toEqual(404);

        let res = await RestockOrder_service.modifyRestockOrderState(ModState.newState, ModState.id);
        //first call, first parameter passed
        expect(dao.modifyRestockOrderState.mock.calls[0][0]).toBe(ModState.newState);
        //first call, second parameter passed
        expect(dao.modifyRestockOrderState.mock.calls[0][1]).toBe(ModState.id);

        let res1 = await RestockOrder_service.modifyRestockOrderState("wrong_state", ModState.id);
        expect(res1).toEqual(422);
    });
});


describe("modify Restock Order SkuItems ", () => {
    beforeEach(() => {
        dao.getRestockOrderById.mockReset();
        dao.getRestockOrderById.mockReturnValueOnce(
            undefined
        ).mockReturnValueOnce({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        }).mockReturnValue({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });

     
    });

    test('modify Restock Order SkuItems', async () => {
        const ModSkuItems={
            id: 1,
            skuItems:[{"SKUId":1,"itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":1,"itemId":10,"rfid":"12345678901234567890123456789017"}]
        }


        let res01 = await RestockOrder_service.modifyRestockOrderSKUItemsById(ModSkuItems.skuItems, ModSkuItems.id);
        expect(res01).toEqual(404);

        let res1 = await RestockOrder_service.modifyRestockOrderSKUItemsById(ModSkuItems.skuItems, ModSkuItems.id);
        expect(dao.modifyRestockOrderSKUItemsById.mock.calls[0][1]).toBe(ModSkuItems.skuItems);
        expect(dao.modifyRestockOrderSKUItemsById.mock.calls[0][2]).toBe(ModSkuItems.id);
        
    });
});

describe("modify Restock Order TrasportNote ", () => {
    beforeEach(() => {
        dao.getRestockOrderById.mockReset();
        dao.getRestockOrderById.mockReturnValueOnce(
            undefined
        ).mockReturnValueOnce({
            id:1,
            issueDate:"2021/12/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        }).mockReturnValue({
            id:1,
            issueDate:"2021/10/29",
            state: "DELIVERY",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });
    });

    test('modify Restock Order TrasportNote', async () => {
        const id=1;
        const ModTransp={
            id: 1,
            transportNote:{"deliveryDate":"2021/11/29"}
        }

        let res0 = await RestockOrder_service.modifyRestockOrderTransportNote(ModTransp.transportNote, ModTransp.id);
        expect(res0).toEqual(404);

        let res1 = await RestockOrder_service.modifyRestockOrderTransportNote(ModTransp.transportNote, ModTransp.id);
        expect(res1).toEqual(422);

        let res2 = await RestockOrder_service.modifyRestockOrderTransportNote(ModTransp.transportNote, ModTransp.id);
        //first call, first parameter passed
        expect(dao.modifyRestockOrderTransportNote.mock.calls[0][0]).toBe(ModTransp.transportNote);
        //first call, second parameter passed
        expect(dao.modifyRestockOrderTransportNote.mock.calls[0][1]).toBe(ModTransp.id);
    });
});



describe("delete Restock Order", () => {
    
    beforeEach(() => {
        dao.getRestockOrderById.mockReset();
        dao.getRestockOrderById.mockReturnValueOnce(
            undefined
        ).mockReturnValueOnce(
            undefined
        ).mockReturnValue({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        })
    });

    test('delete Restock Order', async () => {

        let res0 = await RestockOrder_service.deleteRestockOrder(1);
        expect(res0).toEqual(404);

        let res01 = await RestockOrder_service.getRestockOrderById(1);
        expect(res01).toEqual(404);

        let get1 = await RestockOrder_service.getRestockOrderById(1);
        expect(get1).toEqual({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"itemId":10,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });

        let res = await RestockOrder_service.deleteRestockOrder(1);
        //first call, first parameter passed
        expect(dao.deleteRestockOrder.mock.calls[0][0]).toBe(1);

       
    });
});



describe("delete all Restock Orders", () => {
    
    beforeEach(() => {
        dao.getAllRestockOrder.mockReset();
        dao.getAllRestockOrder.mockReturnValueOnce({});

        dao.dropRestockOrderTable.mockReset();
        dao.dropRestockOrderTable.mockReturnValueOnce("OK");

        dao.newRestockOrderTable.mockReset();
        dao.newRestockOrderTable.mockReturnValueOnce("OK");
    });

    test('delete all Restock Orders', async () => {


        let res = await RestockOrder_service.deleteAllRestockOrder();

        let res1 = await RestockOrder_service.deleteAllRestockOrder();
        expect(res1).toEqual(200);
    });
});

describe("test with closed connection to Restock Order Table", () => {
    
    beforeEach(() => {
        dao.closeRestockOrderTable.mockReset();
        dao.closeRestockOrderTable.mockReturnValueOnce(true);

        dao.dropRestockOrderTable.mockReset();
        dao.dropRestockOrderTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeRestockOrder.mockReset();
        dao.storeRestockOrder.mockImplementationOnce(() => {
            throw new Error();
        });

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockImplementation(() => {
            throw new Error();
        });

        dao.getAllRestockOrder.mockReset();
        dao.getAllRestockOrder.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getRestockOrderById.mockReset();
        dao.getRestockOrderById.mockImplementation(() => {
            throw new Error();
        });

        dao.getRestockOrderIssued.mockReset();
        dao.getRestockOrderIssued.mockImplementation(() => {
            throw new Error();
        });

        dao.getRestockOrderReturnItemsById.mockReset();
        dao.getRestockOrderReturnItemsById.mockImplementation(() => {
            throw new Error();
        });

    });

    test('test with closed connection to Restock Order Table', async () => {
        const id = 1;
        const RestockOrder = {
            id: 1,
            issueDate:"11/11/1111",
            newState: "COMPLETED",
            products: [{"SKUId":1,"itemId":10,"description":"a product 1","price":11,"qty":30}],
            supplierId:1,
            skuItems :[{"SKUId":1,"itemId":10,"rfid":"12345678901234567890123456789016"}],
            transportNote:{"deliveryDate":"2021/12/29"}
        }

        await RestockOrder_service.closeConnectionRestockOrder();

        let res = await RestockOrder_service.setRestockOrder(RestockOrder.issueDate, RestockOrder.products, RestockOrder.supplierId);
        expect(res).toEqual(503);

        res = await RestockOrder_service.getRestockOrder();
        expect(res).toEqual(500);

        res = await RestockOrder_service.getRestockOrderIssued();
        expect(res).toEqual(500);

        res = await RestockOrder_service.getRestockOrderById(id);
        expect(res).toEqual(500);

        res = await RestockOrder_service.getRestockOrderReturnItemsById();
        expect(res).toEqual(500);

        res = await RestockOrder_service.modifyRestockOrderState( RestockOrder.newState, RestockOrder.id );
        expect(res).toEqual(503);

        res = await RestockOrder_service.modifyRestockOrderSKUItemsById( RestockOrder.skuItems, RestockOrder.id );
        expect(res).toEqual(503);

        res = await RestockOrder_service.modifyRestockOrderTransportNote( RestockOrder.transportNote, RestockOrder.id );
        expect(res).toEqual(503);

        res = await RestockOrder_service.deleteRestockOrder(id);
        expect(res).toEqual(503);

        res = await RestockOrder_service.deleteAllRestockOrder();
        expect(res).toEqual(500);

    });

});