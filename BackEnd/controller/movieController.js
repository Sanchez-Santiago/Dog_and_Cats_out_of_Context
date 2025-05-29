import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import cloudinary, { uploadFromBuffer } from '../services/cloudinary.js';

export class MovieController {
  constructor({ MovieModel }) {
    this.MovieModel = MovieModel;
  }

  getAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const name = req.query.name || '';
      const genre = req.query.genre || '';

      const results = await this.MovieModel.getAllMovies({ name, genre, page });
      res.json(results);
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
    try {
      const { file, body } = req;

      if (!file) {
        return res.status(400).json({ error: 'Se requiere un archivo de película' });
      }

      const provisionalData = {
        ...body,
        movie: 'https://placeholder.url', // necesario para pasar la validación
      };

      const result = validateMovie(provisionalData);

      if (!result.success) {
        return res.status(400).json(result.error.format());
      }

      // Subir el archivo a Cloudinary
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

      const publicId = req.body?.cloudinary_public_id;
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: 'auto',
            invalidate: true,
          });
          console.log(`Imagen ${publicId} eliminada de Cloudinary por error de base de datos.`);
        } catch (cloudError) {
          console.error('Error al eliminar imagen de Cloudinary:', cloudError);
        }
      }

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
