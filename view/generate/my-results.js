export function generateView(data) {
	try {
		let body = '';

		data.forEach(row => {
			body = `${body}${row.sequenceNumber}. <u>${row.dateStart}</u>;\n🚴‍♀️ ${row.nameSeries};\n📢 Этап: №${row.stageNumber};\n🔁 Маршрут: ${row.stageRoute};\n🏁 Время: ${row.time};\n🏅 Место в абсолюте: ${row.placeAbsolute}.\n\n`;
		});
		return body;
	} catch (error) {
		console.log(error);
	}
}
