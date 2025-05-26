// controllers/MovieController.js
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import cloudinary from '../services/cloudinary.js';

export class MovieController {
  constructor({ MovieModel }) {
    this.MovieModel = MovieModel;
  }

  // Obtener todas las películas, con opción de filtrar por género
  getAll = async (req, res) => {
    try {
      const { genre } = req.query;
      const movies = await this.MovieModel.getAllMovies({ genre });
      res.json(movies);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      res.status(500).json({ error: 'Error al obtener las películas' });
    }
  };

  // Obtener películas por nombre
  getName = async (req, res) => {
    try {
      const { name } = req.query;
      const movies = await this.MovieModel.getAllMovies({ name });
      res.json(movies);
    } catch (error) {
      console.error('Error al obtener las películas por nombre:', error);
      res.status(500).json({ error: 'Error al obtener las películas por nombre' });
    }
  };

  // Obtener una película por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await this.MovieModel.getMovieById({ id });
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).send('Película no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener la película:', error);
      res.status(500).json({ error: 'Error al obtener la película' });
    }
  };

  // Crear una nueva película y subir el archivo a Cloudinary
  create = async (req, res) => {
    try {
      const result = validateMovie(req.body);

      if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
      }

      // Subir el archivo a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto', // Detecta automáticamente si es imagen o video
      });

      const newMovieData = {
        ...result.data,
        movie: uploadResult.secure_url,
      };

      const newMovie = await this.MovieModel.addMovie({ input: newMovieData });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error('Error al crear la película:', error);
      res.status(500).json({ error: 'Error al crear la película' });
    }
  };

  // Actualizar una película existente
  update = async (req, res) => {
    try {
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
    } catch (error) {
      console.error('Error al actualizar la película:', error);
      res.status(500).json({ error: 'Error al actualizar la película' });
    }
  };

  // Eliminar una película
  delete = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Obtener la película por ID
      const movie = await this.MovieModel.getMovieById({ id });
  
      if (!movie) {
        return res.status(404).send('Película no encontrada');
      }
  
      // Extraer el public_id del archivo en Cloudinary
      // Suponiendo que almacenas el public_id en la propiedad 'cloudinary_public_id' de la película
      const publicId = movie.cloudinary_public_id;
  
      // Eliminar el archivo de Cloudinary
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
      }
  
      // Eliminar la película de la base de datos
      const deleted = await this.MovieModel.deleteMovie({ id });
  
      if (!deleted) {
        return res.status(404).send('Película no encontrada');
      }
  
      res.json({ message: 'Película eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la película:', error);
      res.status(500).json({ error: 'Error al eliminar la película' });
    }
  };  
}
