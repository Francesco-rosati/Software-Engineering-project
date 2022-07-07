# Unit Testing Report

Authors: Alessandro Tola, Emanuele Raimondo, Francesco Rosati, Fulvio Castello

Date: 25/05/22

Version: 1.3

| Version number | Change |
| ----------------- |:-----------|
| 1.0 | Added Black Box Report |
| 1.1 | Added White Box Report |
| 1.2 | Added code coverage report |
| 1.3 | Spell checking and formatting |

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)

- [White Box Unit Tests](#white-box-unit-tests)

- [Code coverage report](#code-coverage-report)

# Black Box Unit Tests

Since the called functions are very similar (several get/set/modify/delete functions are included in each class), the criteria, predicates and the combination of them are always valid and repeatable. Here, we consequently provide a detailed Black Box Report for the *Items DAO* and *ItemService* classes only, as to set an example for all the other classes as well.

> **Test cases for all "dao" classes that directly interface with the DB below**

### **Class *ItemsDAO* - method *storeItem***

**Criteria for method *storeItem*:**
	
 - C1: existance of table *ITEMS* in the query 
 - C2: presence of attributes `id`, `description`, `price`, `SKUId`, `supplierId`
 - C3: successful connection to the DB.

**Predicates for method *storeItem*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Attributes are defined|
|C2|Attributes are undefined|
|C3|Connection to DB succeeded|
|C3|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|D |D |S | V |The **storeSku** method is correct| **testNewItem** |
|D |ND|S | I |The attributes of the query are undefined| |
|ND|D |S | I |The table of the query is undefined| |
|D |D |F | I |Connection to DB failed| |

### **Class *ItemsDAO* - method *getStoredItems***

**Criteria for method *getStoredItems*:**
	
 - C1: existance of table *ITEMS* in the query
 - C2: successful connection to the DB.

**Predicates for method *getStoredItems*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Connection to DB succeeded|
|C2|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|D |S | V |The **getStoredItems** method is correct| **testGetItems** |
|ND|S | I |The table of the query is undefined| |
|D |F | I |Connection to DB failed| |

### **Class *ItemsDAO* - method *getStoredItemById***

**Criteria for method *getStoredItemById*:**
	
 - C1: existance of table *ITEMS* in the query
 - C2: presence of attributes `id`, `supid`
 - C3: existence of `where` attribute
 - C4: successful connection to the DB.

**Predicates for method *getStoredItemById*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Attribute is defined|
|C2|Attribute is undefined|
|C3|`where` attribute is defined|
|C3|`where` attribute is undefined|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 3 | Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|D |D |D |S | V |The **getStoredItemById** method is correct| **testGetItemById** |
|ND|D |D |S | I |The table of the query is undefined| |
|D |ND|D |S | I |The attribute of the query is undefined| |
|D |D |ND|S | I |The `where` attribute of the query is undefined| |
|D |D |D |F | I |Connection to DB failed| |

### **Class *ItemsDAO* - method *getStoredItemByIdAndSupplierId***

**Criteria for method *getStoredItemByIdAndSupplierId*:**
	
 - C1: existance of table *ITEMS* in the query
 - C2: Presence of attributes `id`, `supplierId` 
 - C3: existence of `where` attributes
 - C4: successful connection to the DB.

**Predicates for method *getStoredItemByIdAndSupplierId*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Attributes are defined|
|C2|Attributes are undefined|
|C3|`where` attributes are defined|
|C3|`where` attributes are undefined|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 3 | Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|D |D |D |S | V |The **getStoredItemByIdAndSupplierId** method is correct| **testGetItemByIdAndSupplierId** |
|ND|D |D |S | I |The table of the query is undefined| |
|D |ND|D |S | I |The attribute of the query is undefined| |
|D |D |ND|S | I |The `where` attribute of the query is undefined| |
|D |D |D |F | I |Connection to DB failed| |

### **Class *ItemsDAO* - method *getStoredItemBySKUIdAndSupplierId***

**Criteria for method *getStoredItemBySKUIdAndSupplierId*:**
	
 - C1: existance of table *ITEMS* in the query
 - C2: Presence of attributes `SKUid`, `supplierId` 
 - C3: existence of `where` attributes
 - C4: successful connection to the DB.

**Predicates for method *getStoredItemBySKUIdAndSupplierId*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Attributes are defined|
|C2|Attributes are undefined|
|C3|`where` attributes are defined|
|C3|`where` attributes are undefined|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 3 | Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|D |D |D |S | V |The **getStoredItemBySKUIdAndSupplierId** method is correct| **testGetItemBySKUIdAndSupplierId** |
|ND|D |D |S | I |The table of the query is undefined| |
|D |ND|D |S | I |The attributes of the query are undefined| |
|D |D |ND|S | I |The `where` attributes of the query are undefined| |
|D |D |D |F | I |Connection to DB failed| |

### **Class *ItemsDAO* - method *modifyItem***

**Criteria for method *modifyItem*:**

- C1: existance of table *ITEMS* in the query
- C2: Presence of attributes `description`, `price`, `id` , `supid`
- C3: existence of `where` attribute
- C4: successful connection to the DB.

**Predicates for method *modifyItem*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Attributes are defined|
|C2|Attributes are undefined|
|C3|`where` attribute is defined|
|C3|`where` attribute is undefined|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 3 | Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|D |D |D |S | V |The **modifyItem** method is correct| **testModifyItem** |
|ND|D |D |S | I |The table of the query is undefined| |
|D |ND|D |S | I |The attributes of the query are undefined| |
|D |D |ND|S | I |The `where` attribute of the query is undefined| |
|D |D |D |F | I |Connection to DB failed| |

### **Class *ItemsDAO* - method *deleteItem***

**Criteria for method *deleteItem*:**

- C1: existance of table *ITEMS* in the query
- C2: Presence of attributes `id` , `supid`
- C3: existence of `where` attribute
- C4: successful connection to the DB.

**Predicates for method *deleteItem*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Table is defined|
|C1|Table is undefined|
|C2|Attribute is defined|
|C2|Attribute is undefined|
|C3|`where` attribute is defined|
|C3|`where` attribute is undefined|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- D: defined
- ND: undefined
- S: succeeded
- F: failed

| Criteria 1 | Criteria 3 | Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|D |D |D |S | V |The **deleteItem** method is correct| **testDeleteItem** |
|ND|D |D |S | I |The table of the query is undefined| |
|D |ND|D |S | I |The attribute of the query is undefined| |
|D |D |ND|S | I |The `where` attribute of the query is undefined| |
|D |D |D |F | I |Connection to DB failed| |

> **Test cases for all "service" classes that use a mocked DB below**

### **Class *ItemService* - method *getItems***

**Criteria for method *getItems*:**

- C1: returned items are equal to the previously inserted ones
- C2: successful connection to the DB.

**Predicates for method *getItems*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Returned items are equal to the previously inserted ones|
|C1|Returned items are not equal to the previously inserted ones|
|C2|Connection to DB succeeded|
|C2|Connection to DB failed|

**Combination of predicates**:
- T: true
- F: false
- C: connected to DB
- NC: not connected to DB

| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|T |C | V |The **getItems** method is correct| **test('get all Items')** inside 'item_service_dbmock.test.js'|
|F |C | I |Returned items are equal to the previously inserted ones| |
|T |NC| I |Connection to DB failed| |

### **Class *ItemService* - method *getItemsById***

**Criteria for method *getItemsById*:**

- C1: the item associated to the attribute `id` exists in the DB
- C2: returned item is equal to the previously inserted one (with the requested id)
- C3: successful connection to the DB.

**Predicates for method *getItemsById*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|The item associated to the attribute `id` exists in the DB|
|C1|The item associated to the attribute `id` does not exist in the DB|
|C2|Returned item is equal to the previously inserted one (with the requested id)|
|C2|Returned item is not equal to the previously inserted one (with the requested id)|
|C3|Connection to DB succeeded|
|C3|Connection to DB failed|

**Combination of predicates**:
- T: true
- F: false
- C: connected to DB
- NC: not connected to DB

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|T |T |C | V |The **getItemsById** method is correct| **test('get Item by id')** inside 'item_service_dbmock.test.js'|
|F |T |C | I |The item associated to the attribute `id` does not exist in the DB| |
|T |F |C | I |Returned item is not equal to the previously inserted one (with the requested id)| |
|T |T |NC| I |Connection to DB failed| |

### **Class *ItemService* - method *setItem***

**Criteria for method *setItem*:**

- C1: presence of attributes `id`, `description`, `price`, `SKUId`, `supplierId`
- C2: the sku associated to the attribute `SKUId` exists in the DB
- C3: the supplier `supplierId` doesn't sell an Item with the same `id` yet
- C4: the supplier `supplierId` doesn't sell an Item with the same `SKUId` yet
- C5: the user associated to `supplierId` is in fact a supplier
- C6: successful connection to the DB.

**Predicates for method *setItem*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Attributes are defined|
|C1|Attributes are undefined|
|C2|The SKU with `SKUId` exists in the DB|
|C2|The SKU with `SKUId` does not exist in the DB|
|C3|The supplier `supplierId` doesn't sell an Item with the same `id` yet|
|C3|The supplier `supplierId` already sells an Item with the same `id`|
|C4|The supplier `supplierId` doesn't sell an Item with the same `SKUId` yet|
|C4|The supplier `supplierId` already sells an Item with the same `SKUId`|
|C5|The user associated to `supplierId` is is in fact a supplier|
|C5|The user associated to `supplierId` is not a supplier|
|C6|Connection to DB succeeded|
|C6|Connection to DB failed|

**Combination of predicates**:
- T: true
- F: false
- C: connected to DB
- NC: not connected to DB

| Criteria 1 | Criteria 2 |  Criteria 3 |  Criteria 4 |  Criteria 5 | Criteria 6 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
|T |T |T |T |T |C | V |The **setItem** method is correct| **test('set Item')** inside 'item_service_dbmock.test.js'|
|F |T |T |T |T |C | I |The attributes of the method are undefined| |
|T |F |T |T |T |C | I |The SKU with `SKUId` does not exist in the DB| |
|T |T |F |T |T |C | I |The supplier `supplierId` already sells an Item with the same `id`| |
|T |T |T |F |T |C | I |The supplier `supplierId` already sells an Item with the same `SKUId`| |
|T |T |T |T |F |C | I |The user associated to `supplierId` is not a supplier| |
|T |T |T |T |T |NC| I |Connection to DB failed| |

### **Class *ItemService* - method *modifyItem***

**Criteria for method *modifyItem*:**

- C1: presence of attributes `id`, `newDescription`, `newPrice`
- C2: the Item associated to `id` exists
- C3: after the method is done, the attributes of the Item associated to `id` are equal to `newDescription`, `newPrice`
- C4: successful connection to the DB.

**Predicates for method *modifyItem*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Attributes are defined|
|C1|Attributes are undefined|
|C2|The Item associated to `id` exists|
|C2|The Item associated to `id` does not exist|
|C3|The new attributes of the Item `supplierId` are equal to `newDescription`, `newPrice`|
|C3|The new attributes of the Item `supplierId` are not equal to `newDescription`, `newPrice`|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- T: true
- F: false
- C: connected to DB
- NC: not connected to DB

| Criteria 1 | Criteria 2 |  Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|T |T |T |C | V |The **modifyItem** method is correct| **test('modify Item')** inside 'item_service_dbmock.test.js'|
|F |T |T |C | I |The attributes of the method are undefined| |
|T |F |T |C | I |The Item associated to `id` does not exist| |
|T |T |F |C | I |The new attributes of the Item `supplierId` are not equal to `newDescription`, `newPrice`| |
|T |T |T |NC| I |Connection to DB failed| |

### **Class *ItemService* - method *deleteItem***

**Criteria for method *deleteItem*:**

- C1: presence of attribute `id`
- C2: the Item associated to `id` exists
- C3: after the method is done, the attributes of the Item associated to `id` are equal to `newDescription`, `newPrice`
- C4: successful connection to the DB.

**Predicates for method *deleteItem*:**

| Criteria | Predicate |
| -------- | --------- |
|C1|Attribute is defined|
|C1|Attribute is undefined|
|C2|The Item associated to `id` exists|
|C2|The Item associated to `id` does not exist|
|C3|The deleted Item is not stored in the DB anymore|
|C3|The deleted Item is still stored in the DB|
|C4|Connection to DB succeeded|
|C4|Connection to DB failed|

**Combination of predicates**:
- T: true
- F: false
- C: connected to DB
- NC: not connected to DB

| Criteria 1 | Criteria 2 |  Criteria 3 | Criteria 4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
|T |T |T |C | V |The **deleteItem** method is correct| **test('delete Item')** in 'item_service_dbmock.test.js'|
|F |T |T |C | I |The attribute of the method is undefined| |
|T |F |T |C | I |The Item associated to `id` does not exist| |
|T |T |F |C | I |The deleted Item is still stored in the DB| |
|T |T |T |NC| I |Connection to DB failed| |

# White Box Unit Tests

> **Test cases for all "dao" classes that directly interface with the DB below**

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| Sku | storeSku | testSku.test.js | testNewSku | 
| Sku | getStoredSkus | testSku.test.js | TestGetStoredSkus | 
| Sku | deleteSku | testSku.test.js | testDeleteSku | 
| Sku | modifySku | testSku.test.js | testModifySku | 
| Sku | modifySkuPosition | testSku.test.js | TestModifySkuPosition | 
| Sku | getPosOccupied | testSku.test.js | testGetPosOccupied | 
| Sku | updateSkuPosition | testSku.test.js | TestUpdateSkuPosition | 
| Sku | deleteSkuPos | testSku.test.js | TestDeleteSkuPos | 
| Sku | setTestDescriptorSku | testSku.test.js | TestSetTestDescriptorSku | 
| Sku | deleteTestDescriptorSku | testSku.test.js | TestDeleteTestDescriptorSku | 
| Sku | modifyTestDescSku | testSku.test.js | TestModifyTestDescSku | 

| Class Tested| Method Tested| Unit name | Jest test case |
|-------|-------|-------|-------|
| SkuItem | getStoredSKUItems | skuitem.test.js | testGetSKUItems | 
| SkuItem | getStoredSKUItemByRfid | skuitem.test.js | testGetSKUItemByRfid | 
| SkuItem | getAvailableSKUItems | skuitem.test.js| testGetAvailableSKUItems | 
| SkuItem | storeSKUItem | skuitem.test.js | testNewSKUItem | 
| SkuItem | modifySKUItem | skuitem.test.js | testModifySKUItem | 
| SkuItem | deleteSKUItem | skuitem.test.js | testDeleteSKUItem | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| Item | getStoredItems | item.test.js | testGetItems | 
| Item | getStoredItemById | item.test.js | testGetItemById | 
| Item | getStoredItemByIdAndSupplierId | item.test.js | testGetItemByIdAndSupplierId | 
| Item | getStoredItemBySKUIdAndSupplierId | item.test.js | testGetItemBySKUIdAndSupplierId | 
| Item | storeItem | item.test.js | testNewItem | 
| Item | modifyItem | item.test.js | testModifyItem | 
| Item | deleteItem | item.test.js | testDeleteItem | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| Position | getStoredSKUItems | testPosition.test.js | testNewPosition | 
| Position | getStoredSKUItems | testPosition.test.js | TestGetStoredPositions | 
| Position | getStoredSKUItems | testPosition.test.js | TestGetPosById | 
| Position | getStoredSKUItems | testPosition.test.js | testDeletePosition | 
| Position | getStoredSKUItems | testPosition.test.js | testModifyPosition | 
| Position | getStoredSKUItems | testPosition.test.js | TestModifyPositionID | 
| Position | getStoredSKUItems | testPosition.test.js | TestReduceWVposition | 
| Position | getStoredSKUItems | testPosition.test.js | TestUpdateWVposition | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| TestResult | storeTestResult | TestResult.test.js | testNewTestResult | 
| TestResult | getStoredTestResults | TestResult.test.js | TestGetStoredTestResults | 
| TestResult | getStoredTestResultById | TestResult.test.js | TestetStoredTestResultById | 
| TestResult | getStoredTestResultByIdAndRfid | TestResult.test.js | TestGetStoredTestResultByIdAndRfid | 
| TestResult | deleteTestResult | TestResult.test.js | testDeleteTestResult | 
| TestResult | modifyTestResult | TestResult.test.js | testModifyTestResult | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| User | storeUser | user.test.js | testNewUser | 
| User | getStoredUsers | user.test.js | testGetUsers | 
| User | getStoredSuppliers | user.test.js | testGetSuppliers | 
| User | getUserByIdAndType | user.test.js | testGetUserByIdAndType | 
| User | getUserByUsernameAndType | user.test.js | testGetUserByUsernameAndType | 
| User | modifyUser | user.test.js | testModifyUser | 
| User | deleteUser | user.test.js | testDeleteUser | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| TestDescriptor | getStoredTestDescriptorById | testDescriptor.test.js | TestGetStoredTestDescriptorById | 
| TestDescriptor | getStoredTestDescriptors | testDescriptor.test.js | TestGetStoredTestDescriptors | 
| TestDescriptor | storeTestDescriptor | testDescriptor.test.js | testNewTestDescriptor | 
| TestDescriptor | deleteTestDescriptor | testDescriptor.test.js | testDeleteTestDescriptor | 
| TestDescriptor | modifyTestDescriptor | testDescriptor.test.js | testModifyTestDescriptor | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| RestockOrder | storeRestockOrder | testRestockOrder.test.js | testNewRestockOrder | 
| RestockOrder | getAllRestockOrder | testRestockOrder.test.js | testgetAllRestockOrder | 
| RestockOrder | getRestockOrderIssued | testRestockOrder.test.js | testgetRestockOrderIssued | 
| RestockOrder | getRestockOrderById | testRestockOrder.test.js | testgetRestockOrderById | 
| RestockOrder | modifyRestockOrderSKUItemsById | testRestockOrder.test.js | testgetRestockOrderReturnItemsById | 
| RestockOrder | deleteRestockOrder | testRestockOrder.test.js | testDeleteRestockOrder | 
| RestockOrder | modifyRestockOrderState | testRestockOrder.test.js | testModifyRestockOrderState | 
| RestockOrder | modifyRestockOrderTransportNote | testRestockOrder.test.js | testModifyRestockOrderTransportNote | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| InternalOrder | storeInternalOrder | testInternalOrder.test.js | testNewInternalOrder | 
| InternalOrder | getAllInternalOrders | testInternalOrder.test.js | testgetAllInternalOrders | 
| InternalOrder | getInternalOrdersIssued | testInternalOrder.test.js | testgetInternalOrdersIssued | 
| InternalOrder | getInternalOrdersAccepted | testInternalOrder.test.js | testgetInternalOrdersAccepted | 
| InternalOrder | getInternalOrdersById | testInternalOrder.test.js | testgetInternalOrdersById | 
| InternalOrder | deleteInternalOrder | testInternalOrder.test.js | testDeleteInternalOrder | 
| InternalOrder | modifyInternalOrder | testInternalOrder.test.js | testModifyInternalOrder | 

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| ReturnOrder | getAllReturnOrder | testReturnOrder.test.js | testgetAllReturnOrder | 
| ReturnOrder | getReturnOrderById | testReturnOrder.test.js | testgetReturnOrderById | 
| ReturnOrder | storeReturnOrder | testReturnOrder.test.js | testNewReturnOrder | 
| ReturnOrder | deleteReturnOrder | testReturnOrder.test.js | testDeleteReturnOrder | 

> **Test cases for all "service" classes that use a mocked DB below**

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| SkuService | getSkus | sku_service_dbmock.test.js | 'get Sku' |
| SkuService | getSkuById | sku_service_dbmock.test.js | 'get all Skus' |
| SkuService | createSku | sku_service_dbmock.test.js | 'set Sku' |
| SkuService | modifySku | sku_service_dbmock.test.js | 'modify Sku' |
| SkuService | modifySkuPosition | sku_service_dbmock.test.js | 'modify Sku Position' |
| SkuService | deleteSku | sku_service_dbmock.test.js | 'delete Sku' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| SkuItemService | getSKUItems | skuitem_service_dbmock.test.js | 'get all skuitems' |
| SkuItemService | getAvSKUItems | skuitem_service_dbmock.test.js | 'get available skuitems by skuid' |
| SkuItemService | getSKUItemRFID | skuitem_service_dbmock.test.js | 'get skuitem by rfid' |
| SkuItemService | setSKUItem | skuitem_service_dbmock.test.js | 'set skuitem' |
| SkuItemService | modSKUItem | skuitem_service_dbmock.test.js | 'modify skuitem' |
| SkuItemService | delSKUItem | skuitem_service_dbmock.test.js | 'delete skuitem' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| ItemService | getItems | item_service_dbmock.test.js | 'get all Items' |
| ItemService | getItemsById | item_service_dbmock.test.js | 'get Item by id' |
| ItemService | setItem | item_service_dbmock.test.js | 'set Item' |
| ItemService | modifyItem | item_service_dbmock.test.js | 'modify Item' |
| ItemService | deleteItem | item_service_dbmock.test.js | 'delete Item' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| PositionService | getPositions | position_service_dbmock.test.js | 'get Positions' |
| PositionService | createPosition | position_service_dbmock.test.js | 'set Position' |
| PositionService | modifyPosition | position_service_dbmock.test.js | 'modify Position' |
| PositionService | modifyPosID | position_service_dbmock.test.js | 'modify positionID of an existing Position' |
| PositionService | deletePosition | position_service_dbmock.test.js | 'delete Position' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| TestDescriptorService | getTestDescriptors | testDescriptor_service_dbmock.test.js  | 'get all Test Descriptors'  |
| TestDescriptorService | getTestDescriptorById | testDescriptor_service_dbmock.test.js  | 'get Test Descriptor' |
| TestDescriptorService | setTestDescriptor | testDescriptor_service_dbmock.test.js  | 'set TestDescriptor' |
| TestDescriptorService | modifyTestDescriptor | testDescriptor_service_dbmock.test.js  | 'modify TestDescriptor' |
| TestDescriptorService | deleteTestDescriptor | testDescriptor_service_dbmock.test.js  | 'delete TestDescriptor' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| TestResultService | getTestResults | testResult_service_dbmock.test.js | 'get Test Result' |
| TestResultService | getTestResultsById | testResult_service_dbmock.test.js | 'get all test results for a certain sku item identified by RFID' |
| TestResultService | setTestResult | testResult_service_dbmock.test.js | 'set Test Result' |
| TestResultService | modifyTestResult | testResult_service_dbmock.test.js | 'modify Test Result' |
| TestResultService | deleteTestResult | testResult_service_dbmock.test.js | 'delete Test Result' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| UserService | checkUser | ueser_service_dbmock.test.js | 'check User' |
| UserService | getSuppliers | ueser_service_dbmock.test.js | 'get all suppliers' |
| UserService | getUsers | ueser_service_dbmock.test.js | 'get all users' |
| UserService | setUser | ueser_service_dbmock.test.js | 'set user' |
| UserService | modifyUser | ueser_service_dbmock.test.js | 'modify user' |
| UserService | deleteUser | ueser_service_dbmock.test.js | 'delete user' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| RestockOrderService | getRestockOrder | RestockOrder_service_dbmock.test.js | 'get Restock Order' |
| RestockOrderService | getRestockOrderIssued | RestockOrder_service_dbmock.test.js | 'get Issued Restock Order' |
| RestockOrderService | getRestockOrderById | RestockOrder_service_dbmock.test.js | 'get Restock Order by Id' |
| RestockOrderService | getRestockOrderReturnItemsById | RestockOrder_service_dbmock.test.js | 'get Restock Order Return Items By Id' |
| RestockOrderService | setRestockOrder | RestockOrder_service_dbmock.test.js | 'set Restock Order' |
| RestockOrderService | modifyRestockOrderState | RestockOrder_service_dbmock.test.js | 'modify Restock Order State' |
| RestockOrderService | modifyRestockOrderSKUItemsById | RestockOrder_service_dbmock.test.js | 'modify Restock Order SkuItems' |
| RestockOrderService | modifyRestockOrderTransportNote | RestockOrder_service_dbmock.test.js | 'modify Restock Order TrasportNote' |
| RestockOrderService | deleteRestockOrder | RestockOrder_service_dbmock.test.js | 'delete Restock Order' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| ReturnOrderService | getReturnOrder | ReturnOrder_service_dbmock.test.js | 'get all Return Order' |
| ReturnOrderService | getReturnOrderById | ReturnOrder_service_dbmock.test.js | 'get Return Order ' |
| ReturnOrderService | setReturnOrder | ReturnOrder_service_dbmock.test.js | 'set Return Order' |
| ReturnOrderService | deleteReturnOrder | ReturnOrder_service_dbmock.test.js | 'delete Return Order' |

| Class Tested | Method Tested | Unit name | Jest test case |
|-------|-------|-------|-------|
| InternalOrderService | getInternalOrders | InternalOrder_service_dbmock.test.js | 'get all Internal Orders' |
| InternalOrderService | getInternalOrdersIssued | InternalOrder_service_dbmock.test.js | 'get Issued Internal Order' |
| InternalOrderService | getInternalOrdersAccepted | InternalOrder_service_dbmock.test.js | 'get Accepted Internal Order' |
| InternalOrderService | getInternalOrdersById | InternalOrder_service_dbmock.test.js | 'get Internal Order by id' |
| InternalOrderService | setInternalOrder | InternalOrder_service_dbmock.test.js | 'set Internal Order' |
| InternalOrderService | modifyInternalOrder | InternalOrder_service_dbmock.test.js | 'modify Internal Order' |
| InternalOrderService | deleteInternalOrder | InternalOrder_service_dbmock.test.js | 'delete Internal Order' |

# Code coverage report

```
----------------------------|---------|----------|---------|---------|---------------------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s               
----------------------------|---------|----------|---------|---------|---------------------------------
All files                   |   99.29 |    98.83 |     100 |   99.34 |                                 
 modules                    |   98.75 |    97.92 |     100 |   98.84 |                                 
  InternalOrderDAO.js       |     100 |      100 |     100 |     100 |                                 
  ItemsDAO.js               |     100 |      100 |     100 |     100 |                                 
  RestockOrderDAO.js        |     100 |      100 |     100 |     100 |                                 
  ReturnOrderDAO.js         |     100 |      100 |     100 |     100 |                                 
  Sku&Position.js           |      95 |    94.52 |     100 |   94.95 | 165-167,184-186,386-388,413-415 
  TestsDAO.js               |     100 |      100 |     100 |     100 |                                 
  UsersDAO.js               |     100 |      100 |     100 |     100 |                                 
  dbManager.js              |   94.73 |       50 |     100 |     100 | 4                               
  mock_InternalOrder_dao.js |     100 |      100 |     100 |     100 |                                 
  mock_RestockOrder_dao.js  |     100 |      100 |     100 |     100 |                                 
  mock_ReturnOrder_dao.js   |     100 |      100 |     100 |     100 |                                 
  mock_item_dao.js          |     100 |      100 |     100 |     100 |                                 
  mock_position_dao.js      |     100 |      100 |     100 |     100 |                                 
  mock_sku_dao.js           |     100 |      100 |     100 |     100 |                                 
  mock_tests_dao.js         |     100 |      100 |     100 |     100 |                                 
  mock_user_dao.js          |     100 |      100 |     100 |     100 |                                 
 services                   |     100 |      100 |     100 |     100 |                                 
  InternalOrder_service.js  |     100 |      100 |     100 |     100 |                                 
  RestockOrder_service.js   |     100 |      100 |     100 |     100 |                                 
  ReturnOrder_service.js    |     100 |      100 |     100 |     100 |                                 
  item_service.js           |     100 |      100 |     100 |     100 |                                 
  position_service.js       |     100 |      100 |     100 |     100 |                                 
  sku_item_service.js       |     100 |      100 |     100 |     100 |                                 
  sku_service.js            |     100 |      100 |     100 |     100 |                                 
  testDescriptor_service.js |     100 |      100 |     100 |     100 |                                 
  testResult_service.js     |     100 |      100 |     100 |     100 |                                 
  user_service.js           |     100 |      100 |     100 |     100 |                                 
----------------------------|---------|----------|---------|---------|---------------------------------

Test Suites: 20 passed, 20 total
Tests:       280 passed, 280 total
Snapshots:   0 total
Time:        1.745 s
```
