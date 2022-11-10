import { Scenes } from 'telegraf';
import { deleteFile } from '../../file-manager/file-delete.js';
import { getExcel } from '../../file-manager/xlsx/schedule.js';
import { text } from '../../modules/text.js';
import { divisionChart } from '../../utility/chart-division.js';
import { viewDesktop } from '../../view/generate/schedule.js';
import { viewDesktopSeries } from '../../view/generate/series.js';

const { leave } = Scenes.Stage;

// проверка данных из файла xlsx и загрузка в базу данных
export const uploadScheduleBase = () => {
	try {
		const upload = new Scenes.BaseScene('uploadSchedule');
		upload.enter(async ctx => await enter(ctx));
		upload.command('quit', leave('uploadSchedule'));
		upload.on('text', async ctx => await ctx.reply(text.wrong));

		return upload;
	} catch (error) {
		console.log(error);
	}
};

async function enter(ctx) {
	try {
		const fileName = ctx.session.data.fileName;
		await ctx.reply(text.upload.enter);
		const dataXlsx = await getExcel(ctx, fileName);
		if (!dataXlsx?.totalClearStages) {
			await ctx.reply(text.upload.wrong);
			deleteFile(fileName, ctx.session.data.dlPath);
			await ctx.reply(`Файл ${fileName} удален!`);
			return await ctx.scene.enter('downloadSchedule');
		}

		ctx.session.data.schedule = dataXlsx.totalClearStages;
		ctx.session.data.series = dataXlsx.totalClearSeries;

		const charts = divisionChart(dataXlsx.totalClearStages);

		for (let i = 0; i < charts.length; i++) {
			await ctx.replyWithHTML('<pre>' + viewDesktop(charts[i]) + '</pre>');
		}
		await ctx.replyWithHTML('<pre>' + viewDesktopSeries(dataXlsx.totalClearSeries) + '</pre>');
		ctx.scene.enter('confirmUploadSchedule');
	} catch (error) {
		console.log(error);
	}
}
