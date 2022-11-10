import { format } from '../../utility/chart-format.js';
import { rowSize } from '../../utility/chart-sizes.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };

export function viewDesktop(data) {
	try {
		const chart = textJson.charts.protocolDl;
		const tableHeader = chart.line + chart.header + chart.line;
		let body = '';

		data.forEach(row => {
			body =
				body +
				'|' +
				format(String(row.placeAbsolute), rowSize.protocolDl.desktop.placeAbsolute) +
				format(row.name, rowSize.protocolDl.desktop.name) +
				format(String(row.timeString), rowSize.protocolDl.desktop.time) +
				format(row.gap ? '+' + row.gap : row.gap, rowSize.protocolDl.desktop.gap) +
				format(String(row.watt), rowSize.protocolDl.desktop.watt) +
				format(String(row.wattPerKg), rowSize.protocolDl.desktop.wattPerKg) +
				format(String(row.weightInGrams), rowSize.protocolDl.desktop.weightInGrams) +
				format(String(row.heightInCentimeters), rowSize.protocolDl.desktop.heightInCentimeters) +
				format(String(row.avgHeartRate), rowSize.protocolDl.desktop.avgHeartRate) +
				format(String(row.gender), rowSize.protocolDl.desktop.gender) +
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
