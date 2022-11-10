import { Scenes } from 'telegraf';

import { deleteFile } from '../../file-manager/file-delete.js';
import { scheduleToDB } from '../../controllersDB/schedule-save.js';
import { textSchedule } from '../../modules/text.js';

export const confirmUploadScheduleScene = () => {
	try {
		const confirmScene = new Scenes.BaseScene('confirmUploadSchedule');
		confirmScene.enter(async ctx => await ctx.reply(textSchedule.confirm.enter));
		confirmScene.command('confirm', async ctx => {
			await ctx.reply(textSchedule.confirm.successfully);
			//сохранение данных в БД
			await scheduleToDB(ctx.session.data.series, ctx.session.data.schedule);

			await ctx.scene.leave('confirmUploadSchedule');
		});
		confirmScene.command('quit', async ctx => {
			await ctx.reply(textSchedule.confirm.quit);
			deleteFile(ctx.session.data.fileName, ctx.session.data.dlPath);
			await ctx.scene.leave('confirmUploadSchedule');
		});
		confirmScene.on('text', async ctx => await ctx.reply(textSchedule.confirm.wrong));
		return confirmScene;
	} catch (error) {
		console.log(error);
	}
};
