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
                                            VALUES ($1, $2, st_transform(ST_GeomFromText($3, 3857), 2180))
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
    const {name, description, length, geometry} = request.body;
    const query = `INSERT INTO road(name, description, length, geom)
                                            VALUES ($1, $2, $3, st_transform(ST_GeomFromText($4, 3857), 2180))
                                            RETURNING id`;
    try {
        await tx(async client => {
            const res = await client.query(query, [name, description, parseFloat(length), geometry]);
            response.status(201).json({id: res.rows[0].id});
        });
    } catch (e) {
        next(e)
    }
};

const createPoi = async (request, response, next) => {
    const {name, description, geometry} = request.body;
    const query = `INSERT INTO poi(name, description, geom)
                                            VALUES ($1, $2, st_transform(ST_GeomFromText($3, 3857), 2180))
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

module.exports = {
    getBuildings,
    createBuilding,
    createRoad,
    createPoi
};