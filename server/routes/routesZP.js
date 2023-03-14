import { Router } from 'express';

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
	postZpStage,
	postZpStageChanged,
} from '../controllers/zwift-power.js';
import { authAdmin } from '../middleware/authRole.js';

export const routerZP = new Router();

routerZP.post('/api/zp/series', authAdmin, postSeries);
routerZP.post('/api/zp/seriesone', authAdmin, postSeriesOne);
routerZP.post('/api/zp/stages', authAdmin, postStages);
routerZP.post('/api/zp/stage', authAdmin, postStage);
routerZP.post('/api/zp/disqualification', authAdmin, postZpDisqualification);
routerZP.post('/api/zp/underchecking', authAdmin, postZpUnderChecking);
routerZP.post('/api/zp/stage/penalty', authAdmin, postZpPenalty);
routerZP.post('/api/zp/stage/change-category', authAdmin, postZpCategory);
routerZP.post('/api/zp/stage/points', authAdmin, postZpPoints);
routerZP.post('/api/zp/series-changed', authAdmin, postZpSeriesChanged);
routerZP.post('/api/zp/stage', authAdmin, postZpStage);
routerZP.post('/api/zp/stage-changed', authAdmin, postZpStageChanged);
