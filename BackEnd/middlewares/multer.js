// middlewares/multer.js
import multer from 'multer';
const storage = multer.memoryStorage(); // o diskStorage si querés guardarlo
export const upload = multer({ storage });
