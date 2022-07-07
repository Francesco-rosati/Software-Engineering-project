const testResultDao = require('../modules/dbManager').test_DAO;


beforeAll(async () => {
    await testResultDao.dropTestResultTable();
    await testResultDao.newTestResultTable();
});

describe('testResult Dao', () => {

    testNewTestResult(1, "12345678901234567890123456789016", 12, "2020/11/28", true);
    testNewTestResult(2, "22345678901456567890123456789016", 15, "2021/11/12", false);
    testNewTestResult(3, "32345678901234567812323456789016", 32, "2001/05/28", true);

    TestGetStoredTestResults("32345678901234567812323456789016");

    TestGetStoredTestResultByIdAndRfid(1, "12345678901234567890123456789016", 12, "2020/11/28", true);

    TestetStoredTestResultById(1, "12345678901234567890123456789016", 12, "2020/11/28", true);
    TestetStoredTestResultById(5, "12345678901234567890123456789016", 12, "2020/11/28", true);

    testDeleteTestResult(2, "22345678901456567890123456789016");

    testModifyTestResult(7, "2022/01/03", false, 1, "12345678901234567890123456789016");

    // CLOSE CONNECTION TO TEST-RESULT TABLE
    TestCloseTestResultTable();

    testNewTestResult(4, "12345678901234567890123456789016", 12, "2020/11/28", true);

    TestGetStoredTestResults("32345678901234567812323456789016");

    TestGetStoredTestResultByIdAndRfid(1, "12345678901234567890123456789016", 12, "2020/11/28", true);

    TestetStoredTestResultById(1, "12345678901234567890123456789016", 12, "2020/11/28", true);

    testDeleteTestResult(2, "22345678901456567890123456789016");

    testModifyTestResult(7, "2022/01/03", false, 1, "12345678901234567890123456789016");

    testDropAndCreateTable();
});

function testNewTestResult(id, rfid, idTestDescriptor, Date, Result) {
    test('create new testResult', async () => {

        try {
            await testResultDao.storeTestResult(rfid, idTestDescriptor, Date, Result);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        var res = await testResultDao.getStoredTestResultByIdAndRfid(id, rfid);

        expect(res.id).toStrictEqual(id);
        expect(res.idTestDescriptor).toStrictEqual(idTestDescriptor);
        expect(res.Date).toStrictEqual(Date);
        expect(res.Result).toStrictEqual(Result);
    });
}

function TestGetStoredTestResults(rfid) {
    test('get all testResults for a certain sku item identified by RFID', async () => {        
        try {
            var res = await testResultDao.getStoredTestResults(rfid);
        } catch(err){
            console.log("---- error -----");
            return;
        }

        expect(res.length).toStrictEqual(1);
    });
}

function TestetStoredTestResultById(id, rfid, idTestDescriptor, Date, Result) {
    test('get the testResults corresponding to a certain id', async () => {
        try {
            var res = await testResultDao.getStoredTestResultById(id);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        
        if(res === undefined) {
            return;
        }

        expect(res.id).toStrictEqual(id);
        expect(res.idTestDescriptor).toStrictEqual(idTestDescriptor);
        expect(res.Date).toStrictEqual(Date);
        expect(res.Result).toStrictEqual(Result);
    });
}

function TestGetStoredTestResultByIdAndRfid(id, rfid, idTestDescriptor, Date, Result) {
    test('get the testResults corresponding to a certain id', async () => {
        try {
            var res = await testResultDao.getStoredTestResultByIdAndRfid(id, rfid);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        
        if(res === undefined) {
            return;
        }

        expect(res.id).toStrictEqual(id);
        expect(res.idTestDescriptor).toStrictEqual(idTestDescriptor);
        expect(res.Date).toStrictEqual(Date);
        expect(res.Result).toStrictEqual(Result);
    });
}

function testDeleteTestResult(id, rfid) {
    test('delete testResult', async () => {
        try {
            await testResultDao.deleteTestResult(id, rfid);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        var res = await testResultDao.getStoredTestResultByIdAndRfid(id, rfid);

        expect(res).toStrictEqual(undefined);
    });
}


function testModifyTestResult(newIdTestDescriptor, newDate, newResult, id, rfid) {
    test('modify testResult', async () => {
        try {
            await testResultDao.modifyTestResult(newIdTestDescriptor, newDate, newResult, id, rfid);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        res = await testResultDao.getStoredTestResultByIdAndRfid(id, rfid);

        expect(res.id).toStrictEqual(id);
        expect(res.idTestDescriptor).toStrictEqual(newIdTestDescriptor);
        expect(res.Date).toStrictEqual(newDate);
        expect(res.Result).toStrictEqual(newResult);
    });
}

function testDropAndCreateTable() {
    test('drop an create testResult table', async () => {

        try {
            await testResultDao.newTestResultTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await testResultDao.dropTestResultTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestCloseTestResultTable() {
    test('close test Descriptor Table', async () => {

        await testResultDao.closeTestResultTable();
    });
}