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

    getMovieByName = async ({ name }) => {
        const sql = `SELECT * FROM movie WHERE name = ?`;
        const [rows] = await this.connection.execute(sql, [name]);
        return rows[0];
    }

    getMovieById = async ({ id }) => {
        const sql = `SELECT * FROM movie WHERE idmovie = ?`;
        const [rows] = await this.connection.execute(sql, [id]);
        return rows[0];
    }

    addMovie = async ({ input }) => {
        const sql = `INSERT INTO movie (name, genre, movie) VALUES (?, ?, ?)`;
        const [rows] = await this.connection.execute(sql, [input.name, input.genre, input.movie]);
        return rows[0];
    }

    updateMovie = async ({ id, input }) => {
        const sql = `UPDATE movie SET name = ?, genre = ?, movie = ? WHERE idmovie = ?`;
        const [rows] = await this.connection.execute(sql, [input.name, input.genre, input.movie, id]);
        return rows[0];
    }

    deleteMovie = async ({ id }) => {
        const sql = `DELETE FROM movie WHERE idmovie = ?`;
        const [rows] = await this.connection.execute(sql, [id]);
        return rows[0];
    }
}
