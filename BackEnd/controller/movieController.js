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
      const { name } = req.params;              // ← antes estabas usando req.query
      console.log('>> getName recibido en controlador:', name);

      const movies = await this.MovieModel.getName({ name });  // ← invocar método del modelo
      res.json(movies);
    } catch (error) {
      console.error('Error al obtener las películas por nombre:', error);
      res.status(500).json({ error: 'Error al obtener las películas por nombre' });
    }
  };

  create = async (req, res) => {
    try {
      const { file, body } = req;

      // 1. Validar que haya un archivo
      if (!file) {
        return res.status(400).json({ error: 'Movie file is required' });
      }

      // 2. Validar los campos del body con Zod
      //    Nota: 'body' contiene todos los campos salvo el archivo
      //    Tu esquema espera: name, fecha, description, duration, likes?, dislikes?, movie, user_id
      //    Aquí hacemos un safeParse provisional quitando 'movie' porque primero subiremos el archivo.
      const provisionalData = {
        ...body,
        movie: 'https://placeholder.url', // temporalmente válido para que Zod no falle
      };
      const result = validateMovie(provisionalData);

      if (!result.success) {
        return res.status(400).json(result.error.format());
      }

      // 3. Subir el archivo a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
      });

      // 4. Armar el objeto final para guardar en BD, usando la URL y el public_id
      const newMovieData = {
        ...result.data,
        movie: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
      };

      // 5. Llamar al modelo para insertar en la tabla 'movie'
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

      // 1. Obtener la película para extraer el public_id
      const movie = await this.MovieModel.getMovieById({ id });
      if (!movie) {
        return res.status(404).json({ error: 'Película no encontrada' });
      }

      // 2. Si existe public_id, eliminar el archivo en Cloudinary
      const publicId = movie.cloudinary_public_id;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: 'auto',
          invalidate: true,
        });
      }

      // 3. Eliminar el registro de la película en la base de datos
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
