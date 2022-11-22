import { Markup } from 'telegraf';
import { Series } from '../../Model/Series.js';
import { scheduleKeyboard, seriesKeyboard } from '../keyboard.js';

export async function scheduleBtn() {
	try {
		const seriesDB = await Series.find();
		const seriesSorted = seriesDB.sort((a, b) => b.dateStart - a.dateStart);
		return scheduleKeyboard(seriesSorted);
	} catch (error) {
		console.log(error);
	}
}
export async function seriesBtn() {
	try {
		const seriesDB = await Series.find();
		const seriesSorted = seriesDB.sort((a, b) => b.dateStart - a.dateStart);
		return seriesKeyboard(seriesSorted);
	} catch (error) {
		console.log(error);
	}
}
export async function resultSeriesBtn(cbqData) {
	try {
		const seriesId = cbqData.slice(9);
		const { hasGeneral, hasTeams } = await Series.findOne({ _id: seriesId });

		const buttons = [
			[Markup.button.callback('Результаты этапов 📝', `result_Stages_${seriesId}`)],
			hasGeneral ? [Markup.button.callback('Генеральный зачет 👑', `m_1_all_2__${seriesId}`)] : [],
			hasTeams ? [Markup.button.callback('Командный зачет 🤝', `m_1_all_3_E__${seriesId}`)] : [],
			hasGeneral
				? [
						Markup.button.webApp(
							'Спринтерский зачет ⚡',
							`${process.env.SERVER}/results/sprint/S${seriesId}`
						),
				  ]
				: [],
			hasGeneral
				? [
						Markup.button.webApp(
							'Горный зачет 🏔️',
							`${process.env.SERVER}/results/mountain/M${seriesId}`
						),
				  ]
				: [],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
		return buttons;
	} catch (error) {
		console.log(error);
	}
}
