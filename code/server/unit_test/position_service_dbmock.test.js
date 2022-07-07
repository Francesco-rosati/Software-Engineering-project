const PositionService = require('../services/position_service');
const dao = require('../modules/mock_position_dao')
const position_service = new PositionService(dao);

describe('get Positions', () => {

    beforeEach(() => {
        dao.getStoredPositions.mockReset();
        dao.getStoredPositions.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume:150
        }).mockReturnValue({
            positionID:"801234543422",
            aisleID: "8012",
            row: "3454",
            col: "3422",
            maxWeight: 1800,
            maxVolume: 1700,
            occupiedWeight: 200,
            occupiedVolume:250
        });
    });

    test('get Positions', async () => {
        let res = await position_service.getPositions();
        expect(res).toEqual({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume:150
        },
        {
            positionID:"801234543422",
            aisleID: "8012",
            row: "3454",
            col: "3422",
            maxWeight: 1800,
            maxVolume: 1700,
            occupiedWeight: 200,
            occupiedVolume:250
        });
    });

});

describe("set Position", () => {
    beforeEach(() => {
        //dao.newSkusTable.mockReturnValueOnce(1);
        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        })
    })
    test('set Position', async () => {
        const position = {
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        let res = await position_service.createPosition(position);
        //first call, first parameter passed
        expect(dao.storePosition.mock.calls[0][0]).toBe(position.positionID);
        //first call, second parameter passed
        expect(dao.storePosition.mock.calls[0][1]).toBe(position.aisleID);
        //first call, third parameter passed
        expect(dao.storePosition.mock.calls[0][2]).toBe(position.row);
        //first call, fourth parameter passed
        expect(dao.storePosition.mock.calls[0][3]).toBe(position.col);
        //first call, fifth parameter passed
        expect(dao.storePosition.mock.calls[0][4]).toBe(position.maxWeight);
        //first call, sixth parameter passed
        expect(dao.storePosition.mock.calls[0][5]).toBe(position.maxVolume);
    });

});


describe("modify Position", () => {
    beforeEach(() => {
        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        }).mockReturnValueOnce(undefined);

        dao.updateSkuPosition.mockReset();
        dao.updateSkuPosition.mockReturnValueOnce("Sku Position successfully updated!");
    });

    test('modify Position', async () => {
        const positionID = "801234543555";
        const modPosition = {
            newAisleID: "8002",
            newRow: "3454",
            newCol: "3412",
            newMaxWeight: 1200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume:100
        }

        let res = await position_service.modifyPosition(modPosition, positionID);
        //first call, first parameter passed
        expect(dao.modifyPos.mock.calls[0][0]).toBe(modPosition.newAisleID);
        //first call, second parameter passed
        expect(dao.modifyPos.mock.calls[0][1]).toBe(modPosition.newRow);
        //first call, third parameter passed
        expect(dao.modifyPos.mock.calls[0][2]).toBe(modPosition.newCol);
        //first call, fourth parameter passed
        expect(dao.modifyPos.mock.calls[0][3]).toBe(modPosition.newMaxWeight);

        res = await position_service.modifyPosition(modPosition, positionID);
        expect(res).toBe(404);
    });
});


describe("modify positionID of an existing Position", () => {
    beforeEach(() => {
        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        }).mockReturnValueOnce(undefined);

        dao.updateSkuPosition.mockReset();
        dao.updateSkuPosition.mockReturnValueOnce("Sku Position successfully updated!");
    });

    test('modify positionID of an existing Position', async () => {
        const positionID = "801234543555";
        const modPosition = {
            newPositionID: "801234543786",
        }

        let res = await position_service.modifyPosID(modPosition, positionID);
        //first call, first parameter passed
        expect(dao.modifyPositionID.mock.calls[0][0]).toBe(modPosition.newPositionID);
        //first call, second parameter passed
        expect(dao.modifyPositionID.mock.calls[0][1]).toBe(positionID);

        res = await position_service.modifyPosID(modPosition, positionID);
        expect(res).toBe(404);
    });
});


describe("delete Position", () => {
    
    beforeEach(() => {
        dao.getStoredPositions.mockReset();
        dao.getStoredPositions.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume:150
        }).mockReturnValue(undefined);

        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume:150
        }).mockReturnValueOnce(undefined);

        dao.deleteSkuPos.mockReset();
        dao.deleteSkuPos.mockReturnValue("Position successfully deleted!");
    });

    test('delete Position', async () => {

        let get1 = await position_service.getPositions();
        expect(get1).toEqual({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume:150
        });

        let res = await position_service.deletePosition("801234543412");
        //first call, first parameter passed
        expect(dao.deletePosition.mock.calls[0][0]).toBe("801234543412");

        let get2 = await position_service.getPositions("801234543412");
        expect(get2).toEqual(undefined);

        res = await position_service.deletePosition("801234543412");
        expect(res).toEqual(404);
    });
});

describe("delete all Positions", () => {
    
    beforeEach(() => {
        dao.getStoredPositions.mockReset();
        dao.getStoredPositions.mockReturnValueOnce({});

        dao.dropPositionTable.mockReset();
        dao.dropPositionTable.mockReturnValueOnce("OK");

        dao.newPositionTable.mockReset();
        dao.newPositionTable.mockReturnValueOnce("OK");
    });

    test('delete all Positions', async () => {


        let res = await position_service.deleteAllPositions();

        let get = await position_service.getPositions();
        expect(get).toEqual({});
    });
});

describe("test with closed connection to Position Table", () => {
    
    beforeEach(() => {
        dao.closePositionTable.mockReset();
        dao.closePositionTable.mockReturnValueOnce(true);

        dao.storePosition.mockReset();
        dao.storePosition.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredPositions.mockReset();
        dao.getStoredPositions.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        }).mockReturnValueOnce({
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        }).mockImplementation(() => {
            throw new Error();
        });
        
        dao.updateSkuPosition.mockReset();
        dao.updateSkuPosition.mockImplementation(() => {
            throw new Error();
        });

        dao.modifyPositionID.mockReset();
        dao.modifyPositionID.mockImplementation(() => {
            throw new Error();
        });
    });

    test('test with closed connectio to Position Table', async () => {
        const positionID = "801234543555";
        const position = {
            positionID:"801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000
        }

        await position_service.closeConncetionPosition();

        let res = await position_service.createPosition(position);
        expect(res).toEqual("c503");

        res = await position_service.getPositions();
        expect(res).toEqual(500);

        res = await position_service.modifyPosition(position, positionID);
        expect(res).toEqual(503);

        res = await position_service.modifyPosID(position, positionID);
        expect(res).toEqual(503);

        res = await position_service.deletePosition(positionID);
        expect(res).toEqual(503);
    });
});