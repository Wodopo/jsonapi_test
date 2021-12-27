const pool = require('../db');

const Person = {
    count: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM person');
        return result.rows[0].count;
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM person');
        return result.rows;
    },
    getAllUnemployed: async () => {
        const result = await pool.query(`
            SELECT person.*
            FROM person
            LEFT JOIN person_company USING(person_id)
            WHERE person_company.company_id is null;
        `);
        return result.rows;
    },
    getUnemployedCount: async () => {
        const result = await pool.query(`
            SELECT count(*)
            FROM person
            LEFT JOIN person_company USING(person_id)
            WHERE person_company.company_id is null;
        `);
        return result.rows[0].count;
    },
    getAllPeopleCities: async () => {
        const result = await pool.query(`SELECT * FROM person_city`);
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query(
            `SELECT person.name, person.email, city.name as city_name, city.state as city_state, company.name as company_name
            FROM person
            LEFT JOIN person_city USING(person_id)
            LEFT JOIN city USING(city_id)
            LEFT JOIN person_company USING(person_id)
            LEFT JOIN company USING(company_id)
            WHERE person_id=$1`,
            [id]
        );
        if (result.rows.length == 0) throw { status: 404, message: 'Person not found' };
        return result.rows[0];
    },
    add: async (name, email) => {
        const result = await pool.query('INSERT INTO person (name, email) VALUES($1, $2) RETURNING *', [name, email]);
        return result.rows;
    },
    update: async (id, name, email) => {
        const result = await pool.query(
            `UPDATE person 
             SET name=$1, 
                 email=$2 
             WHERE person_id=$3
             RETURNING *`,
            [name, email, id]
        );
        return result.rows;
    },
    setCity: async (person_id, city_id) => {
        await pool.query(
            `INSERT INTO person_city
             VALUES ($1, $2)
             ON CONFLICT (person_id) DO UPDATE
             SET city_id = $2`,
            [person_id, city_id]
        );
    },
    setCompany: async (person_id, company_id) => {
        await pool.query(
            `INSERT INTO person_company
             VALUES ($1, $2)
             ON CONFLICT (person_id) DO UPDATE
             SET company_id = $2`,
            [person_id, company_id]
        );
    },
    delete: async (id) => {
        // TODO cascade
        const result = await pool.query('DELETE FROM person WHERE person_id=$1 RETURNING *', [id]);
        return result.rowCount;
    },
};

module.exports = Person;
