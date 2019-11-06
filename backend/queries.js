const {pool} = require('./config');

const tx = async callback => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        try {
            await callback(client);
            client.query('COMMIT');
        } catch (e) {
            client.query('ROLLBACK');
            throw e;
        }
    } finally {
        client.release();
    }
};

const createBuilding = async (request, response, next) => {
    //Zapisuje budynek
};

const createRoad = async (request, response, next) => {
    // Zapisuje drogę
};

const createPoI = async (request, response, next) => {
    //Zapisuje POI
};

const getPoIByBBox = async (request, response, next) => {
    //Pobiera po BBOX
};

module.exports = {
    createBuilding,
    createRoad,
    createPoI,
    getPoIByBBox
};