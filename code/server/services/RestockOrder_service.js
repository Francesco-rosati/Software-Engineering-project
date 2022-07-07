const dayjs = require('../node_modules/dayjs');
class RestockOrderService {

    dao;
    skuTable;

    constructor(dao, skuTable) {
        this.dao = dao;
        this.skuTable = skuTable;
    }


    getRestockOrder = async () => {
        try {
            const RestockOrder = await this.dao.getAllRestockOrder();
            return RestockOrder;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getRestockOrderIssued = async () => {
        try {

            const RestockOrder = await this.dao.getRestockOrderIssued();
            return RestockOrder;
        }
        catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }
 
    getRestockOrderById = async (id) => {
        try {
        
            const RestockOrder= await this.dao.getRestockOrderById(id);

            if (RestockOrder === undefined) {
                console.log(`No Restock Order associated to id: ${id}`);
                return 404;
            }
            return RestockOrder;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }
    
    getRestockOrderReturnItemsById = async (id) => {
        try {
        
            const RestockOrder= await this.dao.getRestockOrderReturnItemsById(id);

            if (RestockOrder === undefined) {
                console.log(`No Restock Order associated to id: ${id}`);
                return 404;
            }
            return RestockOrder;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    setRestockOrder = async (issueDate, products, supplierId) => {
        
        
        try{
            
                let newRestockOrder = await this.dao.storeRestockOrder(issueDate, products, supplierId);
                
                console.log("Restock Order successfully created!");
                return(newRestockOrder); 

        }  catch (err) {
            console.log("Generic error!");
            return 503;
        }
    }

    modifyRestockOrderState = async (newState, id) => {
        
        try {
             
            const restockorder = await this.dao.getRestockOrderById(id);
            
            if (restockorder === undefined) {
                console.log(`Restock Order not found for id: ${id}`); 
                return(404);
            }
    
                if (newState !== "ISSUED" && newState !== "DELIVERY" && newState !== "DELIVERED" && newState !== "TESTED" && newState !== "COMPLETEDRETURN" && newState !== "COMPLETED") {
                    console.log("Wrong newState type!");
                    return 422;
                }
                
                const result = await this.dao.modifyRestockOrderState(newState, id);
                console.log("Restock Order successfully updated with newState!");
                    return result;
            

        }catch (err) {
            console.log("Generic error!");
            return 503;
        }
        
    }





    modifyRestockOrderSKUItemsById = async (skuItems, id) => {
        let retval;
        try {
            const restockorder = await this.dao.getRestockOrderById(id);
           
            if (restockorder === undefined) {
                retval= 404;
                console.log("Restock Order id not found!"); 
                return(retval);
            }

        
                const oldSkuItems = restockorder.skuItems;      
                const result = await this.dao.modifyRestockOrderSKUItemsById(oldSkuItems, skuItems, id);
                console.log("Restock Order successfully updated with skuItems!");
                    return result;
                

        }catch (err) {
            console.log("Generic error!");
            return 503;
        }
        
    }

    modifyRestockOrderTransportNote = async (newtransportNote, id) => {
        try {
      
            const restockorder = await this.dao.getRestockOrderById(id);
            
            if (restockorder === undefined) {
                console.log("Restock Order id not found!"); 
                return(404);
            }

            if(restockorder.state!=="DELIVERY" || dayjs(newtransportNote.deliveryDate).isBefore(dayjs(restockorder.issueDate)) ){
                console.log("order state != DELIVERY or deliveryDate is before issueDate"); 
                return(422);
            }
            
            const result = await this.dao.modifyRestockOrderTransportNote( newtransportNote, id);
            console.log("Restock Order successfully updated with transportNote!");
            return result;
                

        }catch (err) {
            console.log("Generic error!");
            return 503;
        }
        
    }





    deleteRestockOrder = async (id) => {
        try {
        const RestockOrder = await this.dao.getRestockOrderById(id);

            if (RestockOrder === undefined) {
                console.log(`Restock Order not found for id: ${id}!`);
                return 404;
            }

        
            const result = await this.dao.deleteRestockOrder(id);
            console.log("Restock Order successfully deleted!");
            return result;
        }catch(err){
            console.log("Generic error!");
            return 503;
        }
    }

    deleteAllRestockOrder= async () => {
        try {

            await this.dao.dropRestockOrderTable();
            await this.dao.newRestockOrderTable();
            console.log("Restock Order Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 500;
        }

    }
    

    closeConnectionRestockOrder = async () => {
        await this.dao.closeRestockOrderTable();
        return true;
    }


}

module.exports = RestockOrderService;