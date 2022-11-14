import { Scenes } from 'telegraf';

import textJson from '../../locales/ru.json' assert { type: 'json' };
import { riderCategory } from '../../modules/category-update.js';

export const categoryRiderScene = () => {
	try {
		const categoryRide = new Scenes.BaseScene('categoryRider');

		categoryRide.enter(async ctx => {
			await ctx.replyWithHTML(
				`Выбор райдера.\nВведите первые буквы lastname из Zwift. Сформируется список райдеров,  согласно заданному поиску.\n<i>Для выхода нажмите /quit</i> `
			);
		});
		categoryRide.command('quit', async ctx => await ctx.scene.leave());
		categoryRide.on('text', async ctx => {
			await riderCategory(ctx, ctx.message.text);
		});
		return categoryRide;
	} catch (error) {
		console.log(error);
	}
};
