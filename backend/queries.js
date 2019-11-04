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

const getBuildings = (request, response, next) => {

    pool.query(`SELECT row_to_json(fc)
                FROM (
                         SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
                         FROM (
                                  SELECT 'Feature'                                                             As type,
                                         ST_AsGeoJSON(lg.geom)::json As geometry,
                                         json_build_object('id', id, 'name', name, 'description', description) As properties
                                  FROM building As lg
                              ) As f
                     ) As fc`, (error, results) => {
        if (error) {
            next(error);
        }
        response.status(200).json(results.rows[0].row_to_json);
    })
};

const createBuilding = async (request, response, next) => {
    const {name, description, geometry} = request.body;
    const query = `INSERT INTO building(name, description, geom)
                   VALUES ($1, $2, ST_GeomFromText($3, 2180))
                   RETURNING id`;
    try {
        await tx(async client => {
            const res = await client.query(query, [name, description, geometry]);
            response.status(201).json({id: res.rows[0].id});
        });
    } catch (e) {
        next(e)
    }
};

const createRoad = async (request, response, next) => {
    const {name, description, category, length, geometry} = request.body;
    const query = `INSERT INTO road(name, description, category, length, geom)
                   VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 2180))
                   RETURNING id`;
    try {
        await tx(async client => {
            const res = await client.query(query, [name, description, category, parseFloat(length), geometry]);
            response.status(201).json({id: res.rows[0].id});
        });
    } catch (e) {
        next(e)
    }
};

const createPoI = async (request, response, next) => {
    const {name, description, category, geometry} = request.body;
    const query = `INSERT INTO poi(name, description, category, geom)
                   VALUES ($1, $2, $3, ST_GeomFromText($4, 2180))
                   RETURNING id`;
    try {
        await tx(async client => {
            const res = await client.query(query, [name, description, category, geometry]);
            response.status(201).json({id: res.rows[0].id});
        });
    } catch (e) {
        next(e)
    }
};

const getPoIByBBox = async (request, response, next) => {
    const {xmin, ymin, xmax, ymax} = request.query;
    //xmin, ymin, xmax, ymax
    const query = 'SELECT id, name, description, category, ST_AsText(geom) FROM poi WHERE geom && ST_MakeEnvelope($1, $2, $3, $4)';

    try {
        const res = await pool.query(query, [xmin, ymin, xmax, ymax]);
        response.status(200).json(res.rows);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBuildings,
    createBuilding,
    createRoad,
    createPoI,
    getPoIByBBox
};