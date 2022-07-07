class PositionService {

    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getPositions = async () => {
        try {
            const positions = await this.dao.getStoredPositions();
            return positions;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    createPosition = async (data) => {
        try {
            //await this.dao.newPositionTable();
            const position = await this.dao.storePosition(data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume);
            return position;
        } catch (err) {
            console.log("Generic error!");
            return "c503";
        }
    }

    modifyPosition = async (data, posID) => {

        const posTest = await this.dao.getPosById(posID);
        if (posTest === undefined) {
            console.log("No position associated to positionID!");
            return 404;
        }

        const newPosID = data.newAisleID + data.newRow + data.newCol;

        try {
            await this.dao.updateSkuPosition(newPosID, posID);
            await this.dao.modifyPos(data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, posID);
            /*
            const sku = await this.dao.getPosOccupied(posID);
            if(sku != undefined) {
                const weight = sku.weight * sku.availableQuantity;
                const volume = sku.volume * sku.availableQuantity;

                await this.dao.modifyPos(data, weight, volume, posID);
                await this.dao.updateSkuPosition(data.newAisleID + data.newRow + data.newCol, posID);
            }
            else {
                await this.dao.modifyPos(data, 0, 0, posID);
            }
            */
            return 200;
        } catch (err) {
            console.log("Generic error here!");
            return 503;
        }
    }

    modifyPosID = async (data, posID) => {

        const posTest = await this.dao.getPosById(posID);
        if (posTest === undefined) {
            console.log("No position associated to positionID!");
            return 404;
        }

        try {
            const position = await this.dao.modifyPositionID(data.newPositionID, posID);
            await this.dao.updateSkuPosition(data.newPositionID, posID);
            return position;
        } catch (err) {
            console.log("Generic error!");
            return 503;
        }

    }

    deletePosition = async (posID) => {
        try {
            const position = await this.dao.getPosById(posID);

            if (position === undefined) {
                console.log("Position not found!");
                return 404;
            }

            await this.dao.deleteSkuPos(posID);
            const result = await this.dao.deletePosition(posID);
            console.log("Position successfully deleted!");
            return result;
        }
        catch(err){
            console.log("Generic error!");
            return 503;
        }
    }

    deleteAllPositions = async () => {
        try {
            await this.dao.dropPositionTable();
            await this.dao.newPositionTable();
            console.log("Position Table is now empty!");
            return result;
        }
        catch(err){
            console.log("Generic error!");
            return 503;
        }
    }

    closeConncetionPosition = async () => {
        await this.dao.closePositionTable();
        return true;
    }
}

module.exports = PositionService;