class ItemService {

    dao;
    skuDB;
    userDB;

    constructor(dao,skuDB,userDB) {
        this.dao = dao;
        this.skuDB = skuDB;
        this.userDB = userDB;
    }

    getItems = async () => {
        try {
            const items = await this.dao.getStoredItems();
            return items;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getItemsById = async (id, supid) => {
        try {
            const item = await this.dao.getStoredItemById(id, supid);

            if (item === undefined) {
                console.log("No Item associated to this id");
                return 404;
            }
            return item;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    setItem = async (id, description, price, SKUId, supplierId) => {

        try {

            const sku = await this.skuDB.getStoredSkuById(SKUId);
            const item1 = await this.dao.getStoredItemByIdAndSupplierId(id,supplierId);
            const item2 = await this.dao.getStoredItemBySKUIdAndSupplierId(SKUId,supplierId);
            //const supplier = await this.userDB.getUserByIdAndType(supplierId,"supplier");

            if (sku === undefined) {
                console.log("Sku not found");
                return "c404";
            }

            if(item1 !== undefined){
                console.log("The supplier already sells an Item with the same id!");
                return "c422";
            }

            if(item2 !== undefined){
                console.log("The supplier already sells an item with the same SKUId!");
                return "c422";
            }

            /*if(supplier === undefined){
                console.log("Supplier ID is not a supplier!");
                return "c422";
            }*/

            const result = this.dao.storeItem(id, description, price, SKUId, supplierId);
            return result;
        }
        catch (err) {
            console.log("Generic error!");
            return "c503";
        }

    }

    modifyItem = async (id, supid, newDescription,newPrice) => {
        try {

            const item = await this.dao.getStoredItemById(id, supid);

            if (item === undefined) {
                console.log("Item not existing!");
                return 404;
            }

            const result = await this.dao.modifyItem(newDescription,newPrice,id,supid);
            console.log("Item successfully updated!");
            return result;

        } catch (err) {
            console.log("Generic Error!");
            return 503;
        }
    }

    deleteItem = async (id, supid) => {
        try {
            const item = await this.dao.getStoredItemById(id, supid);

            if (item === undefined) {
                console.log("Item not found!");
                return 404;
            }

            const result = await this.dao.deleteItem(id, supid);
            console.log("Item successfully deleted!");
            return result;
        } catch (err) {
            console.log("Generic Error!");
            return 503;
        }
    }

    deleteAllItems = async () => {
        try {

            this.dao.dropItemsTable();
            this.dao.newItemsTable();
            console.log("Item Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 503;
        }

    }

    closeConnectionItem = async () => {
        await this.dao.closeItemTable();
        return true;
    }

}

module.exports = ItemService;