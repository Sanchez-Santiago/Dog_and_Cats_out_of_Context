import { Router } from 'express';
import { MovieController } from '../controller/movieController.js';
import { upload } from '../middlewares/multer.js';

const movieRouter = ({ MovieModel, connectionCloudinary }) => {
    const router = Router();
    const movieController = new MovieController({ MovieModel , connectionCloudinary });
  
    router.get("/", movieController.getAll);
    router.get("/name/:name", movieController.getName);
    router.get("/:id", movieController.getById);
    router.post("/", upload.single('movie'), movieController.create); 
    router.put("/:id", upload.single('movie'), movieController.update);
    router.delete("/:id", movieController.delete);
  
    return router;
  };
  
  export default movieRouter; // 👈 default export
  