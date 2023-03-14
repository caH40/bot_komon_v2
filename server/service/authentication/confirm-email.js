import { UserConfirm } from '../../../Model/User-confirm.js';
import { Rider } from '../../../Model/Rider.js';

export async function confirmEmailService(activationToken) {
	try {
		const userConfirmDB = await UserConfirm.findOneAndDelete({ activationToken });

		if (userConfirmDB) {
			await Rider.findOneAndUpdate(
				{ _id: userConfirmDB.userId },
				{ $set: { emailConfirm: true } }
			);
			return { message: `Email подтверждён, аккаунт активирован!` };
		}

		return { message: `Ссылка для активации устарела!` };
	} catch (error) {
		console.log(error);
	}
}
