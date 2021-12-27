const pool = require('../db');

const Company = {
    count: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM company');
        return result.rows[0].count;
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM company');
        return result.rows;
    },
    getFromCityID: async (city_id) => {
        const result = await pool.query(
            `
            SELECT company.*
            FROM company
            LEFT JOIN company_city USING(company_id)
            WHERE city_id = $1
        `,
            [city_id]
        );
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query(
            `SELECT company.name as name, city.name as city_name, city.state as city_state 
            FROM company 
            LEFT JOIN company_city USING(company_id)
            LEFT JOIN city USING(city_id) 
            WHERE company_id=$1`,
            [id]
        );
        if (result.rows.length == 0) throw { status: 404, message: 'Company not found' };
        return result.rows;
    },
    add: async (name) => {
        const result = await pool.query('INSERT INTO company (name) VALUES($1) RETURNING *', [name]);
        return result.rows;
    },
    update: async (id, name) => {
        const result = await pool.query('UPDATE company SET name=$1 WHERE company_id=$2 RETURNING *', [name, id]);
        return result.rows;
    },
    setCity: async (company_id, city_id) => {
        await pool.query(
            `INSERT INTO company_city
             VALUES ($1, $2)
             ON CONFLICT (company_id) DO UPDATE
             SET city_id = $2`,
            [company_id, city_id]
        );
    },
    delete: async (id) => {
        const result = await pool.query('DELETE FROM company WHERE company_id=$1 RETURNING *', [id]);
        return result.rowCount;
    },
};

module.exports = Company;
