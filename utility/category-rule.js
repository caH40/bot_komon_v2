export function ruleCategory(watt, wattPerKg, gender, type) {
	if (type === 'tour') {
		if (gender === 'женский' && wattPerKg > 3.69 && (watt > 250 || watt === 250)) return 'WA';
		if (gender === 'женский') return 'WB';
		if ((watt * 0.95 > 250 || watt * 0.95 === 250) && wattPerKg * 0.95 > 3.99) return 'A';
		return 'B';
	}

	if (gender === 'женский' && wattPerKg > 2.99) return 'WA';
	if (gender === 'женский' && wattPerKg < 3) return 'WB';
	if (watt * 0.97 > 249 && wattPerKg * 0.97 > 3.99) return 'A';
	if (watt * 0.97 > 199 && wattPerKg * 0.97 > 3.19) return 'B';
	return 'C';
}
