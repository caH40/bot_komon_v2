export function generateView(data, series) {
	try {
		let body = '';
		let title = `Командный зачет ${series}\nГруппа <u>"${data[0]?.category}"</u>:`;

		data.forEach(row => {
			body = `${body}${row.place}. ${row.name} - <u>${row.points}</u>\n`;
		});

		return `<b>${title}</b>\n${body}`;
	} catch (error) {
		console.log(error);
	}
}
