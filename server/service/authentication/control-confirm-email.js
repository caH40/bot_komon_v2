import { User } from '../../Model/User.js';
import { UserConfirm } from '../../Model/User-confirm.js';

export async function controlConfirmEmail() {
	try {
		const usersForConfirmDB = await UserConfirm.find();
		const dateNow = Date.now();

		const activationPeriod = 3 * 24 * 60 * 60 * 1000;

		for (let i = 0; i < usersForConfirmDB.length; i++) {
			let expiration = dateNow - usersForConfirmDB[i].date;

			if (expiration > activationPeriod) {
				let { userId } = usersForConfirmDB[i];
				let userConfirmDeleted = await UserConfirm.findOneAndDelete({ userId });
				let userDeleted = await User.findOneAndDelete({ _id: userId });

				console.log(
					`${new Date().toLocaleString()} Аккаунт удалён, так как не был активирован ${
						userDeleted.username
					} ${userDeleted.email}`
				);
			}
		}
	} catch (error) {
		console.log(error);
	}
}
