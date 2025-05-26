// controllers/MovieController.js
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import cloudinary from '../services/cloudinary.js';

export class MovieController {
  constructor({ MovieModel }) {
    this.MovieModel = MovieModel;
  }

  getAll = async (req, res) => {
    try {
      const { genre, name } = req.query;
      const movies = await this.MovieModel.getAllMovies({ genre, name });
      res.json(movies);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      res.status(500).json({ error: 'Error al obtener las películas' });
    }
  };

  getName = async (req, res) => {
    try {
      const { name } = req.query;
      const movies = await this.MovieModel.getAllMovies({ name });
      res.json(movies);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      res.status(500).json({ error: 'Error al obtener las películas' });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await this.MovieModel.getMovieById({ id });
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ error: 'Película no encontrada' });
      }
    } catch (error) {
      console.error('Error al obtener la película:', error);
      res.status(500).json({ error: 'Error al obtener la película' });
    }
  };

  create = async (req, res) => {
    try {
      const validation = validateMovie(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.issues });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
      }

      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
      });

      const newMovieData = {
        ...validation.data,
        movie: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
      };

      const newMovie = await this.MovieModel.addMovie({ input: newMovieData });
      res.status(201).json(newMovie);
    } catch (error) {
      console.error('Error al crear la película:', error);
      res.status(500).json({ error: 'Error al crear la película' });
    }
  };

  update = async (req, res) => {
    try {
      const validation = validatePartialMovie(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.issues });
      }

      const { id } = req.params;
      const updatedMovie = await this.MovieModel.updateMovie({ id, input: validation.data });

      if (!updatedMovie) {
        return res.status(404).json({ error: 'Película no encontrada' });
      }

      res.json(updatedMovie);
    } catch (error) {
      console.error('Error al actualizar la película:', error);
      res.status(500).json({ error: 'Error al actualizar la película' });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await this.MovieModel.getMovieById({ id });

      if (!movie) {
        return res.status(404).json({ error: 'Película no encontrada' });
      }

      const publicId = movie.cloudinary_public_id;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'auto', invalidate: true });
      }

      const deleted = await this.MovieModel.deleteMovie({ id });
      if (!deleted) {
        return res.status(404).json({ error: 'Película no encontrada' });
      }

      res.json({ message: 'Película eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la película:', error);
      res.status(500).json({ error: 'Error al eliminar la película' });
    }
  };
}