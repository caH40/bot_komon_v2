import { Router } from 'express';
import {
	mainPage,
	resultsStage,
	getRiderSettings,
	postRiderSettings,
	postStageEdit,
	postStagePoints,
	getGeneralPoints,
	getMountainPoints,
	getSprintPoints,
	postStagePenalty,
	getTeamsPoints,
} from '../controllers/controllers.js';

export const router = new Router();

router.get('*', mainPage);
router.post('/api/results/stage', resultsStage);
router.post('/api/user/get-settings', getRiderSettings);
router.post('/api/user/post-settings', postRiderSettings);
router.post('/api/stage/post-edit', postStageEdit);
router.post('/api/stage/points', postStagePoints);
router.post('/api/stage/penalty', postStagePenalty);
router.post('/api/results/general', getGeneralPoints);
router.post('/api/results/mountain', getMountainPoints);
router.post('/api/results/sprint', getSprintPoints);
router.post('/api/results/teams', getTeamsPoints);
