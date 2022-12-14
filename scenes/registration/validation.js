import validator from 'validator';
import { Rider } from '../../Model/Rider.js';

export function validationNameRus(text) {
	try {
		if (
			validator.isAlpha(text, 'ru-RU', { ignore: '-' }) &&
			validator.isLength(text, { min: 2, max: 36 })
		) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}

export function validationYear(text) {
	try {
		if (validator.isLength(text, { min: 4, max: 4 })) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}

export function validationGender(text) {
	try {
		if (text === 'мужской' || text === 'женский') {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}

export function validationNameEn(text) {
	try {
		if (!validator.isAlpha(text, 'ru-RU') && validator.isLength(text, { min: 1, max: 30 })) {
			// if (validator.isAlphanumeric(text, 'en-US') && validator.isLength(text, { min: 1, max: 15 })) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}
export function validationLink(text) {
	try {
		if (text.includes('zwiftpower.com/profile') && !text.includes('номер')) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}
export async function checkZwiftId(zwiftId, zwiftIdRiderWithUpdating) {
	try {
		const riderDB = await Rider.findOne({ zwiftId });
		if (riderDB?.zwiftId === zwiftIdRiderWithUpdating) return true;
		if (riderDB) return false;
		return true;
	} catch (error) {
		console.log(error);
	}
}
