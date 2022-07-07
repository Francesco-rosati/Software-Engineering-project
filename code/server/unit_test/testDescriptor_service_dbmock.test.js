const TestDescriptorService = require('../services/testDescriptor_service');
const dao = require('../modules/mock_tests_dao')
const skuTable = require('../modules/mock_sku_dao')
const testDescriptor_service = new TestDescriptorService(dao, skuTable);

describe('get Test Descriptor', () => {

    beforeEach(() => {
        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockReturnValueOnce({
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 3
        }).mockReturnValue({
            id: 2,
            name: "Test 2",
            procedureDescription: "description 2",
            idSKU: 5
        });
    });

    test('get TestDescriptor', async () => {
        const id = 1;
        let res = await testDescriptor_service.getTestDescriptorById(id);
        expect(res).toEqual({
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 3
        });
        res = await testDescriptor_service.getTestDescriptorById(id);
        expect(res).toEqual({
            id: 2,
            name: "Test 2",
            procedureDescription: "description 2",
            idSKU: 5
        });
    });

});


describe('get all Test Descriptors', () => {
    beforeEach(() => {
        dao.getStoredTestDescriptors.mockReset();
        dao.getStoredTestDescriptors.mockReturnValueOnce(
            {
                id: 1,
                name: "Test 1",
                procedureDescription: "description 1",
                idSKU: 7
            },
            {
                id: 2,
                name: "Test 2",
                procedureDescription: "description 2",
                idSKU: 8
            }
        );
    });

    test('get all TestDescriptors', async () => {
        let res = await testDescriptor_service.getTestDescriptors();
        expect(res).toEqual({
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 7
        },
        {
            id: 2,
            name: "Test 2",
            procedureDescription: "description 2",
            idSKU: 8
        });
    });

});


describe("set Test Descriptor", () => {
    beforeEach(() => {
        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "802134564321",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "1,2"
        }).mockReturnValueOnce(undefined);

        skuTable.setTestDescriptorSku.mockReset();
        skuTable.setTestDescriptorSku.mockReturnValueOnce("Sku successfully updated!");
    })
    test('set TestDescriptor', async () => {
        const testDescriptor = {
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 2
        }

        let res = await testDescriptor_service.setTestDescriptor(testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU);
        //first call, first parameter passed
        expect(dao.storeTestDescriptor.mock.calls[0][0]).toBe(testDescriptor.name);
        //first call, second parameter passed
        expect(dao.storeTestDescriptor.mock.calls[0][1]).toBe(testDescriptor.procedureDescription);
        //first call, third parameter passed
        expect(dao.storeTestDescriptor.mock.calls[0][2]).toBe(testDescriptor.idSKU);

        res = await testDescriptor_service.setTestDescriptor(testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU);
        expect(res).toBe("c404");
    });
});

describe("modify Test Descriptor", () => {
    beforeEach(() => {
        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockReturnValueOnce({
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 7
        }).mockReturnValueOnce(undefined);

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "802134564321",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "1,2"
        }).mockReturnValueOnce(undefined).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "802134564321",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "1,2"
        });

        skuTable.modifyTestDescSku.mockReset();
        skuTable.modifyTestDescSku.mockReturnValueOnce(1);
    });

    test('modify TestDescriptor', async () => {
        const modDescriptor = {
            id: 1,
            newName: "Test 1",
            newProcedureDescription: "description 1",
            newIdSKU: 3
        }

        let res = await testDescriptor_service.modifyTestDescriptor(modDescriptor.id, modDescriptor.newName, modDescriptor.newProcedureDescription, modDescriptor.newIdSKU);
        //first call, first parameter passed
        expect(dao.modifyTestDescriptor.mock.calls[0][0]).toBe(modDescriptor.id);
        //first call, second parameter passed
        expect(dao.modifyTestDescriptor.mock.calls[0][1]).toBe(modDescriptor.newName);
        //first call, third parameter passed
        expect(dao.modifyTestDescriptor.mock.calls[0][2]).toBe(modDescriptor.newProcedureDescription);
        //first call, fourth parameter passed
        expect(dao.modifyTestDescriptor.mock.calls[0][3]).toBe(modDescriptor.newIdSKU);

        res = await testDescriptor_service.modifyTestDescriptor(modDescriptor.id, modDescriptor.newName, modDescriptor.newProcedureDescription, modDescriptor.newIdSKU);
        expect(res).toBe(404);

        res = await testDescriptor_service.modifyTestDescriptor(modDescriptor.id, modDescriptor.newName, modDescriptor.newProcedureDescription, modDescriptor.newIdSKU);
        expect(res).toBe(404);
    });
});


