const positionDao = require('../modules/dbManager').sku_positionDAO;

describe('sku Dao', () => {
    beforeAll(async () => {
        await positionDao.dropPositionTable();
        await positionDao.newPositionTable();
    });

    test('delete db', async () => {
        var res = await positionDao.getStoredPositions();
        expect(res.length).toStrictEqual(0);
    });

    testNewPosition("800234543412","8002","3454","3412",1000, 1000);
    testNewPosition("800234543426","8002","3454","3426",1200, 1400);
    testNewPosition("800234543438","8002","3454","3438",1400, 1700);

    testDeletePosition("800234543426");

    TestGetStoredPositions();

    TestGetPosById("800234543438");

    testModifyPosition("7002","3454","3431",1400, 1700, 300, 250, "800234543438")

    TestModifyPositionID("600234543419", "800234543412");

    TestUpdateWVposition("600234543419", 650, 350);

    TestReduceWVposition("600234543419", 300, 100);
    TestReduceWVposition("888234543419", 300, 100);

    // CLOSE CONNETION TO POSITION TABLE
    TestClosePositionTable();

    testNewPosition("800234543412","8002","3454","3412",1000, 1000);

    testDeletePosition("800234543426");

    TestGetStoredPositions();

    TestGetPosById("800234543438");

    testModifyPosition("7002","3454","3431",1400, 1700, 300, 250, "800234543438")

    TestModifyPositionID("600234543419", "800234543412");

    testDropAndCreateTable();

});

function testNewPosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
    test('Create new Position', async () => {

        try {
            await positionDao.storePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        res = await positionDao.getPosById(positionID);

        expect(res.positionID).toStrictEqual(positionID);
        expect(res.aisleID).toStrictEqual(aisleID);
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);
        expect(res.occupiedWeight).toStrictEqual(0);
        expect(res.occupiedVolume).toStrictEqual(0);
    });
}

function TestGetStoredPositions() {
    test('get all Positions', async () => {

        try {
            res = await positionDao.getStoredPositions();
        } catch(err){
            console.log("---- error -----");
            return;
        }
        expect(res.length).toStrictEqual(2);

    });
}

function TestGetPosById(positionID) {
    test('get a Position', async () => {

        try {
            res = await positionDao.getPosById(positionID);
        } catch(err){
            console.log("---- error -----");
            return;
        }
        expect(res.positionID).toStrictEqual(positionID);
    });

}

function testDeletePosition(positionID) {
    test('Delete Position', async () => {

        try {
            await positionDao.deletePosition(positionID);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        var res = await positionDao.getStoredPositions();
        expect(res.length).toStrictEqual(2);
        
        res = await positionDao.getPosById(positionID);
        expect(res).toStrictEqual(undefined);
    });
}

function testModifyPosition(newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, positionID) {
    test('Modify Position', async () => {

        const newPositionID = newAisleID + newRow + newCol;

        try {
            await positionDao.modifyPos(newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, positionID)
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        res = await positionDao.getPosById(newPositionID);

        expect(res.positionID).toStrictEqual(newPositionID);
        expect(res.aisleID).toStrictEqual(newAisleID);
        expect(res.row).toStrictEqual(newRow);
        expect(res.col).toStrictEqual(newCol);
        expect(res.maxWeight).toStrictEqual(newMaxWeight);
        expect(res.maxVolume).toStrictEqual(newMaxVolume);
        expect(res.occupiedWeight).toStrictEqual(newOccupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(newOccupiedVolume);
    });
}

function TestModifyPositionID(newPositionID, positionID){
    test('Modify positionID of an existing Position given its positionID', async () => {

        try {
            await positionDao.modifyPositionID(newPositionID, positionID);
        } catch(err){
            console.log("---- error -----");
            return;
        }
                
        res = await positionDao.getPosById(newPositionID);
        expect(res.positionID).toStrictEqual(newPositionID);
        expect(res.aisleID).toStrictEqual(newPositionID.substring(0, 4));
        expect(res.row).toStrictEqual(newPositionID.substring(4, 8));
        expect(res.col).toStrictEqual(newPositionID.substring(8, 12));
    });
}

function TestReduceWVposition(positionID, newOccW, newOccV) {
    test('Reduce Weight and Volume of a Position', async () => {

        res = await positionDao.getPosById(positionID);
        if(res === undefined) {
            res = await positionDao.reduceWVposition(positionID, newOccW, newOccV);
            expect(res).toStrictEqual(0);
            return;
        }
        
        await positionDao.reduceWVposition(positionID, newOccW, newOccV);
        
        res = await positionDao.getPosById(positionID);
        expect(res.positionID).toStrictEqual(positionID);
        expect(res.occupiedWeight).toStrictEqual(350);
        expect(res.occupiedVolume).toStrictEqual(250);
    });
}

function TestUpdateWVposition(positionID, newOccW, newOccV) {
    test('Increase Weight and Volume of a Position', async () => {
        
        await positionDao.updateWVposition(positionID, newOccW, newOccV);
        
        res = await positionDao.getPosById(positionID);
        expect(res.positionID).toStrictEqual(positionID);
        expect(res.occupiedWeight).toStrictEqual(newOccW);
        expect(res.occupiedVolume).toStrictEqual(newOccV);
    });
}

function testDropAndCreateTable() {
    test('drop an create testResult table', async () => {

        try {
            await positionDao.dropPositionTable();
        } catch(err){
            console.log("---- error -----");
        }

        try {
            await positionDao.newPositionTable();
        } catch(err){
            console.log("---- error -----");
        }

    });
}

function TestClosePositionTable() {
    test('close Position Table', async () => {

        await positionDao.closePositionTable();
    });
}
