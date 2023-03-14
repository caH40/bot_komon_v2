import { PasswordReset } from '../../Model/Password-reset.js';

export async function controlNewPasswords() {
	try {
		const requestResetPassword = await PasswordReset.find();
		const dateNow = Date.now();

		const activationPeriod = 3 * 24 * 60 * 60 * 1000;

		for (let i = 0; i < requestResetPassword.length; i++) {
			let expiration = dateNow - requestResetPassword[i].date;
			if (expiration > activationPeriod) {
				await PasswordReset.findOneAndDelete({
					date: requestResetPassword[i].date,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
}
