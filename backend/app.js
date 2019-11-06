const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const db = require('./queries');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post('/building', db.createBuilding);
app.post('/road', db.createRoad);
app.post('/poi', db.createPoI);
app.get('/poi/bbox', db.getPoIByBBox);

module.exports = app;