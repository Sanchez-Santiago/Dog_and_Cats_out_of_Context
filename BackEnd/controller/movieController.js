import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
    constructor({ MovieModel }) {
        this.MovieModel = MovieModel;
    }

    getAll = async (req, res) => {
        const { genre } = req.query;
        const movies = await this.MovieModel.getAllMovies({ genre });
        res.json(movies);
    }

    getName = async (req, res) => {
        const { name } = req.query;
        const movies = await this.MovieModel.getAllMovies({ name });
        res.json(movies);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const movie = await this.MovieModel.getMovieById({ id });
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).send('Película no encontrada');
        }
    }

    create = async (req, res) => {
        const result = validateMovie(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const newMovie = await this.MovieModel.addMovie({ input: result.data });
        res.status(201).json(newMovie);
    }

    update = async (req, res) => {
        const result = validatePartialMovie(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const { id } = req.params;
        const updatedMovie = await this.MovieModel.updateMovie({ id, input: result.data });

        if (!updatedMovie) {
            return res.status(404).send('Película no encontrada');
        }

        res.json(updatedMovie);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const deleted = await this.MovieModel.deleteMovie({ id });

        if (!deleted) {
            return res.status(404).send('Película no encontrada');
        }

        res.json({ message: 'Película eliminada correctamente' });
    }
}