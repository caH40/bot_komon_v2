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
	postAddResult,
	getTeamsPoints,
	postClick,
	getStatisticsRiders,
	getStatisticsStages,
	getFeedback,
	postFeedback,
	getTeams,
	getRiders,
	postDisqualification,
	authenticate,
	postUnderChecking,
	getGeneralTour,
	postProfile,
} from '../controllers/controllers.js';
import {
	postSeries,
	postSeriesOne,
	postStages,
	postStage,
	postZpDisqualification,
	postZpUnderChecking,
	postZpPenalty,
	postZpCategory,
	postZpPoints,
	postZpSeriesChanged,
} from '../controllers/zwift-power.js';

export const router = new Router();

router.get('*', mainPage);
router.post('/api/authenticate', authenticate);
router.post('/api/results/stage', resultsStage);
router.post('/api/user/get-settings', getRiderSettings);
router.post('/api/user/post-settings', postRiderSettings);
router.post('/api/stage/post-edit', postStageEdit);
router.post('/api/stage/points', postStagePoints);
router.post('/api/stage/penalty', postStagePenalty);
router.post('/api/stage/add-result', postAddResult);
router.post('/api/results/general', getGeneralPoints);
router.post('/api/results/general-tour', getGeneralTour);
router.post('/api/results/mountain', getMountainPoints);
router.post('/api/results/sprint', getSprintPoints);
router.post('/api/results/teams', getTeamsPoints);
router.post('/api/clicks', postClick);
router.post('/api/statistics/riders', getStatisticsRiders);
router.post('/api/statistics/stages', getStatisticsStages);
router.post('/api/feedback', getFeedback);
router.post('/api/post-feedback', postFeedback);
router.post('/api/teams', getTeams);
router.post('/api/riders', getRiders);
router.post('/api/disqualification', postDisqualification);
router.post('/api/underchecking', postUnderChecking);
router.post('/api/profile', postProfile);

router.post('/api/series', postSeries);
router.post('/api/seriesone', postSeriesOne);
router.post('/api/stages', postStages);
router.post('/api/stage', postStage);
router.post('/api/zp/disqualification', postZpDisqualification);
router.post('/api/zp/underchecking', postZpUnderChecking);
router.post('/api/zp/stage/penalty', postZpPenalty);
router.post('/api/zp/stage/change-category', postZpCategory);
router.post('/api/zp/stage/points', postZpPoints);
router.post('/api/zp/series-changed', postZpSeriesChanged);
