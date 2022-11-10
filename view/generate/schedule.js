import { scheduleChart, scheduleChartMobile } from '../../modules/text.js';
import { format } from '../../utility/chart-format.js';
import { rowSize } from '../../utility/chart-sizes.js';

// для отображения таблицы при загрузке новых протоколов с результатами
export function viewDesktop(data, title = '') {
	try {
		const tableHeader = scheduleChart.rowDLine + scheduleChart.titles + scheduleChart.rowDLine;
		let body = '';

		data.forEach(row => {
			body =
				body +
				'|' +
				format(String(row.number), rowSize.schedule.desktop.number) +
				format(ternary(row.dateStart), rowSize.schedule.desktop.dateStart) +
				format(row.world, rowSize.schedule.desktop.world) +
				format(row.route, rowSize.schedule.desktop.route) +
				format(row.laps, rowSize.schedule.desktop.laps) +
				format(row.distance, rowSize.schedule.desktop.distance) +
				format(row.ascent, rowSize.schedule.desktop.ascent) +
				format(row.type, rowSize.schedule.desktop.type) +
				format(row.link, rowSize.schedule.desktop.link) +
				`\n`;
		});
		return `${title}\n${tableHeader}${body}${scheduleChart.rowDLine}`;
	} catch (error) {
		console.log(error);
	}
}

export function generateView(data, title = '') {
	try {
		let body = '';

		data.forEach(row => {
			let emoji = row.dateStart < new Date().getTime() ? '✅' : '❗';
			body = `${body}${emoji} <u>${ternary(row.dateStart)} Этап №${row.number}</u>\nМир: <i>${
				row.world
			}</i>, маршрут: <i>${row.route}</i>, кругов <i>${row.laps}</i>, <i>${
				row.distance
			}км</i>, <i>${row.ascent}м</i>, тип заезда: <i>${row.type}</i>, <a href="${
				row.link
			}">Zwift</a>\n\n`;
		});
		return `🏆 <b>${title}</b> 🏆\n\n${body}`;
	} catch (error) {
		console.log(error);
	}
}

function ternary(date) {
	return typeof date == 'number' ? new Date(date).toLocaleDateString() : date;
}
