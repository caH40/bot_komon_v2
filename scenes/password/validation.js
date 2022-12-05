import validator from 'validator';

export function validationPassword(password) {
	try {
		if (validator.isLength(password, { min: 6, max: 30 })) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
}
