import { validateAccessToken, validateRefreshToken } from '../service/authentication/token.js';

export async function checkAuth(req, res, next) {
	try {
		const { authorization } = req.headers;
		if (!authorization) return res.status(401).json({ message: 'Нет Authorization' });
		const accessToken = authorization?.split(' ')[1];

		const isValidAccessToken = validateAccessToken(accessToken);
		if (!isValidAccessToken) return res.status(401).json({ message: 'Неактуальный accessToken' });
		req.params.userId = isValidAccessToken?.id;

		return next();

		// const { refreshToken } = req.cookies;
		// if (!refreshToken) return res.status(401).json({ message: 'Необходима авторизация' });
		// const isValidRefreshToken = validateRefreshToken(refreshToken);
		// if (isValidRefreshToken) return next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: 'Необходима авторизация' });
	}
}

export async function getAuth(req, res, next) {
	try {
		const { authorization } = req.headers;
		const accessToken = authorization?.split(' ')[1];
		const isValidAccessToken = validateAccessToken(accessToken);
		req.params.userId = isValidAccessToken?.id;
		return next();
	} catch (error) {
		console.log(error);
		return next();
	}
}
