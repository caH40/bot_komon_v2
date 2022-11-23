import { Result } from '../Model/Result.js';
import { Series } from '../Model/Series.js';
import { Stage } from '../Model/Stage.js';

import { secondesToTime, secondesToTimeThousandths } from '../utility/date-convert.js';
import { gapValue } from '../utility/gap.js';
import { filterThousandths } from '../utility/thousandths-seconds.js';
import { maxValue } from '../utility/value-max.js';
import { getResultsWithPenalty } from './results-penalty.js';

export async function getResultsStage(request) {
	try {
		const category = request.slice(0, 1);
		const stageId = request.slice(1);

		const stagesDB = await Stage.find({ _id: stageId });
		const seriesId = stagesDB[0].seriesId;
		const seriesNumber = stagesDB[0].number;
		const seriesType = stagesDB[0].type;
		const { name } = await Series.findOne({ _id: seriesId });

		const resultsDB = await Result.find({ stageId }).populate('riderId');

		let results = resultsDB.map(result => result.toObject());

		const hasPenalty = results.find(result => result.penalty.powerUp !== 0);
		if (hasPenalty) results = getResultsWithPenalty(results);

		let resultFiltered = [];
		if (category === 'T') {
			const categories = ['A', 'B', 'C', 'W'];
			for (let i = 0; i < categories.length; i++) {
				let res = results
					.filter(result =>
						result.riderId?.category
							? result.riderId?.category === categories[i]
							: result.category === categories[i]
					)
					.sort((a, b) => a.placeAbsolute - b.placeAbsolute);

				res.forEach((result, index) => (result.placeCategory = index + 1));
				resultFiltered = [...resultFiltered, ...res];
			}
			resultFiltered = resultFiltered.sort((a, b) => a.placeAbsolute - b.placeAbsolute);
		} else {
			resultFiltered = results
				.filter(result =>
					result.riderId?.category
						? result.riderId?.category === category
						: result.category === category
				)
				.sort((a, b) => a.placeAbsolute - b.placeAbsolute);
			resultFiltered.forEach((result, index) => (result.placeCategory = index + 1));
			resultFiltered.sort((a, b) => a.placeCategory - b.placeCategory);
		}

		resultFiltered = await gapValue(resultFiltered);

		const categoryStr = category === 'T' ? `Абсолют` : `Группа "${category}"`;
		const title = `${name}, Этап ${seriesNumber}, ${seriesType}, ${categoryStr}`;

		resultFiltered.forEach((result, index) => {
			result.gap = secondesToTime(result.gap);
			result.time = secondesToTimeThousandths(result.time);
			result.gapPrev = secondesToTime(result.gapPrev);
			result.weightInGrams = Math.round(result.weightInGrams / 10) / 100;
			result.title = title;
		});

		resultFiltered = await maxValue(resultFiltered);
		resultFiltered = filterThousandths(resultFiltered);
		return resultFiltered;
	} catch (error) {
		console.log(error);
	}
}
