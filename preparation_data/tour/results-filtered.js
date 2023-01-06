import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function getFilterResults(seriesIdAndCategory) {
	try {
		let category = '';
		let seriesId = '';
		if (seriesIdAndCategory?.includes('WA') || seriesIdAndCategory?.includes('WB')) {
			category = seriesIdAndCategory.slice(0, 2);
			seriesId = seriesIdAndCategory.slice(2);
		} else {
			category = seriesIdAndCategory.slice(0, 1);
			seriesId = seriesIdAndCategory.slice(1);
		}

		const stagesDB = await Stage.find({ seriesId, hasResults: true, needCount: true });
		let categorySearch = {};

		if (category === 'T') {
			categorySearch = undefined;
		} else {
			categorySearch = { category };
		}

		let results = [];
		if (category === 'T') {
			for (let i = 0; i < stagesDB.length; i++) {
				let resultsDB = await Result.find({ stageId: stagesDB[i]?._id }).populate({
					path: 'stageId',
					select: 'number',
				});
				results = [...results, ...resultsDB];
			}
			return results;
		} else {
			for (let i = 0; i < stagesDB.length; i++) {
				let resultsDB = await Result.find({ stageId: stagesDB[i]?._id, category }).populate({
					path: 'stageId',
					select: 'number',
				});
				results = [...results, ...resultsDB];
			}
			return results;
		}
	} catch (error) {
		console.log(error);
	}
}
