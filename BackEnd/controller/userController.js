import { validateUser, validatePartialUser } from '../schemas/user.js';
import cloudinary from '../services/cloudinary.js';

export class UserController {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  // Obtener todos los usuarios, con opción de filtrar por nombre
  getAll = async (req, res) => {
    try {
      const { name } = req.query;
      const users = await this.UserModel.getAllUsers({ name });
      res.json(users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  };

  // Obtener usuarios por nombre
  getName = async (req, res) => {
    try {
      const { name } = req.query;
      const users = await this.UserModel.getAllUsers({ name });
      res.json(users);
    } catch (error) {
      console.error('Error al obtener los usuarios por nombre:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios por nombre' });
    }
  };

  // Obtener un usuario por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.UserModel.getUserById({ id });
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  };

  // Crear un nuevo usuario y subir el archivo a Cloudinary
  create = async (req, res) => {
    try {
      const result = validateUser(req.body);

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

      const newUserData = {
        ...result.data,
        cloudinary_public_id: uploadResult.public_id,
      };

      const newUser = await this.UserModel.addUser({ input: newUserData });

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  };

  // Actualizar un usuario existente
  update = async (req, res) => {
    try {
      const result = validatePartialUser(req.body);

      if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
      }

      const { id } = req.params;
      const updatedUser = await this.UserModel.updateUser({ id, input: result.data });

      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  };

  // Eliminar un usuario
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.UserModel.deleteUser({ id });

      if (!deleted) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  };
}   