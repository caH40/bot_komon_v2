import { Markup } from 'telegraf';

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

			[Markup.button.callback('Назад 🔙 ', `m_5_4_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
	} catch (error) {
		console.log(error);
	}
}
