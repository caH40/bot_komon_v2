import { Router } from 'express';
import { resultsStage } from '../controllers/controllers.js';

export const route = new Router();

route.get('/results/stage', resultsStage);
