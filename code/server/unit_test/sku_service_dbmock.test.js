const SkuService = require('../services/sku_service');
const dao = require('../modules/mock_sku_dao')
const daoPos = require('../modules/mock_position_dao')
const sku_service = new SkuService(dao);

describe('get Sku', () => {

    beforeEach(() => {
        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockReturnValueOnce({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : "800234523412",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : "[1,3,4]"
        }).mockReturnValue({
            description : "second sku",
            weight : 80,
            volume : 30,
            notes : "second SKU",
            position : "800234523412",
            availableQuantity : 20,
            price : 13.99,
            testDescriptors : "[2]"
        });
    });

    test('get Sku', async () => {
        const id = 1;
        let res = await sku_service.getSkuById(id);
        expect(res).toEqual({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : "800234523412",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : "[1,3,4]"
        });
        res = await sku_service.getSkuById(id);
        expect(res).toEqual({
            description : "second sku",
            weight : 80,
            volume : 30,
            notes : "second SKU",
            position : "800234523412",
            availableQuantity : 20,
            price : 13.99,
            testDescriptors : "[2]"
        });
    });

});

describe('get all Skus', () => {
    beforeEach(() => {
        dao.getStoredSkus.mockReset();
        dao.getStoredSkus.mockReturnValueOnce(
            {
                description : "first sku",
                weight : 100,
                volume : 50,
                notes : "first SKU",
                position : "800234523412",
                availableQuantity : 50,
                price : 10.99,
                testDescriptors : "[1,3,4]"
            },
            {
                description : "second sku",
                weight : 80,
                volume : 30,
                notes : "second SKU",
                position : "800234523412",
                availableQuantity : 20,
                price : 13.99,
                testDescriptors : "[2]"
            }
        );
    });

    test('get all Skus', async () => {
        let res = await sku_service.getSkus();
        expect(res).toEqual({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : "800234523412",
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : "[1,3,4]"
        },
        {
            description : "second sku",
            weight : 80,
            volume : 30,
            notes : "second SKU",
            position : "800234523412",
            availableQuantity : 20,
            price : 13.99,
            testDescriptors : "[2]"
        });
    });

});


describe("set Sku", () => {
    beforeEach(() => {
        //dao.newSkusTable.mockReturnValueOnce(1);
        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockReturnValueOnce({
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            position : null,
            availableQuantity : 50,
            price : 10.99,
            testDescriptors : null
        })
    })
    test('set Sku', async () => {
        const sku = {
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            availableQuantity : 50,
            price : 10.99,
        }

        let res = await sku_service.createSku(sku);
        //first call, first parameter passed
        expect(dao.storeSku.mock.calls[0][0]).toBe(sku.description);
        //first call, second parameter passed
        expect(dao.storeSku.mock.calls[0][1]).toBe(sku.weight);
        //first call, third parameter passed
        expect(dao.storeSku.mock.calls[0][2]).toBe(sku.volume);
        //first call, fourth parameter passed
        expect(dao.storeSku.mock.calls[0][3]).toBe(sku.notes);
        //first call, fifth parameter passed
        expect(dao.storeSku.mock.calls[0][4]).toBe(sku.price);
        //first call, sixth parameter passed
        expect(dao.storeSku.mock.calls[0][5]).toBe(sku.availableQuantity);
    });

});