describe("delete Test Descriptor", () => {
    
    beforeEach(() => {
        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockReturnValueOnce({
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 7
        }).mockReturnValueOnce({
            id: 2,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 7
        }).mockReturnValue(undefined);
    });

    test('delete TestDescriptor', async () => {
        
        let get1 = await testDescriptor_service.getTestDescriptorById(1);
        expect(get1).toEqual({
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 7
        });

        let res = await testDescriptor_service.deleteTestDescriptor(1);
        //first call, first parameter passed
        expect(dao.deleteTestDescriptor.mock.calls[0][0]).toBe(1);

        let get2 = await testDescriptor_service.getTestDescriptorById(1);
        expect(get2).toEqual(404);

        res = await testDescriptor_service.deleteTestDescriptor(1);
        expect(res).toBe(404);
        
    });
});

describe("delete all Test Descriptors", () => {
    
    beforeEach(() => {
        dao.getStoredTestDescriptors.mockReset();
        dao.getStoredTestDescriptors.mockReturnValueOnce({});

        dao.dropTestDescriptorTable.mockReset();
        dao.dropTestDescriptorTable.mockReturnValueOnce("OK");

        dao.newTestDescriptorTable.mockReset();
        dao.newTestDescriptorTable.mockReturnValueOnce("OK");
    });

    test('delete all Test Descriptors', async () => {


        let res = await testDescriptor_service.deleteAllTestDescriptors();

        let get = await testDescriptor_service.getTestDescriptors();
        expect(get).toEqual({});
    });
});


describe("test with closed connection to Test Descriptor Table", () => {
    
    beforeEach(() => {
        dao.closeTestDescriptorTable.mockReset();
        dao.closeTestDescriptorTable.mockReturnValueOnce(true);

        dao.dropTestDescriptorTable.mockReset();
        dao.dropTestDescriptorTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeTestDescriptor.mockReset();
        dao.storeTestDescriptor.mockImplementationOnce(() => {
            throw new Error();
        });

        skuTable.getStoredSkuById.mockReset();
        skuTable.getStoredSkuById.mockImplementation(() => {
            throw new Error();
        });

        dao.getStoredTestDescriptors.mockReset();
        dao.getStoredTestDescriptors.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredTestDescriptorById.mockReset();
        dao.getStoredTestDescriptorById.mockImplementation(() => {
            throw new Error();
        });
    });

    test('test with closed connection to Test Descriptor Table', async () => {
        const id = 1;
        const testDescriptor = {
            id: 1,
            name: "Test 1",
            procedureDescription: "description 1",
            idSKU: 2
        }

        await testDescriptor_service.closeConnectionDescriptor();

        let res = await testDescriptor_service.setTestDescriptor(testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU);
        expect(res).toEqual("c503");

        res = await testDescriptor_service.getTestDescriptors();
        expect(res).toEqual(500);

        res = await testDescriptor_service.getTestDescriptorById(id);
        expect(res).toEqual(500);

        res = await testDescriptor_service.modifyTestDescriptor(testDescriptor.id, testDescriptor.name, testDescriptor.procedureDescription, testDescriptor.idSKU);
        expect(res).toEqual(503);

        res = await testDescriptor_service.deleteTestDescriptor(id);
        expect(res).toEqual(503);

        res = await testDescriptor_service.deleteAllTestDescriptors();
        expect(res).toEqual(500);
    });

});
