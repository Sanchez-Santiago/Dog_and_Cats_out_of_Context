import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import cloudinary, { uploadFromBuffer } from '../services/cloudinary.js';

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

  getName = async (req, res) => {
    try {
      const { name } = req.params;
      const movies = await this.MovieModel.getName({ name });
      res.json(movies);
    } catch (error) {
      console.error('Error al obtener las películas por nombre:', error);
      res.status(500).json({ error: 'Error al obtener las películas por nombre' });
    }
  };

  create = async (req, res) => {
    const newMovieData = {
      name: 'Movie name',
      description: 'Movie description',
      duration: 10,
      likes: 0,
      dislikes: 0,
      user_id: 1,
    };
    try {
      const { file, body } = req;
  
      if (!file) {
        return res.status(400).json({ error: 'Movie file is required' });
      }
  
      const provisionalData = {
        ...body,
        movie: 'https://placeholder.url',
      };
  
      const result = validateMovie(provisionalData);
  
      if (!result.success) {
        return res.status(400).json(result.error.format());
      }
  
      // Usar uploadFromBuffer en lugar de upload con file.path
      const uploadResult = await uploadFromBuffer(file.buffer);
  
      const newMovieData = {
        ...result.data,
        movie: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
      };
  
      const created = await this.MovieModel.addMovie({ input: newMovieData });
  
      return res.status(201).json(created);
    } catch (error) {
      console.error('Error al crear la película:', error);
      return res.status(500).json({ error: 'Error al crear la película' });
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
        await cloudinary.uploader.destroy(publicId, {
          resource_type: 'auto',
          invalidate: true,
        });
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
