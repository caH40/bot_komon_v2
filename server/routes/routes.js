import { Router } from 'express';
import {
	mainPage,
	resultsStage,
	getRiderSettings,
	postRiderSettings,
	postStageEdit,
	postStagePoints,
} from '../controllers/controllers.js';

export const router = new Router();

router.get('*', mainPage);
router.post('/api/results/stage', resultsStage);
router.post('/api/user/get-settings', getRiderSettings);
router.post('/api/user/post-settings', postRiderSettings);
router.post('/api/stage/post-edit', postStageEdit);
router.post('/api/stage/points', postStagePoints);
