// index.js o app.js
import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise'; // ✅ correcta
import router from './router/movieRouter.js';
import { MovieModelMySQL } from './model/movieModelMySQL.js';

dotenv.config({ path: '.env' });

const app = express();
app.use(express.json());
app.disable('x-powered-by');

async function start() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    const MovieModel = new MovieModelMySQL({ connection });

    app.get('/', (req, res) => {
      res.send('Hola mundo');
    });

    app.use('/api', router({ MovieModel }));

    const PORT = process.env.PORT ?? 1234;
    app.listen(PORT, () => {
      console.log(`✅ Server escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
  }
}

start(); // 👈 Ahora sí