describe("modify Sku", () => {
    beforeEach(() => {
        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523412",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce(undefined).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523412",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523412",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        });

        dao.getPosById.mockReturnValueOnce({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 4000,
            maxVolume: 4000,
            occupiedWeight: 300,
            occupiedVolume: 150
        }).mockReturnValueOnce({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 2000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume: 150
        }).mockReturnValueOnce(undefined);
    });

    test('modify Sku', async () => {
        const modSku = {
            id: 1,
            newDescription : "first sku",
            newWeight : 100,
            newVolume : 50,
            newNotes : "first SKU",
            newAvailableQuantity : 10,
            newPrice : 10.99,
        }

        const modSku2 = {
            id: 1,
            newDescription : "first sku",
            newWeight : 100,
            newVolume : 50,
            newNotes : "first SKU",
            newAvailableQuantity : 40,
            newPrice : 10.99,
        }

        let res = await sku_service.modifySku(modSku, modSku.id);
        //first call, first parameter passed
        expect(dao.modifySku.mock.calls[0][0]).toBe(modSku.newDescription);
        //first call, second parameter passed
        expect(dao.modifySku.mock.calls[0][1]).toBe(modSku.newWeight);
        //first call, third parameter passed
        expect(dao.modifySku.mock.calls[0][2]).toBe(modSku.newVolume);
        //first call, fourth parameter passed
        expect(dao.modifySku.mock.calls[0][3]).toBe(modSku.newNotes);

        res = await sku_service.modifySku(modSku, modSku.id);
        expect(res).toBe(404);

        res = await sku_service.modifySku(modSku2, modSku2.id);
        expect(res).toBe(422);

        res = await sku_service.modifySku(modSku, modSku.id);
        expect(dao.modifySku.mock.calls[0][0]).toBe(modSku.newDescription);
        expect(dao.modifySku.mock.calls[0][1]).toBe(modSku.newWeight);
        expect(dao.modifySku.mock.calls[0][2]).toBe(modSku.newVolume);
        expect(dao.modifySku.mock.calls[0][3]).toBe(modSku.newNotes);
    });
});


describe("modify Sku Position", () => {
    beforeEach(() => {
        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523555",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce(undefined).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523555",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: null,
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce({
            description: "Sku 1",
            weight: 40,
            volume: 30,
            notes: "Note sku 1",
            position: null,
            availableQuantity: 30,
            price: 3.99,
            testDescriptors: "[1,2]"
        });

        dao.getPosOccupied.mockReturnValueOnce(undefined)
        .mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: null,
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 1200,
            maxVolume: 1800,
            occupiedWeight: 300,
            occupiedVolume: 150
        }).mockReturnValueOnce(undefined).mockReturnValueOnce({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 400,
            maxVolume: 400,
            occupiedWeight: 300,
            occupiedVolume: 150
        });

        dao.updateWVposition.mockReturnValueOnce("Position weight and volume successfully updated!");
        dao.reduceWVposition.mockReturnValueOnce("Position weight and volume successfully reduced!");
    });

    test('modify Sku Position', async () => {
        const positionID = "800234523433";
        const id = 2;

        let res = await sku_service.modifySkuPosition(positionID, id);
        //first call, first parameter passed
        expect(dao.modifySkuPosition.mock.calls[0][0]).toBe(positionID);
        //first call, second parameter passed
        expect(dao.modifySkuPosition.mock.calls[0][1]).toBe(id);

        res = await sku_service.modifySkuPosition(positionID, id);
        expect(res).toBe(404);

        res = await sku_service.modifySkuPosition(positionID, id);
        expect(res).toBe(422);

        res = await sku_service.modifySkuPosition(positionID, id);
        expect(res).toBe(404);

        res = await sku_service.modifySkuPosition(positionID, id);
        expect(res).toBe(422);
    });
});


describe("delete Sku", () => {
    
    beforeEach(() => {
        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523412",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce({
            description: "Sku 2",
            weight: 20,
            volume: 30,
            notes: "Note sku 2",
            position: "800234523412",
            availableQuantity: 15,
            price: 5.99,
            testDescriptors: "[3]"
        }).mockReturnValue(undefined);

        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValue({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 1200,
            maxVolume: 1800,
            occupiedWeight: 300,
            occupiedVolume: 150
        })

        dao.reduceWVposition.mockReturnValueOnce("Reduced OK");
    });

    test('delete Sku', async () => {

        let get1 = await sku_service.getSkuById(1);
        expect(get1).toEqual({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523412",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        });

        let res = await sku_service.deleteSku(1);
        //first call, first parameter passed
        expect(dao.deleteSku.mock.calls[0][0]).toBe(1);

        let get2 = await sku_service.getSkuById(1);
        expect(get2).toEqual(404);

        res = await sku_service.deleteSku(1);
        //first call, first parameter passed
        expect(res).toBe(204);
    });
});


