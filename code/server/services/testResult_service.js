class TestResultService {

    //skuItems = require("../modules/dbManager").item_DAO;

    dao;
    skuItems;

    constructor(dao, skuItems) {
        this.dao = dao;
        this.skuItems = skuItems;
    }

    getTestResults = async (rfid) => {
        try {
            const skuItem = await this.skuItems.getStoredSKUItemByRfid(rfid);

            if (skuItem === undefined) {
                console.log("No sku item associated to rfid!");
                return 404;
            }

            const testResults = await this.dao.getStoredTestResults(rfid);

            return testResults;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getTestResultsById = async (rfid, id) => {

        try {

            const skuItem = await this.skuItems.getStoredSKUItemByRfid(rfid);
            const testResult = await this.dao.getStoredTestResultById(id);

            if (skuItem === undefined) {
                console.log("No sku item associated to rfid!");
                return 404;
            }

            if (testResult === undefined) {
                console.log("No test result associated to id!");
                return 404;
            }

            const result = await this.dao.getStoredTestResultByIdAndRfid(id, rfid);

            return result;

        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    setTestResult = async (rfid, idTestDescriptor, date, result) => {

        try {

            const testDescriptor = await this.dao.getStoredTestDescriptorById(idTestDescriptor);
            const skuItem = await this.skuItems.getStoredSKUItemByRfid(rfid);

            if (testDescriptor === undefined) {
                console.log("No test descriptor associated to idTestDescriptor!");
                return "c404";
            }

            if (skuItem === undefined) {
                console.log("No sku item associated to rfid!");
                return "c404";
            }

            const newId = this.dao.storeTestResult(rfid, idTestDescriptor, date, result);
            console.log("Test result successfully created!");
            return newId;
        }
        catch (err) {
            console.log("Generic error!");
            return "c503";
        }
    }

    modifyTestResult = async (newIdTestDescriptor, newDate, newResult, id, rfid) => {

        try {

            let testResult = await this.dao.getStoredTestResultById(id);
            const testDescriptor = await this.dao.getStoredTestDescriptorById(newIdTestDescriptor);
            const skuItem = await this.skuItems.getStoredSKUItemByRfid(rfid);

            if (testResult === undefined) {
                console.log("No test result associated to id!");
                return 404;
            }

            if (testDescriptor === undefined) {
                console.log("No test descriptor associated to newIdTestDescriptor!");
                return 404;
            }

            if (skuItem === undefined) {
                console.log("No sku item associated to rfid!");
                return 404;
            }

            testResult = await this.dao.getStoredTestResultByIdAndRfid(id, rfid);

            if (testResult === undefined) {
                console.log("Test result associated to id and rfid not found!");
                return 404;
            }
            else {
                const result = await this.dao.modifyTestResult(newIdTestDescriptor, newDate, newResult, id, rfid);
                console.log("Test result successfully updated!");
                return result;
            }

        } catch (err) {
            console.log("Generic error!");
            return 503;
        }
    }

    deleteTestResult = async (id, rfid) => {
        try {

            const skuItem = await this.skuItems.getStoredSKUItemByRfid(rfid);
            let testResult = await this.dao.getStoredTestResultById(id);

            if (testResult === undefined) {
                console.log("No test result associated to id!");
                return 404;
            }

            if (skuItem === undefined) {
                console.log("No sku item associated to rfid!");
                return 404;
            }

            testResult = await this.dao.getStoredTestResultByIdAndRfid(id,rfid);

            if(testResult === undefined){
                console.log("Test result associated to id and rfid not found!");
                return 404;
            }

            const result = await this.dao.deleteTestResult(id, rfid);
            console.log("Test result successfully deleted!");
            return result;
        } catch (err) {
            console.log("Generic Error!");
            return 503;
        }
    }

    deleteAllTestResults = async () => {
        try {

            await this.dao.dropTestResultTable();
            await this.dao.newTestResultTable();
            console.log("Test Result Table is now empty!");
            return 200;
        } catch (err) {
            console.log("Generic Error!");
            return 500;
        }
    }

    closeConncetionResult = async () => {
        await this.dao.closeTestResultTable();
        return true;
    }

}

module.exports = TestResultService;