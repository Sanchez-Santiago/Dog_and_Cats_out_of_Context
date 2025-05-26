import { Router } from 'express';
import { MovieController } from '../controller/movieController.js';
const movieRouter = ({ MovieModel, connectionCloudinary }) => {
    const router = Router();
    const movieController = new MovieController({ MovieModel , connectionCloudinary });
  
    router.get("/", movieController.getAll);
    router.get("/name/:name", movieController.getName);
    router.get("/:id", movieController.getById);
    router.post("/", movieController.create);
    router.put("/:id", movieController.update);
    router.delete("/:id", movieController.delete);
  
    return router;
  };
  
  export default movieRouter; // 👈 default export
  