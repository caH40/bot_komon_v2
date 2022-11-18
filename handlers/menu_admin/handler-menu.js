import {
	adminCategoriesKeyboard,
	adminKeyboard,
	adminTeamKeyboard,
} from '../../keyboard/keyboard.js';
import { assignCategoryRiderFromStage } from '../../modules/category-update.js';
import {
	approvalTeam,
	categoryRiderFromStage,
	pointsSeries,
	editDataSeries,
	editDataStages,
	requestTeam,
	updatePointsSeries,
} from './helper.js';

export async function handlerAdmin(ctx, cbqData) {
	try {
		if (cbqData === 'm_5_')
			return await ctx.editMessageText('<b>🛠️ Админ кабинет.</b>', adminKeyboard);
		if (cbqData === 'm_5_1_')
			return await ctx.editMessageText('<b>🛠️ Управление командами</b>', adminTeamKeyboard);
		if (cbqData === 'm_5_4_')
			return await ctx.editMessageText(
				'<b>🛠️ Установка категорий райдерам</b>',
				adminCategoriesKeyboard
			);

		if (cbqData === 'm_5_1_1_E') return await requestTeam(ctx);
		if (cbqData === 'm_5_4_2_') return await categoryRiderFromStage(ctx);
		if (cbqData.includes('m_5_4_2_E')) return await assignCategoryRiderFromStage(ctx, cbqData);
		if (cbqData.includes('m_5_team_add_')) return await approvalTeam(ctx, cbqData);
		if (cbqData === 'm_5_5_') return await pointsSeries(ctx);
		if (cbqData.includes('m_5_5_E__')) return await updatePointsSeries(ctx, cbqData);
		if (cbqData === 'm_5_6_') return await editDataSeries(ctx);
		if (cbqData.includes('m_5_6_all__')) return await editDataStages(ctx, cbqData);
		// if (cbqData === 'm_5_6_') return await pointsSMSeries(ctx);
		// if (cbqData.includes('m_5_6_all__')) return await pointsSMStage(ctx, cbqData);
		// if (cbqData.includes('m_5_6_all_all__')) return await pointsSM(ctx, cbqData);
		// if (cbqData.includes('m_5_6_all_all_1__')) return await pointsSprinter(ctx, cbqData);
		// if (cbqData.includes('m_5_6_all_all_2__')) return await pointsMountain(ctx, cbqData);
	} catch (error) {
		console.log(error);
	}
}
