import { Scenes } from 'telegraf';
import { getFileTelegram } from '../../file-manager/file-get.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };

export const downloadProtocolBase = () => {
	try {
		const protocol = new Scenes.BaseScene('getProtocol');
		protocol.enter(async ctx => {
			await ctx.reply(textJson.scenes.download.enter);
		});

		protocol.on('document', async ctx => {
			//путь на сервере для хранения полученного файла
			const dlPath = 'src/';
			ctx.session.data.dlPath = dlPath;
			const isRight = await getFileTelegram(ctx, dlPath);
			if (isRight) await ctx.scene.enter('uploadProtocol');
		});

		protocol.command('quit', async ctx => await ctx.scene.leave('getProtocol'));
		protocol.on('text', async ctx => await ctx.reply(textJson.scenes.download.wrong));
		return protocol;
	} catch (error) {
		console.log(error);
	}
};
