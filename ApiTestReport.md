# Integration and API Test Report

Authors: Alessandro Tola, Emanuele Raimondo, Francesco Rosati, Fulvio Castello

Date: 25/05/22

Version: 1.4

| Version number | Change |
| ----------------- |:-----------|
| 1.0 | Added dependency graph |
| 1.1 | Added integration steps |
| 1.2 | Added coverage of scenarios and FR |
| 1.3 | Added coverage of NFR |
| 1.4 | Spell checking and formatting |

# Contents

- [Dependency graph](#dependency-graph)

- [Integration approach](#integration-approach)

- [Tests](#integration-tests)

- [Coverage of scenarios and FR](#coverage-of-scenarios-and-FR)

- [Coverage of non-functional requirements](#coverage-of-non-functional-requirements)

# Dependency graph 

![dependency graph](Images/apiTestReport/DependencyGraph.png)
     
# Integration approach

Here, we decided to use a **bottom-up** integration approach: after having completed unit testing (fixing the majority of failures), we began by testing individual units, and were thus able to proceed with integration testing on *Service* and *Router* files of each class up until the top level. The resulting steps were then:
- Step 1: Unit Testing on DAO files 

- Step 2: Unit Testing on Service files with a mocked DB

- Step 3: Integration and API testing.

#  Integration Tests

## Step 1 - Unit Testing DAO files 

| Classes | Jest test(s) |
| :-----: | :-------------  |
| Sku | testNewSku, TestGetStoredSkus, testDeleteSku, testModifySku, TestModifySkuPosition, testGetPosOccupied, TestUpdateSkuPosition, TestDeleteSkuPos, TestSetTestDescriptorSku, TestDeleteTestDescriptorSku, TestModifyTestDescSku, testDropAndCreateTable, TestCloseSkusTable |
| SkuItem | testGetSKUItems, testGetSKUItemByRfid, testGetAvailableSKUItems, testNewSKUItem, testModifySKUItem, testDeleteSKUItem, testDropAndCreateTable, TestCloseSKUItemTable |
| Item | testGetItems, testGetItemById, testGetItemByIdAndSupplierId, testGetItemBySKUIdAndSupplierId, testNewItem, testModifyItem, testDeleteItem, testDropAndCreateTable, TestCloseItemTable |
| Position | testNewPosition, TestGetStoredPositions, TestGetPosById, testDeletePosition, testModifyPosition, TestModifyPositionID, TestReduceWVposition, TestUpdateWVposition, testDropAndCreateTable, TestClosePositionTable |
| TestDescriptor | TestGetStoredTestDescriptorById, TestGetStoredTestDescriptors, testNewTestDescriptor, testDeleteTestDescriptor, testModifyTestDescriptor, testDropAndCreateTable, TestCloseTestDescriptorTable |
| TestResult | testNewTestResult, TestGetStoredTestResults, TestetStoredTestResultById, TestGetStoredTestResultByIdAndRfid, testDeleteTestResult, testModifyTestResult, testDropAndCreateTable, TestCloseTestResultTable |
| User | testNewUser, testGetUsers, testGetSuppliers, testGetUserByIdAndType, testGetUserByUsernameAndType, testModifyUser, testDeleteUser, testDropAndCreateTable, TestCloseUserTable |
| RestockOrder | testNewRestockOrder, testgetAllRestockOrder, testgetRestockOrderIssued, testgetRestockOrderById, testgetRestockOrderReturnItemsById, testDeleteRestockOrder, testModifyRestockOrderState, testModifyRestockOrderSkuItems, testModifyRestockOrderTransportNote, TestDropAndCreateTable, TestCloseRestockOrderTable |
| ReturnOrder | testgetAllReturnOrder, testgetReturnOrderById, testNewReturnOrder, testDeleteReturnOrder, TestDropAndCreateTable, TestCloseReturnOrderTable |
| InternalOrder | testNewInternalOrder, testgetAllInternalOrders, testgetInternalOrdersIssued, testgetInternalOrdersAccepted, testgetInternalOrdersById, testDeleteInternalOrder, testModifyInternalOrder, TestDropAndCreateTable, TestCloseInternalOrderTable |

## Step 2 - Unit Testing Service files with a mocked DB
| Classes  | Mock-up files used | Jest test(s) |
| :------: | :---------- | :------------- |
| Sku | mock_sku_dao, mock_position_dao | get Sku, get all Skus, set Sku, modify Sku, modify Sku Position, delete Sku, delete all Skus, test with closed connection to Sku Table, test modify Sku Position with closed connection to Sku Table |
| SkuItem | mock_item_dao, mock_sku_dao | delete all skuitems, get skuitem by rfid, get available skuitems by skuid, get all skuitems, set skuitem, modify skuitem, delete skuitem, test with closed db connection |
| Item | mock_item_dao, mock_sku_dao, mock_user_dao | delete all items, get Item by id, get all Items, set Item, modify Item, delete Item, test with closed connection to item table |
| Position | mock_position_dao | get Positions, set Position, modify Position, modify positionID of an existing Position, delete Position, delete all Positions, test with closed connection to Position Table |
| TestDescriptor | mock_tests_dao, mock_sku_dao | get Test Descriptor, get all Test Descriptors, set Test Descriptor, modify Test Descriptor, delete Test Descriptor, delete all Test Descriptors, test with closed connection to Test Descriptor Table |
| TestResult | mock_tests_dao, mock_item_dao | get Test Result, get all test results for a certain sku item identified by RFID, set Test Result, modify Test Result, delete Test Result, delete all Test Results, test with closed connection to Test Result Table |
| User | mock_user_dao | delete all users, check User, get all suppliers, get all users, set user, modify user, delete user, test with closed connection to user table |
| RestockOrder | mock_RestockOrder_dao, mock_sku_dao | get Restock Order, get all Restock Order, get Issued Restock Order, get Restock Order Return Items ById, set Restock Order, modify Restock Order State, modify Restock Order SkuItems, modify Restock Order TransportNote, delete Restock Order, delete all Restock Orders, test with closed connection to Restock Order Table |
| ReturnOrder | mock_ReturnOrder_dao, mock_sku_dao, mock_RestockOrder_dao | get Return Order, get all Return Order, set Return Order, delete Return Order, delete all Return Orders, test with closed connection to Return Order Table |
| InternalOrder | mock_InternalOrder_dao, mock_sku_dao | get Internal Order by id, get all Internal Order, get Issued Internal Order, get Accepted Internal Order, set Internal Order, modify Internal Order, delete Internal Order, delete all Internal Orders, test with closed connection to Internal Order Table |


## Step 3 - Integration and API testing
| Classes  | Mocha test(s) |
| :------: | :------------- |
| Sku | emptySkuTable, newSku, getSku, getAllSkus, modSkuPosition, modifySku, deleteSku |
| SkuItem | emptySKUItemTable, newSKUItem, getAllSKUItems, getSKUItemRFID, modifySKUItem, getAvailableSKUItems, deleteSKUItem |
| Item | emptyItemTable, newItem, getItem, getAllItems, modifyItem, deleteItem |
| Position | emptyPostionTable, newPosition, getAllPositions, modifyPosition, changePositionID, deletePosition |
| TestDescriptor | emptyTestDescriptorTable, newTestDescriptor, getTestDescriptor, getAllTestDescriptors, modifyTestDescriptor, deleteTestDescriptor |
| TestResult | emptyTestResultTable, newTestResult, getTestResult, getSomeTestResult, modifyTestResult, deleteTestResult |
| User | emptyUserTable, newUser, checkLogin, getAllUsers, getAllSuppliers, modifyUser, deleteUser |
| RestockOrder | emptyRestockOrderTable, newRestockOrder, getRestockOrder, getAllRestockOrders, getIssuedRestockOrders, getOrderRestockOrderReturnItemsById, modifyRestockOrderStateById, modifyRestockOrderSKUItemsById, modifyTransportNoteById, deleteRestockOrder |
| ReturnOrder | emptyReturnOrderTable, nerReturnOrder, getReturnOrderById, getAllReturnOrders, deleteReturnOrder |
| InternalOrder | emptyInternalOrderTable, newInternalOrder, getInternalOrderbyId, getAllInternalOrders, getIssuedInternalOrders, getAcceptedInternalOrders, modifyInternalOrder, deleteInternalOrder |

# Coverage of Scenarios and FR

| Scenario ID | Functional Requirements covered | Mocha Test(s) | 
| :---------: | :------------------------------ | :------------ | 
| 1-1 | FR 2.1  | newSku |
| 1-2 | FR 2.1 | modSkuPosition |
| 1-3 | FR 2.1 | modifySku | 
| 2-1 | FR 3.1.1 | newPosition | 
| 2-2 | FR 3.1.1 | changePositionID | 
| 2-3 | FR 3.1.4 | modifyPosition | 
| 2-4 | FR 3.1.4 | modifyPosition | 
| 2-5 | FR 3.1.2 | deletePosition | 
| 3-1 | FR 5.6 | newRestockOrder | 
| 3-2 | FR 5.6 | newRestockOrder | 
| 4-1 | FR 1.1 | newUser | 
| 4-2 | FR 1.1 | modifyUser | 
| 4-3 | FR 1.2 | deleteUser | 
| 5-1-1 | FR 5.8 | getRestockOrder, modifyRestockOrderStateById, modifyTransportNoteById |
| 5-2-1 | FR 5.8 | newTestResult, modifyRestockOrderStateById |
| 5-2-2 | FR 5.8 | newTestResult, modifyRestockOrderStateById |       
| 5-2-3 | FR 5.8.2 | newTestResult, modifyTestResult, modifyRestockOrderSKUItemsById, modifyRestockOrderStateById |
| 5-3-1 | FR 5.8.3 | modifyPosition, modifySku, modifyRestockOrderStateById |
| 5-3-2 | FR 5.8.3 | getSomeTestResults, modifyRestockOrderStateById |
| 5-3-3 | FR 5.8.3 | getSomeTestResults, modifyPosition, modifySku, modifyRestockOrderStateById |
| 6-1 | FR 5.10 | newReturnOrder, getSKUItemRFID, modifySKUItem |
| 6-2 | FR 5.10 | newReturnOrder, getSKUItemRFID, modifySKUItem, modifySku, modifyPosition |
| 7-1 | FR 1 | checkUser |
| 9-1 | FR 6.1 | newInternalOrder, modifySku, modifyPosition, modifyInternalOrder |
| 9-2 | FR 6.6 | newInternalOrder, modifySku, modifyPosition, modifyInternalOrder |
| 9-3 | FR 6.4 | newInternalOrder, modifySku, modifyPosition, modifyInternalOrder |
| 10-1 | FR 6.7 | modifyInternalOrder |
| 11-1 | FR 7 | newItem |
| 11-2 | FR 7 | modifyItem |
| 12-1 | FR 3.2.1 | newTestDescriptor |
| 12-2 | FR 3.2.2 | modifyTestDescriptor |
| 12-3 | FR 3.2.3 | deleteTestDescriptor |

# Coverage of Non Functional Requirements

For the sake of conciseness, parameter checking for each of the following NFRs is below reported **just** for the main class they refer to, even if/when they were performed in other external tests as well.

| Non Functional Requirement | Test(s) name |
| :------------------------: | :-------- |
| NFR4 | newPosition, modifyPosition, changePositionID, deletePosition |
| NFR6 | newSKUItem, getSKUItemRFID, modifySKUItem, deleteSKUItem |
| NFR9 | newSKUItem, modifySKUItem |
