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
    const pattern = `%${name}%`;
    console.log('>> SQL ejecutado en el modelo:', sql, '— parámetros:', [pattern]);

    const [rows] = await this.connection.execute(sql, [pattern]);
    return rows;
  };

  getMovieById = async ({ id }) => {
    const sql = 'SELECT * FROM movie WHERE idmovie = ?';
    const [rows] = await this.connection.execute(sql, [id]);
    return rows[0];
  };

  addMovie = async ({ input }) => {
    const keys = [
      'name',
      'fecha',
      'description',
      'duration',
      'likes',
      'dislikes',
      'movie',
      'user_id',
      'genre',
      'cloudinary_public_id'
    ];
  
    // Forzamos null en los campos que no vengan definidos
    const sanitized = {};
    for (const key of keys) {
      sanitized[key] = input[key] !== undefined ? input[key] : null;
    }
  
    const sql = `
    INSERT INTO movie (name, fecha, description, duration, likes, dislikes, movie, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await this.connection.execute(sql, [
    sanitized.name,
    sanitized.fecha,
    sanitized.description,
    sanitized.duration,
    sanitized.likes,
    sanitized.dislikes,
    sanitized.movie,
    sanitized.user_id
  ]);
  
  
    return { id: result.insertId, ...sanitized };
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
