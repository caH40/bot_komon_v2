import { UserConfirm } from '../../ModelServer/User-confirm.js';
import { User } from '../../ModelServer/User.js';

export async function confirmEmailService(activationToken) {
	try {
		const userConfirmDB = await UserConfirm.findOneAndDelete({ activationToken });

		if (userConfirmDB) {
			await User.findOneAndUpdate({ _id: userConfirmDB.userId }, { $set: { emailConfirm: true } });
			return { message: `Email подтверждён, аккаунт активирован!` };
		}

		return { message: `Ссылка для активации устарела!` };
	} catch (error) {
		console.log(error);
	}
}
