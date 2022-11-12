// Группа D переходит в С

export function ruleCategory(watt, wattPerKg, gender) {
	try {
		if (gender === 'женский') return 'W';

		if (
			(watt > 279 && wattPerKg > 3.84) ||
			(watt > 289 && wattPerKg > 3.74) ||
			(watt > 299 && wattPerKg > 3.64) ||
			wattPerKg > 3.99
		)
			return 'A';

		if (
			(watt > 259 && wattPerKg > 2.89) ||
			(watt > 249 && wattPerKg > 2.99) ||
			(watt > 239 && wattPerKg > 3.09) ||
			wattPerKg > 3.19
		)
			return 'B';

		if (watt > 100) return 'C';

		return 'D';
	} catch (error) {
		console.log(error);
	}
}
