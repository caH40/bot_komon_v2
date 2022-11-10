import { format } from '../../utility/chart-format.js';
import { rowSize } from '../../utility/chart-sizes.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };

export function viewDesktopTotal(data) {
	try {
		const chart = textJson.charts.protocolTotal;

		const tableHeader = chart.line + chart.header + chart.line;
		let body = '';

		data.forEach(row => {
			const category = row.riderId ? row.riderId.category : row.categoryCurrent;
			body =
				body +
				'|' +
				format(String(row.placeAbsolute), rowSize.protocolTotal.desktop.placeAbsolute) +
				format(row.name, rowSize.protocolTotal.desktop.name) +
				format(row.teamCurrent, rowSize.protocolTotal.desktop.teamCurrent) +
				format(String(row.time), rowSize.protocolTotal.desktop.time) +
				format(row.gap === '00:00' ? '' : '+' + row.gap, rowSize.protocolTotal.desktop.gap) +
				format(
					row.gapPrev ? '+' + row.gapPrev : row.gapPrev,
					rowSize.protocolTotal.desktop.gapPrev
				) +
				format(category, rowSize.protocolTotal.desktop.category) +
				format(String(row.placeCategory), rowSize.protocolTotal.desktop.placeCategory) +
				format(String(row.watt), rowSize.protocolTotal.desktop.watt) +
				format(String(row.wattPerKg), rowSize.protocolTotal.desktop.wattPerKg) +
				format(String(row.weightInGrams), rowSize.protocolTotal.desktop.weightInGrams) +
				format(String(row.heightInCentimeters), rowSize.protocolTotal.desktop.heightInCentimeters) +
				format(String(row.avgHeartRate), rowSize.protocolTotal.desktop.avgHeartRate) +
				`\n`;
		});
		return `${tableHeader}${body}${chart.line}`;
	} catch (error) {
		console.log(error);
	}
}
export function viewMobileTotal(data) {
	try {
		let body = '';

		data.forEach(row => {
			let nameStr = row.riderId ? `${row.riderId.lastName} ${row.riderId.firstName}` : row.name;
			const category = row.riderId ? row.riderId.category : row.categoryCurrent;
			body = `${body}${row.placeAbsolute}. ${nameStr} (${category}) - <u>${row.time}</u>\n`;
		});
		return body;
	} catch (error) {
		console.log(error);
	}
}
