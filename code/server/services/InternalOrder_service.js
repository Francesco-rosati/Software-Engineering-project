class InternalOrderService {

    dao;
    skuTable;

    constructor(dao, skuTable) {
        this.dao = dao;
        this.skuTable = skuTable;
    }

    getInternalOrders = async () => {
        try {
            const InternalOrders = await this.dao.getAllInternalOrders();
            return InternalOrders;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    getInternalOrdersIssued = async () => {
        try {

            const InternalOrders = await this.dao.getInternalOrdersIssued();
            return InternalOrders;
        }
        catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    
    getInternalOrdersAccepted = async () => {
        try {

            const InternalOrders = await this.dao.getInternalOrdersAccepted();
            return InternalOrders;
        }
        catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }


    getInternalOrdersById = async (id) => {
        try {
        
            const InternalOrder= await this.dao.getInternalOrdersById(id);

            if (InternalOrder === undefined) {
                console.log(`No Internal Order associated to id: ${id}`);
                return 404;
            }
            return InternalOrder;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    setInternalOrder = async (issueDate, products, customerId) => {
        let retval;
       try{
           
                let newInternalOrder = await this.dao.storeInternalOrder(issueDate, products, customerId);
                console.log("Internal Order successfully created!");
                return(newInternalOrder); 

        }  catch (err) {
            console.log("Generic error!");
            return 503;
        }
    }

 
    modifyInternalOrder = async (newState, products, id) => {
        
        try {
           
            if (newState !== "ISSUED" && newState !== "ACCEPTED" && newState !== "REFUSED" && newState !== "CANCELED" && newState !== "COMPLETED") {
                console.log("Wrong newState type!");
                return 422;
            }
            
            if (products === undefined && newState==="COMPLETED"){
                    console.log("Wrong products formatting: if newState is COMPLETED, specify products!");
                    return 422;
                
            }
            
            const internalorder = await this.dao.getInternalOrdersById(id);
            
            if (internalorder === undefined) {
                console.log("Internal Order id not found!"); 
                return(404);
            }

               
            const result = await this.dao.modifyInternalOrder(newState, products, id);
            console.log("Internal Order successfully updated!");
                return result;

            
        }  catch (err) {
            console.log("Generic error!");
            return 503;
        }
        
    }







    deleteInternalOrder = async (id) => {
        try {
        const InternalOrder = await this.dao.getInternalOrdersById(id);

            if (InternalOrder === undefined) {
                console.log("Internal Order not found!");
                return 404;
            }

        
            const result = await this.dao.deleteInternalOrder(id);
            console.log("Internal Order successfully deleted!");
            return result;
        }catch(err){
            console.log("Generic error!");
            return 503;
        }
    }

    deleteAllInternalOrder= async () => {
        try {

            await this.dao.dropInternalOrderTable();
            await this.dao.newInternalOrderTable();
            console.log("Internal ORder Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 500;
        }

    }


    closeConnectionInternalOrder = async () => {
        await this.dao.closeInternalOrderTable();
        return true;
    }

}

module.exports = InternalOrderService;