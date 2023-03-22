import { Markup } from 'telegraf';

export function descriptionKeyboard() {
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.callback('Результаты в GoogleDocs 📈', 'm_4_1')],
			[Markup.button.callback('Описание и правила Series 📕', `m_4_2`)],
			[Markup.button.callback('Описание и правила Crit Race 📓', `m_4_3`)],
			[Markup.button.callback('Описание и правила Catch Up Race 📒', `m_4_4`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};

	return keyboard;
}

export function googleDocsKeyboard() {
	const urlGDocsAutumn =
		'https://docs.google.com/spreadsheets/d/1c-pGPhXolep2_cRYtHoRGhyRjLDMFJIxX5WifOM_oqo/edit#gid=0';
	const urlGDocsWinter =
		'https://docs.google.com/spreadsheets/d/1DmLtPGw0lX66mSs9a2debCl8A49cKv1Vmav6uCHtKmk/edit#gid=1956054813';
	const urlGDocsSpring =
		'https://docs.google.com/spreadsheets/d/1j5svSY-k9K2MWoVnUW9_m0HmQAG5EjEEvOxY-Y9sENY/edit#gid=1956054813';
	const keyboard = {
		parse_mode: 'html',
		...Markup.inlineKeyboard([
			[Markup.button.url('Spring Race series 2023 🌳', urlGDocsSpring)],
			[Markup.button.url('Winter Race series 2022 ⛄️', urlGDocsWinter)],
			[Markup.button.url('Autumn Race series 2022 🍂', urlGDocsAutumn)],
			[Markup.button.callback('Назад 🔙 ', `m_4_`)],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		]),
	};

	return keyboard;
}
