const InternalOrderService = require('../services/InternalOrder_service');
const dao = require('../modules/mock_InternalOrder_dao')
const skuTable = require('../modules/mock_sku_dao')
const InternalOrder_service = new InternalOrderService(dao, skuTable);


describe('get Internal Order by id', () => {

    beforeEach(() => {
        dao.getInternalOrdersById.mockReset();
        dao.getInternalOrdersById.mockReturnValueOnce({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        }).mockReturnValue({
            id: 2,
            issueDate: "22/22/2222",
            state: "State 2",
            products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
            customerId: 2
        });
    });

    test('get Internal Order by Id', async () => {
        const id = 1;
        let res = await InternalOrder_service.getInternalOrdersById(id);
        expect(res).toEqual({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        });
        res = await InternalOrder_service.getInternalOrdersById(2);
        expect(res).toEqual({
            id: 2,
            issueDate: "22/22/2222",
            state: "State 2",
            products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
            customerId: 2
        });
    });

});


describe('get all Internal Orders', () => {
    beforeEach(() => {
        dao.getAllInternalOrders.mockReset();
        dao.getAllInternalOrders.mockReturnValueOnce(
            {
                id: 1,
                issueDate: "11/11/1111",
                state: "State 1",
                products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
                customerId: 1
            },
            {
                id: 2,
                issueDate: "22/22/2222",
                state: "State 2",
                products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
                customerId: 2
            }
        );
    });

    test('get all Internal Orders', async () => {
        let res = await InternalOrder_service.getInternalOrders();
        expect(res).toEqual({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        },
        {
            id: 2,
            issueDate: "22/22/2222",
            state: "State 2",
            products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
            customerId: 2
        });
    });

});


describe('get Issued Internal Order', () => {
    beforeEach(() => {
        dao.getInternalOrdersIssued.mockReset();
        dao.getInternalOrdersIssued.mockReturnValueOnce(
            {
                id: 1,
                issueDate: "11/11/1111",
                state: "ISSUED",
                products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
                customerId: 1
            },
            {
                id: 2,
                issueDate: "22/22/2222",
                state: "ISSUED",
                products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
                customerId: 2
            }
        );
    });

    test('get issued Internal Order ', async () => {
        let res = await InternalOrder_service.getInternalOrdersIssued();
        expect(res).toEqual({
            id: 1,
            issueDate: "11/11/1111",
            state: "ISSUED",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        },
        {
            id: 2,
            issueDate: "22/22/2222",
            state: "ISSUED",
            products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
            customerId: 2
        });
    });

});



describe('get Accepted Internal Order', () => {
    beforeEach(() => {
        dao.getInternalOrdersAccepted.mockReset();
        dao.getInternalOrdersAccepted.mockReturnValueOnce(
            {
                id: 1,
                issueDate: "11/11/1111",
                state: "ACCEPTED",
                products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
                customerId: 1
            },
            {
                id: 2,
                issueDate: "22/22/2222",
                state: "ACCEPTED",
                products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
                customerId: 2
            }
        );
    });

    test('get Accepted Internal Order ', async () => {
        let res = await InternalOrder_service.getInternalOrdersAccepted();
        expect(res).toEqual({
            id: 1,
            issueDate: "11/11/1111",
            state: "ACCEPTED",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        },
        {
            id: 2,
            issueDate: "22/22/2222",
            state: "ACCEPTED",
            products: [{"SKUId":3,"description":"a product 2","price":22,"qty":30}],
            customerId: 2
        });
    });

});



