import { Router } from 'express';
import {
	mainPage,
	resultsStage,
	getRiderSettings,
	postRiderSettings,
} from '../controllers/controllers.js';

export const router = new Router();

router.get('*', mainPage);
router.post('/api/results/stage', resultsStage);
router.post('/api/user/get-settings', getRiderSettings);
router.post('/api/user/post-settings', postRiderSettings);
