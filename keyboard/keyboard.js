import 'dotenv/config';

import { Markup } from 'telegraf';
import { getEmojiSeason } from '../utility/seasons.js';
import { accountButtons } from './button/account.js';
import { buttonCatFromStageRiders } from './button/admin.js';
import { mainBtn } from './button/main.js';
import { resultSeriesBtn } from './button/schedule-btn.js';
import { teamBtn, teamsBtn } from './button/team.js';

// главное меню
export async function mainMenuKeyboard(ctx) {
	return { parse_mode: 'html', ...Markup.inlineKeyboard(await mainBtn(ctx)) };
}
export async function accountKeyboard(ctx) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard(await accountButtons(ctx)),
	};
}

export async function teamKeyboard(rider) {
	return { parse_mode: 'html', ...Markup.inlineKeyboard(await teamBtn(rider)) };
}
export function teamForApprovalKeyboard(teamId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			Markup.button.callback('Одобрить', `m_5_team_add_Y_${teamId}`),
			Markup.button.callback('Отклонить', `m_5_team_add_N_${teamId}`),
		]),
	};
}
export function teamAddRiderKeyboard(rider) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			Markup.button.callback('Одобрить', `m_3_2_5_1_add_Y_${rider}`),
			Markup.button.callback('Отклонить', `m_3_2_5_1_add_N_${rider}`),
		]),
	};
}
export function teamRemoveRiderKeyboard(rider) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([Markup.button.callback('Удалить райдера', `m_3_2_5_2_E_${rider}`)]),
	};
}

export function teamsKeyboard(teams) {
	return { parse_mode: 'html', ...Markup.inlineKeyboard(teamsBtn(teams)) };
}

