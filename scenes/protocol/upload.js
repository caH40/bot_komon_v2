import { Scenes } from 'telegraf';
import { deleteFile } from '../../file-manager/file-delete.js';
import { getProtocolFile } from '../../file-manager/xlsx/protocol.js';
import { divisionChart } from '../../utility/chart-division.js';
import { viewDesktop } from '../../view/generate/protocol.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };

const { leave } = Scenes.Stage;

// проверка данных из файла xlsx и загрузка в базу данных
export const uploadProtocolBase = () => {
	try {
		const protocol = new Scenes.BaseScene('uploadProtocol');
		protocol.enter(async ctx => await enter(ctx));
		protocol.command('quit', leave('uploadProtocol'));
		protocol.on('text', async ctx => await ctx.reply(textJson.scenes.download.wrong));

		return protocol;
	} catch (error) {
		console.log(error);
	}
};

async function enter(ctx) {
	try {
		const fileName = ctx.session.data.fileName;
		await ctx.reply(textJson.scenes.download.upload.enter);

		const dataXlsx = await getProtocolFile(ctx, fileName);
		if (!dataXlsx) {
			await ctx.reply(textJson.scenes.download.upload.wrong);
			deleteFile(fileName, ctx.session.data.dlPath);
			await ctx.reply(`Файл ${fileName} удален!`);
			return await ctx.scene.enter('getProtocol');
		}
		ctx.session.data.result = dataXlsx;
		const charts = divisionChart(dataXlsx);

		for (let i = 0; i < charts.length; i++) {
			await ctx.replyWithHTML('<pre>' + viewDesktop(charts[i]) + '</pre>');
		}
		ctx.scene.enter('confirmUploadProtocol');
	} catch (error) {
		console.log(error);
	}
}
