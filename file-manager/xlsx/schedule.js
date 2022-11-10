import path from 'path';
import XLSX from 'xlsx';

export async function getExcel(ctx, fileName) {
	try {
		const __dirname = path.resolve();

		var book = XLSX.readFile(path.resolve(__dirname, 'src/schedule/', `./${fileName}`));

		const sheetStages = book.Sheets['stages'];
		if (!sheetStages) {
			await ctx.reply(`В книге нет страницы "stages"!`);
			return;
		}

		const keysStages = Object.keys(sheetStages);
		const rowTitleStages =
			getCellTitle(keysStages, sheetStages, 'Ссылка на заезд в Звифте').slice(1) - 1;
		const totalStages = XLSX.utils.sheet_to_json(sheetStages, {
			range: rowTitleStages,
			raw: false,
		});

		const totalClearStages = totalStages.map(elm => {
			return {
				number: elm['Этап'],
				dateStart: elm['Дата'],
				timeStart: elm['Время'],
				world: elm['Мир'],
				route: elm['Маршрут'],
				laps: elm['Количество кругов'],
				distance: elm['Общая протяженность, км'],
				ascent: elm['Общий набор высоты, м'],
				type: elm['Тип заезда'],
				link: elm['Ссылка на заезд в Звифте'],
			};
		});

		//получение данных со странице Серии
		const sheetSeries = book.Sheets['series'];
		if (!sheetSeries) {
			await ctx.reply(`В книге нет страницы "series"!`);
			return;
		}

		const keysSeries = Object.keys(sheetSeries);
		const rowTitleSeries = getCellTitle(keysSeries, sheetSeries, 'Наименование серии').slice(1) - 1;
		const totalSeries = XLSX.utils.sheet_to_json(sheetSeries, {
			range: rowTitleSeries,
			raw: false,
		});

		const totalClearSeries = totalSeries.map(elm => {
			return {
				name: elm['Наименование серии'],
				dateStart: elm['Дата старта'],
				description: elm['Описание'],
				type: elm['Тип'],
				organizer: elm['Организатор'],
				hasGeneral: elm['Генеральный зачет'] === 'да' ? true : false,
				hasTeams: elm['Командный зачет'] === 'да' ? true : false,
			};
		});

		return { totalClearStages, totalClearSeries };
	} catch (error) {
		console.log(error);
	}
}

function getCellTitle(keys, sheet, title) {
	try {
		for (let i = 0; i < keys.length; i++) {
			if (sheet[keys[i]].v === title) {
				let cellTitle = keys[i];
				return cellTitle;
			}
		}
	} catch (error) {
		console.log(error);
	}
}
