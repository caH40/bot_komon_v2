// Группа С - 2.5+ вт/кг, и/или 170ватт фтп
// Группа B - 3.2+ вт/кг, и/или 230ватт фтп
// Группа А - 4.0+ вт/кг, и/или 280ватт фтп
// Группа W - 1-6 вт/кг Женская лига

export function ruleCategory(watt, wattPerKg, gender) {
	try {
		if (gender === 'женский') return 'W';
		if (watt > 279 || wattPerKg > 3.99) return 'A';
		if (watt > 229 || wattPerKg > 3.19) return 'B';
		if (watt > 169 || wattPerKg > 2.49) return 'C';
		return 'D';
	} catch (error) {
		console.log(error);
	}
}
