export function ruleCategory(watt, wattPerKg, gender) {
	if (gender === 'женский' && wattPerKg > 2.99) return 'WA';
	if (gender === 'женский' && wattPerKg < 3) return 'WB';
	if (watt * 0.97 > 249 && wattPerKg * 0.97 > 3.99) return 'A';
	if (watt * 0.97 > 199 && wattPerKg * 0.97 > 3.19) return 'B';
	return 'C';
}
