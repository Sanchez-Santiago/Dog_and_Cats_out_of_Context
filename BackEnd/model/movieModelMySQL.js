// models/MovieModelMySQL.js
export class MovieModelMySQL {
  constructor({ connection }) {
    this.connection = connection;
  }

  getAllMovies = async ({ genre, name } = {}) => {
    let sql = 'SELECT * FROM movie';
    const params = [];

    if (genre || name) {
      sql += ' WHERE';
      if (genre) {
        sql += ' genre = ?';
        params.push(genre);
      }
      if (genre && name) {
        sql += ' AND';
      }
      if (name) {
        sql += ' name LIKE ?';
        params.push(`%${name}%`);
      }
    }

    const [rows] = await this.connection.execute(sql, params);
    return rows;
  };

  getName = async ({ name }) => {
    const sql = 'SELECT * FROM movie WHERE name LIKE ?';
    const [rows] = await this.connection.execute(sql, [`%${name}%`]);
    return rows;
  };

  getMovieById = async ({ id }) => {
    const sql = 'SELECT * FROM movie WHERE idmovie = ?';
    const [rows] = await this.connection.execute(sql, [id]);
    return rows[0];
  };

  addMovie = async ({ input }) => {
    const sql = `
      INSERT INTO movie (name, genre, movie, cloudinary_public_id)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await this.connection.execute(sql, [
      input.name,
      input.genre,
      input.movie,
      input.cloudinary_public_id,
    ]);
    return { id: result.insertId, ...input };
  };

  updateMovie = async ({ id, input }) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(input)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    const sql = `UPDATE movie SET ${fields.join(', ')} WHERE idmovie = ?`;
    values.push(id);

    const [result] = await this.connection.execute(sql, values);
    return result.affectedRows > 0 ? { id, ...input } : null;
  };

  deleteMovie = async ({ id }) => {
    const sql = 'DELETE FROM movie WHERE idmovie = ?';
    const [result] = await this.connection.execute(sql, [id]);
    return result.affectedRows > 0;
  };
}
