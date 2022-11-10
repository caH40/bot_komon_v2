export function generateView(riders) {
	try {
		const title = `<b>Команда "${riders[0].teamName}"</b>`;
		let body = '';

		riders.forEach(rider => {
			let name = `${rider.lastName} ${rider.firstName}`;
			body = `${body}${rider.sequence}. ${name}${rider.capitan ? '(A)' : ''}, старты: <u>${
				rider.quantityResults
			}</u>;\n`;
		});
		return `${title}\n${body}`;
	} catch (error) {
		console.log(error);
	}
}
