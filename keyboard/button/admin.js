import { Markup } from 'telegraf';

export async function buttonCatRiders(ctx) {
	try {
		return [
			[Markup.button.callback('Результаты заездов 🏆', 'm_1_')],
			[Markup.button.callback('Расписание заездов 📅', 'main_schedule')],
			[Markup.button.callback('Личный кабинет 🔑', 'm_3_')],
			[Markup.button.callback('Полезная информация ⚠️', 'm_4_')],
		];
	} catch (error) {
		console.log(error);
	}
}
export function buttonCatFromStageRiders(stages) {
	try {
		return [
			...stages.map(stage => [
				Markup.button.callback(
					`${stage.seriesId.name}, Этап ${stage.number}, ${stage.type},   ${new Date(
						stage.dateStart
					).toLocaleDateString()} ⚠️`,
					`m_5_4_2_E__${stage._id}`
				),
			]),

			[Markup.button.callback('<< назад >>', `m_5_4_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
	} catch (error) {
		console.log(error);
	}
}
