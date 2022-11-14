import { Result } from '../Model/Result.js';
import { Rider } from '../Model/Rider.js';

export async function updateCategoryDB(result, categoryCurrent) {
	try {
		const riderDB = await Rider.findOne({ zwiftId: result.zwiftId });
		//если аккаунт существует, то выход
		if (riderDB) return { category: riderDB.category };

		const riderZwiftIdDB = await Result.findOne({ zwiftRiderId: result.zwiftId });
		if (riderZwiftIdDB) return { category: riderZwiftIdDB.category };

		return { category: categoryCurrent };
	} catch (error) {
		console.log(error);
	}
}
