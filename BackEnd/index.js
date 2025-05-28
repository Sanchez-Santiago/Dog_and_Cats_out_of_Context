// index.js o app.js
import express from 'express';
import movieRouter from './router/movieRouter.js'
import userRouter from './router/userRouter.js'
import { MovieModelMySQL } from './model/movieModelMySQL.js';
import { UserModelMySQL } from './model/userModelMySQL.js';

const app = express();
app.use(express.json());
app.disable('x-powered-by');

async function start() {
  try {
    const MovieModel = new MovieModelMySQL();
    const UserModel = new UserModelMySQL();

    app.get('/', (req, res) => {
      res.send('Hola mundo');
    });

    app.use('/api/movie', movieRouter({ MovieModel }));
    app.use('/api/user', userRouter({ UserModel }));

    const PORT = process.env.PORT ?? 1234;
    app.listen(PORT, () => {
      console.log(`✅ Server escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
  }
}


start(); // 👈 Ahora sí
