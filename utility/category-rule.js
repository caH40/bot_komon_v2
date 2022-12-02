export function ruleCategory(watt, wattPerKg, gender) {
	if (gender === 'женский') return 'W';
	if (watt > 249 && wattPerKg > 3.99) return 'A';
	if (watt > 199 && wattPerKg > 3.19) return 'B';
	return 'C';
}