describe("delete all Skus", () => {
    
    beforeEach(() => {
        dao.getStoredSkus.mockReset();
        dao.getStoredSkus.mockReturnValueOnce({});

        dao.dropSkuTable.mockReset();
        dao.dropSkuTable.mockReturnValue("OK");

        dao.newSkusTable.mockReset();
        dao.newSkusTable.mockReturnValueOnce("OK");
    });

    test('delete all Skus', async () => {


        let res = await sku_service.deleteAllSkus();

        let get = await sku_service.getSkus();
        expect(get).toEqual({});
    });
});


describe("test with closed connection to Sku Table", () => {
    
    beforeEach(() => {
        dao.closeSkusTable.mockReset();
        dao.closeSkusTable.mockReturnValueOnce(true);

        dao.dropSkuTable.mockReset();
        dao.dropSkuTable.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.storeSku.mockReset();
        dao.storeSku.mockImplementationOnce(() => {
            throw new Error();
        });

        dao.getStoredSkus.mockReset();
        dao.getStoredSkus.mockImplementationOnce(() => {
            throw new Error();
        });
        
        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockImplementationOnce(() => {
            throw new Error();
        }).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: null,
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: null,
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        });
        
        dao.modifySku.mockReset();
        dao.modifySku.mockImplementation(() => {
            throw new Error();
        });

        dao.deleteSku.mockReset();
        dao.deleteSku.mockImplementation(() => {
            throw new Error();
        });

    });

    test('test with closed connectio to Sku Table', async () => {
        const id = 1;
        const positionID = "908765431234";
        const sku = {
            description : "first sku",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            availableQuantity : 50,
            price : 10.99,
        }

        await sku_service.closeConncetionSku();

        // DEVO MOCKARE il raise error
        let res = await sku_service.createSku(sku);
        expect(res).toEqual("c503");

        res = await sku_service.getSkus();
        expect(res).toEqual(500);

        res = await sku_service.getSkuById(id);
        expect(res).toEqual(500);

        res = await sku_service.modifySku(sku, id);
        expect(res).toEqual(503);

        res = await sku_service.deleteSku(id);
        expect(res).toEqual(503);

        res = await sku_service.deleteAllSkus();
        expect(res).toEqual(500);
    });
});


describe("test modify Sku Position with closed connection to Sku Table", () => {
    beforeEach(() => {

        dao.closeSkusTable.mockReset();
        dao.closeSkusTable.mockReturnValueOnce(true);

        dao.getStoredSkuById.mockReset();
        dao.getStoredSkuById.mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: "800234523555",
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        }).mockReturnValueOnce({
            description: "Sku 1",
            weight: 20,
            volume: 30,
            notes: "Note sku 1",
            position: null,
            availableQuantity: 15,
            price: 3.99,
            testDescriptors: "[1,2]"
        });

        dao.getPosOccupied.mockReturnValue(undefined);

        dao.getPosById.mockReset();
        dao.getPosById.mockReturnValueOnce({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 1200,
            maxVolume: 1800,
            occupiedWeight: 300,
            occupiedVolume: 150
        }).mockReturnValueOnce({
            positionID: "800234523412",
            aisleID: "8002",
            row: "3452",
            col: "3412",
            maxWeight: 1200,
            maxVolume: 1800,
            occupiedWeight: 300,
            occupiedVolume: 150
        });

        dao.updateWVposition.mockReturnValue("Position weight and volume successfully updated!");
        dao.reduceWVposition.mockReturnValueOnce("Position weight and volume successfully reduced!");

        dao.modifySkuPosition.mockReset();
        dao.modifySkuPosition.mockImplementationOnce(() => {
            throw new Error();
        });
    });

    test('test modify Sku Position with closed connection to Sku Table', async () => {
        const positionID = "800234523433";
        const id = 2;

        await sku_service.closeConncetionSku();

        let res = await sku_service.modifySkuPosition(positionID, id);
        expect(res).toEqual(503);

        res = await sku_service.modifySkuPosition(positionID, id);
        expect(dao.modifySkuPosition.mock.calls[0][0]).toBe(positionID);
        expect(dao.modifySkuPosition.mock.calls[0][1]).toBe(id);

    });
});