import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Token } from '../../ModelServer/Token.js';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export async function generateToken(payload) {
	try {
		const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1d' });
		const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

		return { accessToken, refreshToken };
	} catch (error) {
		console.log(error);
	}
}

export async function saveToken(userId, refreshToken) {
	try {
		const tokenDB = await Token.findOne({ user: userId });
		if (tokenDB) {
			tokenDB.refreshToken = refreshToken;
			return await tokenDB.save(); //вернётся ли тут сохранённое значение??
		}

		const newTokenDB = await Token.create({ user: userId, refreshToken });
		return newTokenDB;
	} catch (error) {
		console.log(error);
	}
}

export async function removeToken(refreshToken) {
	try {
		const tokenDB = await Token.findOneAndDelete({ refreshToken });
		return tokenDB;
	} catch (error) {
		console.log(error);
	}
}

export function validateAccessToken(token) {
	try {
		const userData = jwt.verify(token, JWT_ACCESS_SECRET);
		return userData;
	} catch (error) {
		return;
	}
}

export function validateRefreshToken(token) {
	try {
		const userData = jwt.verify(token, JWT_REFRESH_SECRET);
		return userData;
	} catch (error) {
		return;
	}
}