// меню выбора результатов серий main_series
export function seriesKeyboard(series) {
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...series.map(elm => [
				Markup.button.callback(
					`${getEmojiSeason(elm.dateStart)} ${elm.name} 🚴🏻‍♀️`,
					'm_1_all__' + elm._id
				),
			]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
	return keyboard;
}
// меню выбора расписания серий
export function scheduleKeyboard(series) {
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Еженедельные заезды 📌', 'm_2_V')],
			...series.map(elm => [
				Markup.button.callback(
					`${getEmojiSeason(elm.dateStart)} ${elm.name} 🚴🏻‍♀️`,
					'm_2_all__' + elm._id
				),
			]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
	return keyboard;
}
// меню выбора зачетов серии
export async function resultSeriesKeyboard(cbqData) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard(await resultSeriesBtn(cbqData)),
	};
}
export function resultStageCatKeyboard(stageId, seriesId, quantityWomenCategory, type) {
	if (quantityWomenCategory === 1)
		return {
			parse_mode: 'html',
			...Markup.inlineKeyboard([
				[
					Markup.button.webApp(
						'Общий протокол 📌',
						`${process.env.SERVER}/results/stage/T${stageId}`
					),
				],
				[Markup.button.webApp('Группа "A" 💪', `${process.env.SERVER}/results/stage/A${stageId}`)],
				[Markup.button.webApp('Группа "B" 👊', `${process.env.SERVER}/results/stage/B${stageId}`)],
				[Markup.button.webApp('Группа "C" ✌️', `${process.env.SERVER}/results/stage/C${stageId}`)],
				[Markup.button.webApp('Группа "W" 👍', `${process.env.SERVER}/results/stage/W${stageId}`)],
				[Markup.button.callback('Назад 🔙 ', `result_Stages_${seriesId}`)],
				[Markup.button.callback('Главное меню ❗️', 'main')],
			]),
		};
	if (quantityWomenCategory === 2)
		return {
			parse_mode: 'html',
			...Markup.inlineKeyboard([
				[
					Markup.button.webApp(
						'Общий протокол 📌',
						`${process.env.SERVER}/results/stage/T${stageId}`
					),
				],
				[Markup.button.webApp('Группа "A" 💪', `${process.env.SERVER}/results/stage/A${stageId}`)],
				[Markup.button.webApp('Группа "B" 👊', `${process.env.SERVER}/results/stage/B${stageId}`)],
				type === 'tour'
					? []
					: [
							Markup.button.webApp('Группа "C" ✌️', `${process.env.SERVER}/results/stage/C${stageId}`),
					  ],
				[
					Markup.button.webApp(
						'Группа "A (W)" 👍',
						`${process.env.SERVER}/results/stage/WA${stageId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "B (W)" 💪',
						`${process.env.SERVER}/results/stage/WB${stageId}`
					),
				],
				[Markup.button.callback('Назад 🔙 ', `result_Stages_${seriesId}`)],
				[Markup.button.callback('Главное меню ❗️', 'main')],
			]),
		};
}
export function teamLeaveKeyboard(userId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Да, хочу выйти из команды ❌', `m_3_2_4_1_E--teamLeave_${userId}`)],
			[Markup.button.callback('Назад 🔙 ', `m_3_2_`)],

			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}
export function teamManagementKeyboard(userId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Заявки на вступление в команду ✔️', `m_3_2_5_1_`)],
			[Markup.button.callback('Удалить райдера из команды ❌', `m_3_2_5_2_`)],
			[Markup.button.callback('Изменить описание 📝', `m_3_2_5_3_`)],
			[Markup.button.callback('Изменить логотип команды ♻️', `m_3_2_5_4_`)],
			[Markup.button.callback('Удаление команды ❌❌', `m_3_2_5_5_E`)],
			[Markup.button.callback('Назад 🔙 ', `m_3_2_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}
export function resultSeriesGeneralKeyboard(seriesId, quantityWomenCategory) {
	if (quantityWomenCategory === 1)
		return {
			parse_mode: 'html',
			...Markup.inlineKeyboard([
				[
					Markup.button.webApp(
						'Группа "A" 💪',
						`${process.env.SERVER}/results/general/A${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "B" 👊',
						`${process.env.SERVER}/results/general/B${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "C" ✌️',
						`${process.env.SERVER}/results/general/C${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "W" 👍',
						`${process.env.SERVER}/results/general/W${seriesId}`
					),
				],
				[Markup.button.callback('Назад 🔙 ', `m_1_all__${seriesId}`)],
				[Markup.button.callback('Главное меню ❗️', 'main')],
			]),
		};
	if (quantityWomenCategory === 2)
		return {
			parse_mode: 'html',
			...Markup.inlineKeyboard([
				[
					Markup.button.webApp(
						'Группа "A" 💪',
						`${process.env.SERVER}/results/general/A${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "B" 👊',
						`${process.env.SERVER}/results/general/B${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "C" ✌️',
						`${process.env.SERVER}/results/general/C${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "A (W)" 👍',
						`${process.env.SERVER}/results/general/WA${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "B (W)" 💪',
						`${process.env.SERVER}/results/general/WB${seriesId}`
					),
				],
				[
					Markup.button.webApp(
						'Группа "W" (Очки для командного зачета)',
						`${process.env.SERVER}/results/general/WT${seriesId}`
					),
				],
				[Markup.button.callback('Назад 🔙 ', `m_1_all__${seriesId}`)],
				[Markup.button.callback('Главное меню ❗️', 'main')],
			]),
		};
}
export function resultTourGeneralKeyboard(seriesId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[
				Markup.button.webApp(
					'Группа "A" 💪',
					`${process.env.SERVER}/results/general-tour/A${seriesId}`
				),
			],
			[
				Markup.button.webApp(
					'Группа "B" 👊',
					`${process.env.SERVER}/results/general-tour/B${seriesId}`
				),
			],
			[
				Markup.button.webApp(
					'Группа "A (W)" 👍',
					`${process.env.SERVER}/results/general-tour/WA${seriesId}`
				),
			],
			[
				Markup.button.webApp(
					'Группа "B (W)" 💪',
					`${process.env.SERVER}/results/general-tour/WB${seriesId}`
				),
			],
			[
				Markup.button.webApp(
					'Общая таблица 🤝',
					`${process.env.SERVER}/results/general-tour/T${seriesId}`
				),
			],
			[Markup.button.callback('Назад 🔙 ', `m_1_all__${seriesId}`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}
// меню выбора админ кабинета
export const adminKeyboard = {
	parse_mode: 'html',
	...Markup.inlineKeyboard([
		[Markup.button.callback('Управление командами ⚙️', 'm_5_1_')],
		[Markup.button.callback('Загрузить протокол 💾', 'admin_getProtocol')],
		[Markup.button.callback('Загрузить расписание 📄', 'admin_getSchedule')],
		[Markup.button.callback('Установка категорий райдерам 🦾', 'm_5_4_')],
		[Markup.button.callback('Обновление генеральных зачетов 🔄', 'm_5_5_')],
		[Markup.button.callback('Редактирование данных заезда 🔧', 'm_5_6_')],
		[Markup.button.webApp('Зарегистрированные райдеры 📋', `${process.env.SERVER}/riders`)],
		[Markup.button.callback('Главное меню ❗️', 'main')],
	]),
};
export const adminTeamKeyboard = {
	parse_mode: 'html',
	...Markup.inlineKeyboard([
		[Markup.button.callback('Заявки на создание команды', 'm_5_1_1_E')],
		[Markup.button.callback('Удалить команду', 'm_5_1_2_')],
		[Markup.button.callback('Главное меню ❗️', 'main')],
	]),
};
export const adminCategoriesKeyboard = {
	parse_mode: 'html',
	...Markup.inlineKeyboard([
		[Markup.button.callback('Выбор заезда', 'm_5_4_2_')],
		[Markup.button.callback('Главное меню ❗️', 'main')],
	]),
};

export function adminCatRidersFromStageKeyboard(stages) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard(buttonCatFromStageRiders(stages)),
	};
}

export function adminPointsSeriesKeyboard(series) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...series.map(ser => [Markup.button.callback(`${ser.name} 🏁`, `m_5_5_E__${ser._id}`)]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}
export function editDataSeriesKeyboard(series) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...series.map(ser => [Markup.button.callback(`${ser.name} 🏁`, `m_5_6_all__${ser._id}`)]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}

export function editDataStagesKeyboard(stages) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...stages.map(stage => [
				Markup.button.webApp(
					`Этап №${stage.number}, ${stage.type} 🏁`,
					`${process.env.SERVER}/edit/stage/T${stage._id}`
				),
			]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}

export function pointsSMboard(stageId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Распределить спринтерские очки', `m_5_6_all_all_1__${stageId}`)],
			[Markup.button.callback('Распределить горные очки', `m_5_6_all_all_2__${stageId}`)],
			[Markup.button.callback('Назад 🔙 ', `m_5_6_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}

// меню выбора результатов этапов серии
export function resultStagesKeyboard(stages, seriesId) {
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...stages.map(stage => [
				Markup.button.callback(
					`Этап ${stage.number}, ${new Date(stage.dateStart).toLocaleDateString()}, ${
						stage.type
					} 🏁`,
					`stage_${stage._id}`
				),
			]),
			[Markup.button.callback('Назад 🔙 ', `m_1_all__${seriesId}`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};

	return keyboard;
}
export const clearCharts = {
	parse_mode: 'html',
	...Markup.inlineKeyboard([[Markup.button.callback('Очистить сообщения', `clear`)]]),
};
