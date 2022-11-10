import { seriesChart } from '../../modules/text.js';
import { format } from '../../utility/chart-format.js';
import { rowSize } from '../../utility/chart-sizes.js';

export function viewDesktopSeries(data) {
	try {
		const tableHeader = seriesChart.rowDLine + seriesChart.titles + seriesChart.rowDLine;
		let body = '';

		data.forEach(row => {
			body =
				body +
				'|' +
				format(row.organizer, rowSize.series.desktop.organizer) +
				format(row.name, rowSize.series.desktop.name) +
				format(row.dateStart, rowSize.series.desktop.dateStart) +
				format(row.type, rowSize.series.desktop.type) +
				format(String(row.hasGeneral), rowSize.series.desktop.hasGeneral) +
				format(String(row.hasTeams), rowSize.series.desktop.hasTeams) +
				`\n`;
		});
		return `${tableHeader}${body}${seriesChart.rowDLine}`;
	} catch (error) {
		console.log(error);
	}
}
