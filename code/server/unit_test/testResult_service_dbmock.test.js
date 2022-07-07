const TestResultService = require('../services/testResult_service');
const dao = require('../modules/mock_tests_dao')
const skuItems = require('../modules/mock_item_dao')
const testResult_service = new TestResultService(dao, skuItems);

describe('get Test Result', () => {

    beforeEach(() => {
        skuItems.getStoredSKUItemByRfid.mockReset();
        skuItems.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce(undefined).mockReturnValue({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        });

        dao.getStoredTestResultById.mockReset();
        dao.getStoredTestResultById.mockReturnValueOnce({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        }).mockReturnValueOnce({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        }).mockReturnValue(undefined);;

        dao.getStoredTestResultByIdAndRfid.mockReset();
        dao.getStoredTestResultByIdAndRfid.mockReturnValueOnce({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        }).mockReturnValue({
            id: 2,
            idTestDescriptor: 15,
            Date: "2021/11/29",
            Result: true
        });
    });

    test('get Test Result', async () => {
        const id = 1;
        const rfid = "12345678901234567890123456789016";
        let res = await testResult_service.getTestResultsById(id, rfid);
        expect(res).toEqual({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        });
        res = await testResult_service.getTestResultsById(id, rfid);
        expect(res).toEqual({
            id: 2,
            idTestDescriptor: 15,
            Date: "2021/11/29",
            Result: true
        });

        res = await testResult_service.getTestResultsById(id, rfid);
        expect(res).toEqual(404);

        res = await testResult_service.getTestResultsById(id, rfid);
        expect(res).toEqual(404);
    });

});


describe('get all test results for a certain sku item identified by RFID', () => {
    beforeEach(() => {
        skuItems.getStoredSKUItemByRfid.mockReset();
        skuItems.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValue(undefined);;

        dao.getStoredTestResults.mockReset();
        dao.getStoredTestResults.mockReturnValueOnce({
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        },
        {
            id: 2,
            idTestDescriptor: 15,
            Date: "2021/11/29",
            Result: true
        });
    });

    test('get all test results for a certain sku item identified by RFID', async () => {
        const rfid = "12345678901234567890123456789016";
        let res = await testResult_service.getTestResults(rfid);
        expect(res).toEqual(
        {
            id: 1,
            idTestDescriptor: 14,
            Date: "2021/11/29",
            Result: false
        },
        {
            id: 2,
            idTestDescriptor: 15,
            Date: "2021/11/29",
            Result: true
        });

        res = await testResult_service.getTestResults(rfid);
        expect(res).toEqual(404);
    });

});


describe("set Test Result", () => {
    beforeEach(() => {
        skuItems.getStoredSKUItemByRfid.mockReset();
        skuItems.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce(undefined);

        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValueOnce(undefined).mockReturnValue({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        });
    })
    test('set Test Result', async () => {
        const testResult = {
            rfid:"12345678901234567890123456789016",
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true
        }

        let res = await testResult_service.setTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.Date, testResult.Result);
        //first call, first parameter passed
        expect(dao.storeTestResult.mock.calls[0][0]).toBe(testResult.rfid);
        //first call, second parameter passed
        expect(dao.storeTestResult.mock.calls[0][1]).toBe(testResult.idTestDescriptor);
        //first call, third parameter passed
        expect(dao.storeTestResult.mock.calls[0][2]).toBe(testResult.Date);
        //first call, fourth parameter passed
        expect(dao.storeTestResult.mock.calls[0][3]).toBe(testResult.Result);

        res = await testResult_service.setTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.Date, testResult.Result);
        expect(res).toBe("c404");

        res = await testResult_service.setTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.Date, testResult.Result);
        expect(res).toBe("c404");
    });

});