describe("set Internal Order", () => {
    beforeEach(() => {

       

       
    })
    test('set Internal Order', async () => {
        const IO = {
            issueDate: "11/11/1111",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30},{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        }
        const IO1 = {
            issueDate: "11/11/1111",
            products: [{"SKUId":13,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        }
       
        let res = await InternalOrder_service.setInternalOrder(IO.issueDate, IO.products, IO.customerId);
        //first call, first parameter passed
        expect(dao.storeInternalOrder.mock.calls[0][0]).toBe(IO.issueDate);
        //first call, second parameter passed
        expect(dao.storeInternalOrder.mock.calls[0][1]).toBe(IO.products);
        //first call, third parameter passed
        expect(dao.storeInternalOrder.mock.calls[0][2]).toBe(IO.customerId);

        

    });

});

describe("modify Internal Order", () => {
    beforeEach(() => {
        dao.getInternalOrdersById.mockReset();
        dao.getInternalOrdersById.mockReturnValueOnce(
            undefined
            ).mockReturnValueOnce({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        }).mockReturnValueOnce({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        });


       

    });

    test('modify Internal Order', async () => {
        
        const modInternalOrder = {
            id: 1,
            newState:"COMPLETED",
            products:[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
        }
    

        let res0 = await InternalOrder_service.modifyInternalOrder(modInternalOrder.newState, modInternalOrder.products, modInternalOrder.id);
        expect(res0).toEqual(404);

        let res = await InternalOrder_service.modifyInternalOrder(modInternalOrder.newState, modInternalOrder.products, modInternalOrder.id);
        //first call, first parameter passed
        expect(dao.modifyInternalOrder.mock.calls[0][0]).toBe(modInternalOrder.newState);
        //first call, second parameter passed
        expect(dao.modifyInternalOrder.mock.calls[0][1]).toBe(modInternalOrder.products);
        //first call, third parameter passed
        expect(dao.modifyInternalOrder.mock.calls[0][2]).toBe(modInternalOrder.id);

        let res1 = await InternalOrder_service.modifyInternalOrder("something_different", modInternalOrder.products, modInternalOrder.id);
        expect(res1).toEqual(422);

        let res2 = await InternalOrder_service.modifyInternalOrder("COMPLETED", undefined, modInternalOrder.id);
        expect(res2).toEqual(422);

       

    });
});


describe("delete Internal order", () => {
    
    beforeEach(() => {
        dao.getInternalOrdersById.mockReset();
        dao.getInternalOrdersById.mockReturnValueOnce({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        }).mockReturnValueOnce({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        }).mockReturnValue(undefined);
    });

    test('delete Internal Order', async () => {

        let get1 = await InternalOrder_service.getInternalOrdersById(1);
        expect(get1).toEqual({
            id: 1,
            issueDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        });

        let res = await InternalOrder_service.deleteInternalOrder(1);
        //first call, first parameter passed
        expect(dao.deleteInternalOrder.mock.calls[0][0]).toBe(1);

        let res2 = await InternalOrder_service.deleteInternalOrder(1);
        expect(res2).toEqual(404);

        let res3 = await InternalOrder_service.getInternalOrdersById(1);
        expect(res3).toEqual(404);
    });
});




describe("delete all Internal Orders", () => {
    
    beforeEach(() => {
        dao.getAllInternalOrders.mockReset();
        dao.getAllInternalOrders.mockReturnValueOnce({});

        dao.dropInternalOrderTable.mockReset();
        dao.dropInternalOrderTable.mockReturnValueOnce("OK");

        dao.newInternalOrderTable.mockReset();
        dao.newInternalOrderTable.mockReturnValueOnce("OK");
    });

    test('delete all Internal Orders', async () => {


        let res = await InternalOrder_service.deleteAllInternalOrder();

        let res1 = await InternalOrder_service.deleteAllInternalOrder();
        expect(res1).toEqual(200);
    });
});

describe("test with closed connection to Internal Order Table", () => {
    
    beforeEach(() => {
        dao.closeInternalOrderTable.mockReset();
        dao.closeInternalOrderTable.mockReturnValueOnce(true);

        dao.dropInternalOrderTable.mockReset();
        dao.dropInternalOrderTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeInternalOrder.mockReset();
        dao.storeInternalOrder.mockImplementationOnce(() => {
            throw new Error();
        });

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockImplementation(() => {
            throw new Error();
        });

        dao.getAllInternalOrders.mockReset();
        dao.getAllInternalOrders.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getInternalOrdersById.mockReset();
        dao.getInternalOrdersById.mockImplementation(() => {
            throw new Error();
        });

        dao.getInternalOrdersAccepted.mockReset();
        dao.getInternalOrdersAccepted.mockImplementation(() => {
            throw new Error();
        });

        dao.getInternalOrdersIssued.mockReset();
        dao.getInternalOrdersIssued.mockImplementation(() => {
            throw new Error();
        });

    });

    test('test with closed connection to Internal Order Table', async () => {
        const id = 1;
        const InternalOrder = {
            id: 1,
            issueDate:"11/11/1111",
            newState: "COMPLETED",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId:1
        }

        await InternalOrder_service.closeConnectionInternalOrder();

        let res = await InternalOrder_service.setInternalOrder(InternalOrder.issueDate, InternalOrder.products, InternalOrder.customerId);
        expect(res).toEqual(503);

        res = await InternalOrder_service.getInternalOrders();
        expect(res).toEqual(500);
      
        res = await InternalOrder_service.getInternalOrdersAccepted();
        expect(res).toEqual(500);

        res = await InternalOrder_service.getInternalOrdersIssued();
        expect(res).toEqual(500);

        res = await InternalOrder_service.getInternalOrdersById(id);
        expect(res).toEqual(500);

        res = await InternalOrder_service.modifyInternalOrder( InternalOrder.newState, InternalOrder.products, InternalOrder.id );
        expect(res).toEqual(503);

        res = await InternalOrder_service.deleteInternalOrder(id);
        expect(res).toEqual(503);

        res = await InternalOrder_service.deleteAllInternalOrder();
        expect(res).toEqual(500);

    });

});