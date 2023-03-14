import { generateToken, saveToken, validateRefreshToken } from './token.js';

import { Token } from '../../ModelServer/Token.js';
import { User } from '../../ModelServer/User.js';

export async function refreshService(refreshToken) {
	try {
		if (!refreshToken) return;

		const userFromToken = validateRefreshToken(refreshToken);

		const tokenDb = await Token.findOne({ refreshToken });

		if (!userFromToken || !tokenDb) return;

		//обновляем данные пользователя если они изменились
		const userDB = await User.findById(userFromToken.id);
		if (!userDB) return;
		const { accessToken } = await generateToken({
			id: userDB._id,
			email: userDB.email,
			username: userDB.username,
			role: userDB.role,
		});

		return {
			accessToken,
			user: {
				id: userDB._id,
				email: userDB.email,
				username: userDB.username,
				role: userDB.role,
				photoProfile: userDB.photoProfile,
			},
		};
	} catch (error) {
		console.log(error);
	}
}
