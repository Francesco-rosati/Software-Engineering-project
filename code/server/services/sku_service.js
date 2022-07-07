class SkuService {

    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getSkus = async () => {
        try {
            const skus = await this.dao.getStoredSkus();
            return skus;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getSkuById = async (id) => {
        try {
            const sku = await this.dao.getStoredSkuById(id);
            if(sku === undefined) {
                return 404;
            } 
            else return sku;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    createSku = async (data) => {
        try {
            //await dao.newSkusTable();
            const sku = await this.dao.storeSku(data.description, data.weight, data.volume, data.notes, data.price, data.availableQuantity);
            console.log("Sku successfully created!");
            return sku;
        } catch (err) {
            console.log("Generic error!");
            return "c503";
        }
    }

    modifySku = async (data, id) => {


        const skuTset = await this.dao.getStoredSkuById(id);
        if (skuTset === undefined) {
            console.log("Sku not existing!");
            return 404;
        }

        //  When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position 
        // (if the SKU is associated to a position) are modified according to the new available quantity.
        const positionID = skuTset.position;
        if (positionID != undefined && positionID != null) {

            const position = await this.dao.getPosById(positionID);

            if (position != undefined) {

                const maxW = position.maxWeight;
                const maxV = position.maxVolume;

                //const occW = position.occupiedWeight;
                //const occV = position.occupiedVolume;

                const newW = (data.newWeight * data.newAvailableQuantity); // + occW;
                const newV = (data.newVolume * data.newAvailableQuantity); // + occV;

                if (maxW > newW && maxV > newV) {
                    this.dao.updateWVposition(positionID, newW, newV);
                }
                else {
                    console.log("Position is not capable enough in weight or in volume!")
                    return 422;
                }
            }
        }

        try {
            const sku = await this.dao.modifySku(data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, id);
            console.log("Sku successfully updated!");
            return sku;
        } catch (err) {
            console.log("Generic error!");
            return 503;
        }
    }

    modifySkuPosition = async (posId, id) => {

        const skuTest = await this.dao.getStoredSkuById(id);
        if (skuTest === undefined) {
          console.log("Sku not existing!");
          return 404;
        }

        const skuPos = await this.dao.getPosOccupied(posId);
        if(skuPos != undefined){
            console.log("Position already occupied by another Sku!");
            return 422;
        }

        const position = await this.dao.getPosById(posId);
        if (position === undefined) {
            console.log("Position not existing!");
            return 404;
        }
        else {
            const maxW = position.maxWeight;
            const maxV = position.maxVolume;

            const occW = position.occupiedWeight;
            const occV = position.occupiedVolume;

            const newW = (skuTest.weight * skuTest.availableQuantity) + occW;
            const newV = (skuTest.volume * skuTest.availableQuantity) + occV;

            if (maxW > newW && maxV > newV) {
                this.dao.updateWVposition(posId, newW, newV);
                if(skuTest.position != null && skuTest.position != posId) {
                    /* ------
                    const posToUpdate = await this.dao.getPosById(positionID);
                    if(posToUpdate != undefined) {
                        let occW = posToUpdate.occupiedWeight;
                        let occV = posToUpdate.occupiedVolume;
                        await this.dao.reduceWVposition(skuTest.position, (skuTest.weight * skuTest.availableQuantity), 
                                (skuTest.volume * skuTest.availableQuantity), occW, occV);
                    }
                    // ----- */
                    await this.dao.reduceWVposition(skuTest.position, (skuTest.weight * skuTest.availableQuantity), 
                                (skuTest.volume * skuTest.availableQuantity));
                }
            }
            else {
                console.log("Position is not capable enough in weight or in volume!")
                return 422;
            }
        }
        
        try {
            const sku = await this.dao.modifySkuPosition(posId, id);
            console.log("Sku position successfully updated!");
            return sku;
        } catch (err) {
            console.log("Generic error!");
            return 503;
        }
    }

    deleteSku = async (id) => {
        try {
            const sku = await this.dao.getStoredSkuById(id);

            if (sku === undefined) {
                console.log("Sku not found!");
                return 204;
            }

            if(sku.position != null) {
                const weight = sku.weight * sku.availableQuantity;
                const volume = sku.volume * sku.availableQuantity;
                /* -------
                const posToUpdate = await this.dao.getPosById(positionID);
                if(posToUpdate != undefined) {
                    let occW = posToUpdate.occupiedWeight;
                    let occV = posToUpdate.occupiedVolume;
                    await this.dao.reduceWVposition(sku.position, weight, volume, occW, occV);
                }
                // ----- */
                //await this.dao.reduceWVposition(sku.position, weight, volume);
            }

            const result = await this.dao.deleteSku(id);
            console.log("Sku successfully deleted!");
            return result;
        }
        catch(err){
            console.log("Generic error!");
            return 503;
        }
    }

    deleteAllSkus = async () => {
        try {
            await this.dao.dropSkuTable();
            await this.dao.newSkusTable();
            console.log("Sku Table is now empty!");
            return 200;
        }
        catch(err) {
            console.log("Generic error!");
            return 500;
        }
    }

    closeConncetionSku = async () => {
        await this.dao.closeSkusTable();
        return true;
    }
    
}

module.exports = SkuService;