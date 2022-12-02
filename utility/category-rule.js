// Группа D переходит в С

export function ruleCategory(watt, wattPerKg, gender) {
	try {
		if (gender === 'женский') return 'W';

		if (watt > 249 && wattPerKg > 3.99) return 'A';
		if (watt > 200 && wattPerKg > 3.19) return 'B';
		return 'C';
	} catch (error) {
		console.log(error);
	}
}
