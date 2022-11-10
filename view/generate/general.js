export function generateView(data) {
	try {
		let body = '';
		data.forEach(row => {
			let nameStr = row.firstName ? `${row.lastName} ${row.firstName}` : row.name;
			body = `${body}${row.place}. ${nameStr}	${row.team} -	<u>${row.pointsGeneral}</u>\n`;
		});
		return `${body}`;
	} catch (error) {
		console.log(error);
	}
}
