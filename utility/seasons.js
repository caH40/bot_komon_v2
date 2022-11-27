export function getEmojiSeason(date) {
	const month = new Date(date).getMonth();
	if (month == 2 || month == 3 || month == 4) return '🌳';
	if (month == 11 || month == 0 || month == 1) return '⛄';
	if (month == 5 || month == 6 || month == 7) return '☀️';
	if (month == 8 || month == 9 || month == 10) return '🍂';
}
