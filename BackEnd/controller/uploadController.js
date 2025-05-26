// controllers/uploadController.js
import cloudinary from '../services/cloudinary.js';

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto', // Detecta automáticamente si es imagen o video
    });

    return res.status(200).json({
      message: 'Archivo subido exitosamente',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return res.status(500).json({ error: 'Error al subir el archivo' });
  }

  cloudinary.uploader.destroy(publicId, { resource_type: 'auto' }, (error, result) => {
    if (error) {
      console.error('Error al eliminar el archivo de Cloudinary:', error);
    } else {
      console.log('Archivo eliminado de Cloudinary:', result);
    }
  });
};
