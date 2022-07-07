const ReturnOrderService = require('../services/ReturnOrder_service');
const dao = require('../modules/mock_ReturnOrder_dao')
const skuTable = require('../modules/mock_sku_dao')
const restockorderTable = require('../modules/mock_RestockOrder_dao')

const ReturnOrder_service = new ReturnOrderService(dao, skuTable, restockorderTable);

describe('get Return Order', () => {

    beforeEach(() => {
        dao.getReturnOrderById.mockReset();
        dao.getReturnOrderById.mockReturnValueOnce({
            id: 1,
            returnDate: "11/11/1111",
            products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 1
        }).mockReturnValue({
            id: 2,
            returnDate: "22/22/2222",
            products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 2
        });
    });

    test('get Return Order by Id', async () => {
        const id = 1;
        let res = await ReturnOrder_service.getReturnOrderById(id);
        expect(res).toEqual({
            id: 1,
            returnDate: "11/11/1111",
            products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 1
        });
        res = await ReturnOrder_service.getReturnOrderById(id);
        expect(res).toEqual({
            id: 2,
            returnDate: "22/22/2222",
            products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 2
        });
    });

});


describe('get all Return Order ', () => {
    beforeEach(() => {
        dao.getAllReturnOrder.mockReset();
        dao.getAllReturnOrder.mockReturnValueOnce(
            {
                id: 1,
                returnDate: "11/11/1111",
                products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
                restockOrderId: 1
            },
            {
                id: 2,
                returnDate: "22/22/2222",
                products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
                restockOrderId: 2
            }
        );
    });
    test('get all Return Order ', async () => {
        let res = await ReturnOrder_service.getReturnOrder();
        expect(res).toEqual({
            id: 1,
            returnDate: "11/11/1111",
            products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                             {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 1
        },
        {
            id: 2,
            returnDate: "22/22/2222",
            products: [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                            {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 2
        });
    });

});


describe("set Return Order", () => {
    beforeEach(() => {

        restockorderTable.getRestockOrderById.mockReset();
        restockorderTable.getRestockOrderById.mockReturnValueOnce(
            undefined
        ).mockReturnValue({
            id:1,
            issueDate:"2021/11/29",
            state: "DELIVERED",
            products: [{"SKUId":1,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":1,"description":"another product","price":11.99,"qty":20}],
            supplierId : 1,
            transportNote: null,
            skuItems : null
        });


    })
    test('set Return Order', async () => {
        const RetO = {
            returnDate: "11/11/1111",
            products: [{"SKUId":1,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                            {"SKUId":2,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId: 1
        }
       
        let res01 = await ReturnOrder_service.setReturnOrder(RetO.returnDate, RetO.products, RetO.restockOrderId);
        expect(res01).toEqual(404);

        let res = await ReturnOrder_service.setReturnOrder(RetO.returnDate, RetO.products, RetO.restockOrderId);
        //first call, first parameter passed
        expect(dao.storeReturnOrder.mock.calls[0][0]).toBe(RetO.returnDate);
        //first call, second parameter passed
        expect(dao.storeReturnOrder.mock.calls[0][1]).toBe(RetO.products);
        //first call, third parameter passed
        expect(dao.storeReturnOrder.mock.calls[0][2]).toBe(RetO.restockOrderId);
    });

});


describe("delete Return Order", () => {
    
    beforeEach(() => {
        dao.getReturnOrderById.mockReset();
        dao.getReturnOrderById.mockReturnValueOnce(
            undefined
        ).mockReturnValueOnce(
            undefined
        ).mockReturnValue({
            id: 1,
            returnDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        })
    });

    test('delete Return Order', async () => {

        let res0 = await ReturnOrder_service.getReturnOrderById(1);
        expect(res0).toEqual(404);

        let res01 = await ReturnOrder_service.deleteReturnOrder(1);
        expect(res01).toEqual(404);

        let get1 = await ReturnOrder_service.getReturnOrderById(1);
        expect(get1).toEqual({
            id: 1,
            returnDate: "11/11/1111",
            state: "State 1",
            products: [{"SKUId":1,"description":"a product 1","price":11,"qty":30}],
            customerId: 1
        });

        let res = await ReturnOrder_service.deleteReturnOrder(1);
        //first call, first parameter passed
        expect(dao.deleteReturnOrder.mock.calls[0][0]).toBe(1);

      
    });
});



describe("delete all Return Orders", () => {
    
    beforeEach(() => {
        dao.getAllReturnOrder.mockReset();
        dao.getAllReturnOrder.mockReturnValueOnce({});

        dao.dropReturnOrderTable.mockReset();
        dao.dropReturnOrderTable.mockReturnValueOnce("OK");

        dao.newReturnOrderTable.mockReset();
        dao.newReturnOrderTable.mockReturnValueOnce("OK");
    });

    test('delete all Return Orders', async () => {


        let res = await ReturnOrder_service.deleteAllReturnOrder();

        let res1 = await ReturnOrder_service.deleteAllReturnOrder();
        expect(res1).toEqual(200);
    });
});



describe("test with closed connection to Return Order Table", () => {
    
    beforeEach(() => {
        dao.closeReturnOrderTable.mockReset();
        dao.closeReturnOrderTable.mockReturnValueOnce(true);

        dao.dropReturnOrderTable.mockReset();
        dao.dropReturnOrderTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeReturnOrder.mockReset();
        dao.storeReturnOrder.mockImplementationOnce(() => {
            throw new Error();
        });

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockImplementation(() => {
            throw new Error();
        });

        dao.getAllReturnOrder.mockReset();
        dao.getAllReturnOrder.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getReturnOrderById.mockReset();
        dao.getReturnOrderById.mockImplementation(() => {
            throw new Error();
        });

    });

    test('test with closed connection to Return Order Table', async () => {
        const id = 1;
        const ReturnOrder = {
            id: 1,
            returnDate:"2021/11/29 09:33",
            products: [{"SKUId":1,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                        {"SKUId":2,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
            restockOrderId : 1
        }

        await ReturnOrder_service.closeConnectionReturnOrder();

        let res = await ReturnOrder_service.setReturnOrder(ReturnOrder.returnDate, ReturnOrder.products, ReturnOrder.restockOrderId);
        expect(res).toEqual(503);

        res = await ReturnOrder_service.getReturnOrder();
        expect(res).toEqual(500);

        res = await ReturnOrder_service.getReturnOrderById(id);
        expect(res).toEqual(500);

        res = await ReturnOrder_service.deleteReturnOrder(id);
        expect(res).toEqual(503);

        res = await ReturnOrder_service.deleteAllReturnOrder();
        expect(res).toEqual(500);

    });

});