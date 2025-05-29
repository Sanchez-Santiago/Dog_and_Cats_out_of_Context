// models/MovieModelMySQL.js
import { connection } from '../db/MySQL.js';
export class MovieModelMySQL {
  constructor() {
    this.connection = connection;
  }

  getAllMovies = async ({ genre, name, page = 1 } = {}) => {
    let sql = 'SELECT * FROM movie';
    const params = [];
  
    const conditions = [];
  
    if (genre) {
      conditions.push('genre = ?');
      params.push(genre);
    }
  
    if (name) {
      conditions.push('name LIKE ?');
      params.push(`%${name}%`);
    }
  
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
  
    const limit = 5;
    const offset = (page - 1) * limit;
  
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  
    const [rows] = await this.connection.execute(sql, params);
    return rows;
  };
  

  getName = async ({ name, page = 1 }) => {
    const limit = 5;
    const offset = (page - 1) * limit;
  
    const sql = 'SELECT * FROM movie WHERE name LIKE ? LIMIT ? OFFSET ?';
    const pattern = `%${name}%`;
  
    console.log('>> SQL ejecutado en el modelo:', sql, '— parámetros:', [pattern, limit, offset]);
  
    const [rows] = await this.connection.execute(sql, [pattern, limit, offset]);
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
