// app.js o index.js
import express from 'express';
import dotenv from 'dotenv';
import router from './router/movieRouter.js';
    
    const app = express();
    app.use(express.json());
    app.disable('x-powered-by');
    dotenv.config(
        {
            path: '.env',
        }
    );

    const connection = MySQL.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const MovieModel = new MovieModelMySQL(connection);
    
    app.get('/', (req, res) => {
        res.send('Hola mundo');
    });

    app.use('/api', router);

    const PORT = process.env.PORT ?? 1234;
    app.listen(PORT, () => {
      console.log(`Server escuchando en el puerto http://localhost:${PORT}`);
    });
