class TestDescriptorService {

    //skuTable = require("../modules/dbManager").sku_positionDAO;

    dao;
    skuTable;

    constructor(dao, skuTable) {
        this.dao = dao;
        this.skuTable = skuTable;
    }

    getTestDescriptors = async () => {
        try {
            const testDescriptors = await this.dao.getStoredTestDescriptors();
            return testDescriptors;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getTestDescriptorById = async (id) => {
        try {

            const testDescriptor = await this.dao.getStoredTestDescriptorById(id);

            if (testDescriptor === undefined) {
                console.log("No test descriptor associated to id");
                return 404;
            }
            return testDescriptor;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    setTestDescriptor = async (name, procedureDescription, idSKU) => {

        try {
            const sku = await this.skuTable.getStoredSkuById(idSKU);
            if (sku === undefined) {
                console.log("No sku associated to idSKU!");
                return "c404";
            }

            const newId = await this.dao.storeTestDescriptor(name, procedureDescription, idSKU);
            await this.skuTable.setTestDescriptorSku(newId, idSKU);
            console.log("Test descriptor successfully created!");
            return newId;
        }
        catch (err) {
            console.log("Generic error!");
            return "c503";
        }
    }

    modifyTestDescriptor = async (id, newName, newProcedureDescription, newIdSKU) => {

        try {
            const sku = await this.skuTable.getStoredSkuById(newIdSKU);
            //const sku = await this.dao.getStoredSkuById(newIdSKU);
            const testDescriptor = await this.dao.getStoredTestDescriptorById(id);

            if (sku === undefined) {
                console.log("No sku associated to newIdSku");
                return 404;
            }

            if (testDescriptor === undefined) {
                console.log("No test descriptor associated to id");
                return 404;
            }

            const result = await this.dao.modifyTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
            await this.skuTable.modifyTestDescSku(id, newIdSKU, testDescriptor.idSKU);
            //await this.dao.modifyTestDescSku(id, newIdSKU, testDescriptor.idSKU);
            console.log("Test descriptor successfully updated!");
            return result;

        }
        catch (err) {
            console.log("Generic error!");
            return 503;
        }

    }

    deleteTestDescriptor = async (id) => {
        try {
            const testDescriptor = await this.dao.getStoredTestDescriptorById(id);

            if (testDescriptor === undefined) {
                console.log("Test descriptor not found!");
                return 404;
            }

            const result = this.dao.deleteTestDescriptor(id);
            console.log("Test descriptor successfully deleted!");
            return result;

        } catch (err) {
            console.log("Generic error!");
            return 503;
        }
    }

    deleteAllTestDescriptors = async () => {
        try {
            this.dao.dropTestDescriptorTable();
            this.dao.newTestDescriptorTable();
            console.log("Test Descriptor Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    closeConnectionDescriptor = async () => {
        await this.dao.closeTestDescriptorTable();
        return true;
    }

}

module.exports = TestDescriptorService;