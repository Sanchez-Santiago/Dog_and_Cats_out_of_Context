import { MySQL } from 'mysql2/promise.js';

export class MovieModelMySQL {
    constructor({ connection }) {
        this.connection = connection;
    }

    getAllMovies = async ({ genre }) => {
        const sql = `SELECT * FROM movies`;
        const [rows] = await this.connection.execute(sql, [genre]);
        return rows;
    }

    getMovieById = async ({ id }) => {
        const sql = `SELECT * FROM movies WHERE id = ?`;
        const [rows] = await this.connection.execute(sql, [id]);
        return rows[0];
    }
}