describe("modify Test Result", () => {
    beforeEach(() => {
        skuItems.getStoredSKUItemByRfid.mockReset();
        skuItems.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce(undefined).mockReturnValue({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        });

        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValueOnce(undefined).mockReturnValue({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        });

        dao.getStoredTestResultById.mockReset();
        dao.getStoredTestResultById.mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValueOnce(undefined).mockReturnValue({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        });

        dao.getStoredTestResultByIdAndRfid.mockReset();
        dao.getStoredTestResultByIdAndRfid.mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValueOnce(undefined);
    });

    test('modify Test Result', async () => {
        const id = 1;
        const rfid = "12345678901234567890123456789016";
        const modResult = {
            newIdTestDescriptor:12,
            newDate:"2021/11/28",
            newResult: true
        }

        let res = await testResult_service.modifyTestResult(modResult.newIdTestDescriptor, modResult.newDate, modResult.newResult, id, rfid);
        //first call, first parameter passed
        expect(dao.modifyTestResult.mock.calls[0][0]).toBe(modResult.newIdTestDescriptor);
        //first call, second parameter passed
        expect(dao.modifyTestResult.mock.calls[0][1]).toBe(modResult.newDate);
        //first call, third parameter passed
        expect(dao.modifyTestResult.mock.calls[0][2]).toBe(modResult.newResult);
        //first call, fourth parameter passed
        expect(dao.modifyTestResult.mock.calls[0][3]).toBe(id);
        //first call, fifth parameter passed
        expect(dao.modifyTestResult.mock.calls[0][4]).toBe(rfid);

        res = await testResult_service.modifyTestResult(modResult.newIdTestDescriptor, modResult.newDate, modResult.newResult, id, rfid);
        expect(res).toBe(404);

        res = await testResult_service.modifyTestResult(modResult.newIdTestDescriptor, modResult.newDate, modResult.newResult, id, rfid);
        expect(res).toBe(404);

        res = await testResult_service.modifyTestResult(modResult.newIdTestDescriptor, modResult.newDate, modResult.newResult, id, rfid);
        expect(res).toBe(404);

        res = await testResult_service.modifyTestResult(modResult.newIdTestDescriptor, modResult.newDate, modResult.newResult, id, rfid);
        expect(res).toBe(404);
    });
});


describe("delete Test Result", () => {
    
    beforeEach(() => {
        skuItems.getStoredSKUItemByRfid.mockReset();
        skuItems.getStoredSKUItemByRfid.mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        }).mockReturnValueOnce(undefined).mockReturnValueOnce({
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            Available:0,
            DateOfStock:"2021/11/29 12:30"
        });

        dao.getStoredTestResultById.mockReset();
        dao.getStoredTestResultById.mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValueOnce(undefined).mockReturnValue({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        });

        dao.getStoredTestResultByIdAndRfid.mockReset();
        dao.getStoredTestResultByIdAndRfid.mockReturnValueOnce({
            id:1,
            name:"test descriptor 1",
            procedureDescription: "This test is described by...",
            idSKU :1
        }).mockReturnValue(undefined);
    });

    test('delete Test Result', async () => {
        const id = 1;
        const rfid = "12345678901234567890123456789016";

        let res = await testResult_service.deleteTestResult(id, rfid);
        //first call, first parameter passed
        expect(dao.deleteTestResult.mock.calls[0][0]).toBe(id);
        expect(dao.deleteTestResult.mock.calls[0][1]).toBe(rfid);

        res = await testResult_service.deleteTestResult(id, rfid);
        expect(res).toBe(404);

        res = await testResult_service.deleteTestResult(id, rfid);
        expect(res).toBe(404);

        res = await testResult_service.deleteTestResult(id, rfid);
        expect(res).toBe(404);
    });
});

describe("delete all Test Results", () => {
    beforeEach(() => {
        dao.dropTestResultTable.mockReset();
        dao.dropTestResultTable.mockReturnValueOnce("OK");

        dao.newTestResultTable.mockReset();
        dao.newTestResultTable.mockReturnValueOnce("OK");
    });
    test('delete all Skus', async () => {
        let res = await testResult_service.deleteAllTestResults();
    });
});



describe("test with closed connection to Test Result Table", () => {
    
    beforeEach(() => {
        dao.closeTestResultTable.mockReset();
        dao.closeTestResultTable.mockReturnValueOnce(true);

        dao.dropTestResultTable.mockReset();
        dao.dropTestResultTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeTestResult.mockReset();
        dao.storeTestResult.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredTestResultById.mockReset();
        dao.getStoredTestResultById.mockImplementationOnce(() => {
            throw new Error();
        });
        
        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockImplementationOnce(() => {
            throw new Error();
        });

        skuItems.getStoredSKUItemByRfid.mockReset();
        skuItems.getStoredSKUItemByRfid.mockImplementation(() => {
            throw new Error();
        });
    });

    test('test with closed connectio to Test Result Table', async () => {
        const id = 1;
        const rfid = "12345678901234567890123456789016"
        const testResult = {
            rfid:"12345678901234567890123456789016",
            idTestDescriptor:12,
            Date:"2021/11/28",
            Result: true
        }

        await testResult_service.closeConncetionResult();

        let res = await testResult_service.setTestResult(testResult.rfid, testResult.idTestDescriptor, testResult.Date, testResult.Result);
        expect(res).toEqual("c503");

        res = await testResult_service.getTestResults();
        expect(res).toEqual(500);

        res = await testResult_service.getTestResultsById(rfid, id);
        expect(res).toEqual(500);

        res = await testResult_service.modifyTestResult(testResult.idTestDescriptor, testResult.Date, testResult.Result, id, rfid);
        expect(res).toEqual(503);

        res = await testResult_service.deleteTestResult(id, rfid);
        expect(res).toEqual(503);

        res = await testResult_service.deleteAllTestResults();
        expect(res).toEqual(500);
    });
});