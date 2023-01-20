import { Result } from '../../Model/Result.js';

export async function setPenalty(newPenalty, resultId) {
	try {
		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { 'penalty.powerUp': newPenalty } },
			{ returnDocument: 'after' }
		);

		if (!resultDB) return { message: 'Не найден райдер для пенальти' };

		const message =
			resultDB.penalty.powerUp !== 0
				? `"${resultDB.name}" начислены штрафные баллы в количестве ${resultDB.penalty.powerUp}шт.`
				: `"${resultDB.name}" сняты все штрафные баллы`;
		return { message };
	} catch (error) {
		console.log(error);
	}
}
