const pool = require('../db');

const City = {
    count: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM city');
        return result.rows[0].count;
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM city');
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query('SELECT * FROM city WHERE city_id=$1', [id]);
        if (result.rows.length == 0) throw { status: 404, message: 'City not found' };
        return result.rows;
    },
    add: async (name, state) => {
        const result = await pool.query('INSERT INTO city (name, state) VALUES($1, $2) RETURNING *', [name, state]);
        return result.rows;
    },
    update: async (id, name, state) => {
        const result = await pool.query('UPDATE city SET name=$1, state=$2 WHERE city_id=$3 RETURNING *', [
            name,
            state,
            id,
        ]);
        return result.rows;
    },
    delete: async (id) => {
        const result = await pool.query('DELETE FROM city WHERE city_id=$1 RETURNING *', [id]);
        return result.rowCount;
    },
};

module.exports = City;
