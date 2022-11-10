export function generateView(totalResult, typePoints) {
	try {
		let body = '';
		totalResult.forEach(result => {
			const teamStr = result.team ? `(${result.team})` : '';
			body = `${body}${result.place}. ${result.name}${teamStr} -	<u>${result[typePoints]}</u>\n`;
		});
		return `${body}`;
	} catch (error) {
		console.log(error);
	}
}
