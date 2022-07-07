class SKUItemService {

    dao;
    skuDB;

    constructor(dao, skuDB) {
        this.dao = dao;
        this.skuDB = skuDB;
    }

    closeConnectionSkuItem = async () => {
        await this.dao.closeSkuItemTable();
        return true;
    }

    // SKU ITEM

    getSKUItems = async () => {
        try {
            const skuitems = await this.dao.getStoredSKUItems();
            return skuitems;
        } catch (err) {
            console.log("Generic error");
            return 500;
        }
    }

    getAvSKUItems = async (SKUId) => {
        try {
            const skuitem = await this.dao.getAvailableSKUItems(SKUId);
            const sku = await this.skuDB.getStoredSkuById(SKUId);
            if (sku === undefined) {
                console.log("SKU not found");
                return 404;
            }
            return skuitem;
        } catch (err) {
            console.log("Generic error");
            return 500;
        }
    }

    getSKUItemRFID = async (RFID) => {
        try {
            const skuitem = await this.dao.getStoredSKUItemByRfid(RFID);
            if (skuitem === undefined) {
                console.log("SKUItem not found");
                return 404;
            }
            console.log("SKUItem successfully returned");
            return skuitem;
        } catch (err) {
            console.log("Generic error");
            return 500;
        }
    }

    setSKUItem = async (RFID, SKUId, DateOfStock) => {
        try {
            const sku = await this.skuDB.getStoredSkuById(SKUId);
            if (sku === undefined) {
                console.log("SKU not found");
                return "c404";
            }
            const unique = await this.dao.getStoredSKUItemByRfid(RFID);
            if (unique !== undefined) {
                console.log("RFID must be unique");
                return "c409";
            }
            const result = this.dao.storeSKUItem(RFID, SKUId, DateOfStock);
            console.log("SKUItem successfully created");
            return result;
        } catch (err) {
            console.log("Generic error");
            return "c503";
        }
    }

    modSKUItem = async (newRFID, newAvailable, newDateOfStock, RFID) => {
        try {
            const skuitem = await this.dao.getStoredSKUItemByRfid(RFID);
            if (skuitem === undefined) {
                console.log("SKUItem not found");
                return 404;
            }
            if (newRFID !== RFID) {
                const unique = await this.dao.getStoredSKUItemByRfid(newRFID);
                if (unique !== undefined) {
                    console.log("RFID must be unique");
                    return 409;
                }
            }
            const result = await this.dao.modifySKUItem(newRFID, newAvailable, newDateOfStock, RFID);
            console.log("SKUItem successfully updated");
            return result;
        } catch (err) {
            console.log("Generic Error");
            return 503;
        }
    }

    delSKUItem = async (RFID) => {
        try {

            const skuitem = await this.dao.getStoredSKUItemByRfid(RFID);
            if (skuitem === undefined) {
                console.log("SKUItem not found");
                return 404;
            }
            const result = await this.dao.deleteSKUItem(RFID);
            console.log("SKUItem successfully deleted");
            return result;
        } catch (err) {
            console.log("Generic Error");
            return 503;
        }
    }

    deleteAllSKUItems = async () => {
        try {

            this.dao.dropSKUItemsTable();
            this.dao.newSKUItemsTable();
            console.log("SKUItem Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 503;
        }

    }

}

module.exports = SKUItemService;