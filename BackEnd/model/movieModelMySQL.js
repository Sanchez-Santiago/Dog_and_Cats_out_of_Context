import mysql from 'mysql2/promise';

export class MovieModelMySQL {
    constructor({ connection }) {
        this.connection = connection;  // Aquí guardas el objeto connection
    }

    getAllMovies = async () => {
        const sql = `SELECT * FROM movie`;
        const [rows] = await this.connection.execute(sql);
        return rows;
    }

    getMovieById = async ({ id }) => {
        const sql = `SELECT * FROM movie WHERE idmovie = ?`;
        const [rows] = await this.connection.execute(sql, [id]);
        return rows[0];
    }
}
