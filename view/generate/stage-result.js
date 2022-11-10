import textJson from '../../locales/ru.json' assert { type: 'json' };
import { format } from '../../utility/chart-format.js';
import { rowSize } from '../../utility/chart-sizes.js';

export function viewDesktop(data) {
	try {
		const chart = textJson.charts.protocol;

		const tableHeader = chart.line + chart.header + chart.line;
		let body = '';

		data.forEach(row => {
			body =
				body +
				'|' +
				format(String(row.placeCategory), rowSize.protocol.desktop.placeCategory) +
				format(row.name, rowSize.protocol.desktop.name) +
				format(row.teamCurrent, rowSize.protocol.desktop.teamCurrent) +
				format(String(row.time), rowSize.protocol.desktop.time) +
				format(row.gap === '00:00' ? '' : '+' + row.gap, rowSize.protocol.desktop.gap) +
				format(row.gapPrev ? '+' + row.gapPrev : row.gapPrev, rowSize.protocol.desktop.gapPrev) +
				format(String(row.pointsStage), rowSize.protocol.desktop.pointsStage) +
				format(String(row.watt), rowSize.protocol.desktop.watt) +
				format(String(row.wattPerKg), rowSize.protocol.desktop.wattPerKg) +
				format(String(row.weightInGrams), rowSize.protocol.desktop.weightInGrams) +
				format(String(row.heightInCentimeters), rowSize.protocol.desktop.heightInCentimeters) +
				format(String(row.avgHeartRate), rowSize.protocol.desktop.avgHeartRate) +
				`\n`;
		});
		return `${tableHeader}${body}${chart.line}`;
	} catch (error) {
		console.log(error);
	}
}
export function viewMobile(data) {
	try {
		let body = '';
		data.forEach(row => {
			let nameStr = row.riderId ? `${row.riderId.lastName} ${row.riderId.firstName}` : row.name;
			body = `${body}${row.placeCategory}.	${nameStr} - <u>${row.time}</u>\n`;
		});
		return body;
	} catch (error) {
		console.log(error);
	}
}
