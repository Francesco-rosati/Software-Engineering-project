class ReturnOrderService {

    dao;
    skuTable;
    restockorderTable;

    constructor(dao, skuTable, restockorderTable ) {
        this.dao = dao;
        this.restockorderTable = restockorderTable;
        this.skuTable = skuTable;
    }
  

    getReturnOrder = async () => {
        try {
            const ReturnOrder = await this.dao.getAllReturnOrder();
            return ReturnOrder;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

    
    getReturnOrderById = async (id) => {
        try {
        
            const ReturnOrder= await this.dao.getReturnOrderById(id);

            if (ReturnOrder === undefined) {
                console.log(`No Return Order associated to id: ${id}`);
                return 404;
            }
            return ReturnOrder;
        } catch (err) {
            console.log("Generic error!");
            return 500;
        }
    }

        
    setReturnOrder = async (returnDate, products, restockOrderId) => {
        try{
          
            const restockorder = await this.restockorderTable.getRestockOrderById(restockOrderId);
            if (restockorder === undefined) {
      
                console.log(`No Restock Order associated to given restockOrderId:${restockOrderId}`); 
                return(404);
            }

            let newReturnOrder = await this.dao.storeReturnOrder(returnDate, products, restockOrderId);
            console.log("Return Order successfully created!");
            return(newReturnOrder); 

         }  catch (err) {
            console.log("Generic error!");
             return 503;
         }
    }
  



    deleteReturnOrder = async (id) => {
        try {
        const ReturnOrder = await this.dao.getReturnOrderById(id);

            if (ReturnOrder === undefined) {
                console.log("Return Order not found!");
                return 404;
            }

        
            const result = await this.dao.deleteReturnOrder(id);
            console.log("Return Order successfully deleted!");
            return result;
        }catch(err){
            console.log("Generic error!");
            return 503;
        }
    }

    
    deleteAllReturnOrder= async () => {
        try {

            this.dao.dropReturnOrderTable();
            this.dao.newReturnOrderTable();
            console.log("Return Order Table is now empty!");
            return 200;

        } catch (err) {
            console.log("Generic error!");
            return 500;
        }

    }
    

    closeConnectionReturnOrder = async () => {
        await this.dao.closeReturnOrderTable();
        return true;
    }




}

module.exports = ReturnOrderService;