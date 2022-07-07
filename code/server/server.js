'use strict';

const express = require('express');
const fetch = require('node-fetch');

const usersRouter = require("./routers/userRouter");
const testsDescriptorRouter = require("./routers/testDescriptorRouter");
const testsResultRouter = require("./routers/testResultRouter");
const skuRouter = require("./routers/skuRouter");
const positionRouter = require("./routers/positionRouter");
const itemsRouter = require("./routers/itemRouter");
const SKUitemsRouter = require("./routers/SKUitemRouter");
const InternalOrderRouter = require("./routers/InternalOrderRouter");
const RestockOrderRouter = require("./routers/RestockOrderRouter");
const ReturnOrderRouter = require("./routers/ReturnOrderRouter");

// init express
const app = new express();
const port = 3001;

const SERVER_URL = 'http://localhost:' + port;

app.use(express.json());

async function init() {
  await fetch(SERVER_URL + '/api/allUsers', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/newUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "user1@ezwh.com",
      name: "John",
      surname: "Smith",
      password: "testpassword",
      type: "customer"
    })
  })

  await fetch(SERVER_URL + '/api/newUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "qualityEmployee1@ezwh.com",
      name: "Marco",
      surname: "Ravano",
      password: "testpassword",
      type: "qualityEmployee"
    })
  })

  await fetch(SERVER_URL + '/api/newUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "clerk1@ezwh.com",
      name: "Simone",
      surname: "Rana",
      password: "testpassword",
      type: "clerk"
    })
  })

  await fetch(SERVER_URL + '/api/newUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "deliveryEmployee1@ezwh.com",
      name: "Gianni",
      surname: "Celeste",
      password: "testpassword",
      type: "deliveryEmployee"
    })
  })

  await fetch(SERVER_URL + '/api/newUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "supplier1@ezwh.com",
      name: "Valentino",
      surname: "Rossi",
      password: "testpassword",
      type: "supplier"
    })
  })

  await fetch(SERVER_URL + '/api/newUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "manager1@ezwh.com",
      name: "Claudio",
      surname: "Bossi",
      password: "testpassword",
      type: "manager",
      createM: 1
    })
  })

  await fetch(SERVER_URL + '/api/allInternalOrder', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allItems', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allPositions', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allRestockOrder', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allReturnOrder', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allSKUItems', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allSkus', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allTestDescriptors', {
    method: 'DELETE',
  });

  await fetch(SERVER_URL + '/api/allTestResults', {
    method: 'DELETE',
  });

}

app.use('/api', usersRouter);
app.use('/api', testsDescriptorRouter);
app.use('/api', testsResultRouter);
app.use('/api', itemsRouter);
app.use('/api', skuRouter);
app.use('/api', positionRouter);
app.use('/api', SKUitemsRouter);
app.use('/api', InternalOrderRouter);
app.use('/api', RestockOrderRouter);
app.use('/api', ReturnOrderRouter);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
