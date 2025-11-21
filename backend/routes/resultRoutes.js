import express from 'express';
import { createResult, listResult } from '../controllers/resultController.js';
import authMiddleware from "../middlewares/auth.js";

const resultRouter = express.Router();

resultRouter.post('/',authMiddleware,createResult);
resultRouter.get('/',authMiddleware,listResult );

export default resultRouter;