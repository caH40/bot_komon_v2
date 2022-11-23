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
			const emoji = row.dateStart < new Date().getTime() ? '✅' : '❗';
			const stageStr = row.number ? `Этап №${row.number}` : '';
			const worldStr = row.world ? `Мир: <b>${row.world}</b>, ` : '';
			const routeStr = row.route ? `<a href="${row.routeLink}">${row.route}</a>, ` : '';
			const lapsStr = row.laps ? `кругов <b>${row.laps}</b>, ` : '';
			const distanceStr = row.distance ? `дистанция <b>${row.distance}км</b>, ` : '';
			const ascentStr = row.ascent ? `общий набор высоты <b>${row.ascent}м</b>, ` : '';
			const typeStr = row.type ? `тип заезда: <b>${row.type}</b>, ` : '';
			const linkStr = row.link ? `<a href="${row.link}">регистрация в Звифте</a>` : '';

			body = `${body}${emoji} <u>${ternary(
				row.dateStart
			)} ${stageStr}</u>\n${worldStr}${routeStr}${lapsStr}${distanceStr}${ascentStr}${typeStr}${linkStr}\n\n`;
		});
		return `🏆 <b>${title}</b> 🏆\n\n${body}`;
	} catch (error) {
		console.log(error);
	}
}

function ternary(date) {
	return typeof date == 'number' ? new Date(date).toLocaleDateString() : date;
}
