import { Rider } from '../Model/Rider.js';

export async function start(ctx) {
	try {
		await ctx.deleteMessage();
		const userName = ctx.message.from.first_name;
		const telegramId = ctx.message.from.id;
		const riderDB = await Rider.findOne({ telegramId });

		const welcomeStr = riderDB
			? ''
			: '❗ Если Вы участвуете в заездах от команды <b>KOM-on</b>, то необходимо зарегистрироваться в боте для корректного подсчета очков. 🤝\n';

		ctx.replyWithHTML(
			`<b>Привет ${
				userName ? userName + '! 🤗' : 'незнакомец!'
			}</b>\n${welcomeStr}📜 Предоставляю информацию о заездах в Звифт, организуемых командой <b>KOM-on</b>.\nДля запуска /main`,
			{
				parse_mode: 'html',
				disable_web_page_preview: true,
			}
		);
	} catch (error) {
		console.log(error);
	}
}
