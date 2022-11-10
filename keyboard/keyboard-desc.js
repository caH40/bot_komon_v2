import { Markup } from 'telegraf';

export function descriptionKeyboard() {
	const urlGDocs =
		'https://docs.google.com/spreadsheets/d/1c-pGPhXolep2_cRYtHoRGhyRjLDMFJIxX5WifOM_oqo/edit#gid=0';
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.url('Результаты в GoogleDocs 📈', urlGDocs)],
			[Markup.button.callback('Описание и правила Series 📕', `m_4_2`)],
			[Markup.button.callback('Описание и правила Crit Race 📓', `m_4_3`)],
			[Markup.button.callback('Описание и правила Catch Up Race 📒', `m_4_4`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};

	return keyboard;
}
