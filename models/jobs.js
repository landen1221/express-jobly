"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Job {
    
    /** Create new job posting
     * Returns [{ id, title, salary, equity, companyHandle }]
     */
    static async create({ title, salary, equity, company_handle }) {
        const {rows} = await db.query(
            `INSERT INTO jobs
                (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, title, salary, equity, company_handle AS "companyHandle"`, [title, salary, equity, company_handle]
        );
        const job = rows[0];
        
        return job;
    }

    /** Find all jobs.
     *
     * Returns [{ id, title, salary, equity, companyHandle }, ...]
    * */
    static async findAll() {
        const {rows } = await db.query(
            `SELECT * FROM jobs`
        );
        return rows;
    }


    /** Update job data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {title, salary, equity}
     *
     * Returns {id, title, salary, equity, companyHandle}
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
        companyHandle: "company_handle",
    });

    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                        SET ${setCols} 
                        WHERE handle = ${handleVarIdx} 
                        RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;

    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No jobs w/ id: ${id}`);

    return job;
    }

    /** Delete given company from database; returns undefined.
     *
     * Throws NotFoundError if company not found.
    **/

    static async remove(handle) {
    const result = await db.query(
        `DELETE
            FROM companies
            WHERE handle = $1
            RETURNING handle`,
        [handle]
    );
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
    }

    // Automates filtering of companies based on query string
    static async filterCompanies(urlQuery) {
    let newQuery = `SELECT * FROM companies WHERE`;
    // if (name) get companies that match query
    let queryCount = 0;

    for (let key in urlQuery) {
        if (queryCount > 0) {
        newQuery += ` AND `;
        }
        if (key === "name") {
        newQuery += ` LOWER(name) LIKE LOWER('%${urlQuery[key]}%')`;
        }
        if (key === "minEmployees") {
        newQuery += ` num_employees >= ${urlQuery[key]} `;
        }
        if (key === "maxEmployees") {
        newQuery += ` num_employees <= ${urlQuery[key]} `;
        }
        queryCount++;
    }

    const results = await db.query(newQuery);
    return results.rows;
    }
}

module.exports = Job;