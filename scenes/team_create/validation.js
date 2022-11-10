import validator from 'validator';

export function validationName(text) {
	try {
		if (validator.isLength(text, { min: 2, max: 30 })) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}
export function validationDescription(text) {
	try {
		if (validator.isLength(text, { min: 0, max: 300 })) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}

export function validationLink(text) {
	try {
		return false;
	} catch (error) {
		console.log(error);
	}
}
