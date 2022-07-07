const testDescriptorDao = require('../modules/dbManager').test_DAO;

beforeAll(async () => {
    await testDescriptorDao.dropTestDescriptorTable();
    await testDescriptorDao.newTestDescriptorTable();
});

describe('test testDescriotor', () => {
    testNewTestDescriptor(1, "test descriptor 1", "This test is described by...", 1);
    testNewTestDescriptor(2, "test descriptor 2", "This test is described by...", 5);
    testNewTestDescriptor(3, "test descriptor 3", "This test is described by...", 6);

    testDeleteTestDescriptor(2);

    TestGetStoredTestDescriptors();

    TestGetStoredTestDescriptorById(2);

    testModifyTestDescriptor(1, "Mod test 1", "Mod description", 8)

    // CLOSE CONNECTION TO TEST-DESCRIPTOR TABLE
    TestCloseTestDescriptorTable();

    testNewTestDescriptor(4, "test descriptor 4", "This test is described by...", 1);

    testDeleteTestDescriptor(2);

    TestGetStoredTestDescriptorById(2);

    testModifyTestDescriptor(1, "Mod test 1", "Mod description", 8);

    TestGetStoredTestDescriptors();

    testDropAndCreateTable();
});

function TestGetStoredTestDescriptorById(id) {
    test('get a test Descriptor', async () => {

        try {
            res = await testDescriptorDao.getStoredTestDescriptorById(id);
        } catch(err){
            console.log("---- error -----");
            return;
        }

        expect(res).toStrictEqual(undefined);
    });
}

function TestGetStoredTestDescriptors() {
    test('get all test Descriptors', async () => {

        try {
            res = await testDescriptorDao.getStoredTestDescriptors();
        } catch(err){
            console.log("---- error -----");
            return;
        }
        expect(res.length).toStrictEqual(2);
    });
}


function testNewTestDescriptor(id, name, procedure_description, idsku) {
    test('create new testDescriptor', async () => {
        
        try {
            res = await testDescriptorDao.storeTestDescriptor(name, procedure_description, idsku);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        
        res = await testDescriptorDao.getStoredTestDescriptors();
        expect(res.length).toStrictEqual(id);
        
        res = await testDescriptorDao.getStoredTestDescriptorById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(name);
        expect(res.procedureDescription).toStrictEqual(procedure_description);
        expect(res.idSKU).toStrictEqual(idsku);
    });
}

function testDeleteTestDescriptor(id) {
    test('delete testDescriptor', async () => {
        
        try {
            await testDescriptorDao.deleteTestDescriptor(id);
        } catch(err){
            console.log("---- error -----");
            return;
        }
    });
}

function testModifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU) {
    test('modify testDescriptor', async () => {

        try {
            await testDescriptorDao.modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        
        res = await testDescriptorDao.getStoredTestDescriptorById(id);

        expect(res.id).toStrictEqual(id);
        expect(res.name).toStrictEqual(newName);
        expect(res.procedureDescription).toStrictEqual(newProcedureDescription);
        expect(res.idSKU).toStrictEqual(newIdSKU);
    });
}

function testDropAndCreateTable() {
    test('drop an create test Descriptor table', async () => {

        try {
            await testDescriptorDao.newTestDescriptorTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await testDescriptorDao.dropTestDescriptorTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestCloseTestDescriptorTable() {
    test('close test Descriptor Table', async () => {

        await testDescriptorDao.closeTestDescriptorTable();
    });
}