import { Result } from '../../Model/Result.js';

export async function setDisqualification(isDisqualification, resultId) {
	try {
		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { isDisqualification } }
		);

		if (!resultDB) return { message: 'Не найден райдер для дисквалификации' };

		const message = `Райдер "${resultDB.name}" ${
			isDisqualification ? 'дисквалифицирован!' : 'оправдан, с него снята дисквалификация!'
		}`;
		return { message };
	} catch (error) {
		console.log(error);
	}
}
