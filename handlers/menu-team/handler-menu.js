import { teamRemoveRiderDB } from '../../controllersDB/team-del-rider.js';
import {
	teamAddRider,
	teamApprovalRider,
	teamCreate,
	teamDescription,
	teamJoin,
	teamLeave,
	teamMain,
	teamManagement,
	teamRemove,
	teamRemoveRider,
	teamWait,
} from './helper.js';

export async function handlerTeam(ctx, cbqData) {
	try {
		if (!cbqData.includes('m_3_2_')) return;

		if (cbqData === 'm_3_2_') return await teamMain(ctx);
		if (cbqData === 'm_3_2_2_') return await teamJoin(ctx);
		if (cbqData === 'm_3_2_3_S__create') return await teamCreate(ctx);
		if (cbqData === 'm_3_2_4_') return await teamLeave(ctx);
		if (cbqData === 'm_3_2_5_') return await teamManagement(ctx);
		if (cbqData === 'm_3_2_5_1_') return await teamAddRider(ctx);
		if (cbqData === 'm_3_2_5_2_') return await teamRemoveRider(ctx);
		if (cbqData === 'm_3_2_5_3_') return await teamDescription(ctx);
		if (cbqData.includes('m_3_2_5_1_add_')) return await teamApprovalRider(ctx, cbqData);
		if (cbqData.includes('m_3_2_5_2_E_')) return await teamRemoveRiderDB(ctx, cbqData);
		if (cbqData === 'm_3_2_5_4_E') return await teamRemove(ctx, cbqData);
		if (cbqData === 'm_3_2_0_wait') return await teamWait(ctx, cbqData);
	} catch (error) {
		console.log(error);
	}
}
