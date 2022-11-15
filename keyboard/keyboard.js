import 'dotenv/config';

import { Markup } from 'telegraf';
import { accountButtons } from './button/accaunt.js';
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
			...series.map(elm => [Markup.button.callback(`${elm.name} 🚵‍♀️`, 'm_1_all__' + elm._id)]),
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
			...series.map(elm => [Markup.button.callback(`${elm.name} 🚵‍♀️`, 'm_2_all__' + elm._id)]),
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
export function resultStageCatKeyboard(stageId) {
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
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}
export function teamLeaveKeyboard(userId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Да, хочу выйти из команды ❌', `m_3_2_4_1_E--teamLeave_${userId}`)],
			[Markup.button.callback('<< назад >>', `m_3_2_`)],

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
			[Markup.button.callback('Удаление команды ❌❌', `m_3_2_5_4_E`)],
			[Markup.button.callback('<< назад >>', `m_3_2_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}
export function resultSeriesGeneralKeyboard(seriesId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Группа "A" 💪', `m_1_all_2_all_A_${seriesId}`)],
			[Markup.button.callback('Группа "B" 👊', `m_1_all_2_all_B_${seriesId}`)],
			[Markup.button.callback('Группа "C" ✌️', `m_1_all_2_all_C_${seriesId}`)],
			[Markup.button.callback('Группа "W" 👍', `m_1_all_2_all_W_${seriesId}`)],
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
		[Markup.button.callback('Спринт и горный зачеты 💨', 'm_5_6_')],
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
		[Markup.button.callback('Выбор райдера', 'm_5_4_1_')],
		[Markup.button.callback('Выбор заезда', 'm_5_4_2_')],
		[Markup.button.callback('Главное меню ❗️', 'main')],
	]),
};

export function adminCatRidersKeyboard(riderId) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[
				Markup.button.callback('A', `m_5_4_1_E__A_${riderId}`),
				Markup.button.callback('B', `m_5_4_1_E__B_${riderId}`),
				Markup.button.callback('C', `m_5_4_1_E__C_${riderId}`),
			],
		]),
	};
}
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
export function pointsSMSeriesKeyboard(series) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...series.map(ser => [Markup.button.callback(`${ser.name} 🏁`, `m_5_6_all__${ser._id}`)]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}

export function pointsSMStageKeyboard(stages) {
	return {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...stages.map(stage => [
				Markup.button.callback(
					`Этап №${stage.number}, ${stage.type} 🏁`,
					`m_5_6_all_all__${stage._id}`
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
			[Markup.button.callback('<< назад >>', `m_5_6_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};
}

// меню выбора результатов этапов серии
export function resultStagesKeyboard(series) {
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			...series.map(stage => [
				Markup.button.callback(
					`Этап ${stage.number}, ${new Date(stage.dateStart).toLocaleDateString()}, ${
						stage.type
					} 🏁`,
					`stage_${stage._id}`
				),
			]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};

	return keyboard;
}
export const clearCharts = {
	parse_mode: 'html',
	...Markup.inlineKeyboard([[Markup.button.callback('Очистить сообщения', `clear`)]]),
};

export function mobVsDesKeyboard(queryData) {
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[
				Markup.button.callback('Десктоп 💻', `Des_${queryData}`),
				Markup.button.callback('Смартфон 📱', `Mob_${queryData}`),
			],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};

	return keyboard;
}
