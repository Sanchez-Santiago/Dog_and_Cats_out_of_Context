import { Router } from 'express';
import { MovieController } from '../controller/movieController.js';
const movieRouter = ({ MovieModel }) => {
    const router = Router();
    const movieController = new MovieController({ MovieModel });
  
    router.get("/movie", movieController.getAll);
    router.get("/movie/name", movieController.getName);
    router.get("/movie/:id", movieController.getById);
    router.post("/movie", movieController.create);
    router.put("/movie/:id", movieController.update);
    router.delete("/movie/:id", movieController.delete);
  
    return router;
  };
  
  export default movieRouter; // 👈 default export
  