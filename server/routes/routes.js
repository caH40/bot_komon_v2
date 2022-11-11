import { Router } from 'express';
import { mainPage, resultsStage } from '../controllers/controllers.js';

export const router = new Router();

router.get('*', mainPage);
router.get('/api/results/stage', resultsStage);
