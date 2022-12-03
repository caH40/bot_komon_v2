export function ruleCategory(watt, wattPerKg, gender) {
	if (gender === 'женский') return 'W';
	if (watt > 263 && wattPerKg > 4.2) return 'A';
	if (watt > 210 && wattPerKg > 3.36) return 'B';
	return 'C';
}
