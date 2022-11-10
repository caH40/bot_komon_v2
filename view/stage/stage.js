import { resultsViewStageDes } from './desktop.js';
import { resultsViewStageMob } from './mobile.js';
import { Result } from '../../Model/Result.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { divisionChart } from '../../utility/chart-division.js';
import { secondesToTime, secondesToTimeThousandths } from '../../utility/date-convert.js';
import { gapValue, maxValue } from './utilites.js';
import { mainMenu } from '../../keyboard/main-menu.js';

export async function resultsViewStage(ctx, cbqData) {
	try {
		const view = cbqData.slice(0, 3);
		const category = cbqData.slice(17, 18);
		const stageId = cbqData.slice(19);

		await mainMenu(ctx);

		const stagesDB = await Stage.find({ _id: stageId });
		const seriesId = stagesDB[0].seriesId;
		const seriesNumber = stagesDB[0].number;
		const seriesType = stagesDB[0].type;
		const { name } = await Series.findOne({ _id: seriesId });

		const resultsDB = await Result.find({ stageId }).populate('riderId');

		let results = resultsDB.map(result => result.toObject());
		let resultFiltered = [];

		if (category === 'T') {
			const categories = ['A', 'B', 'C', 'W'];
			for (let i = 0; i < categories.length; i++) {
				let res = results
					.filter(result =>
						result.riderId?.category
							? result.riderId?.category === categories[i]
							: result.categoryCurrent === categories[i]
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
						: result.categoryCurrent === category
				)
				.sort((a, b) => a.placeAbsolute - b.placeAbsolute);
			resultFiltered.forEach((result, index) => (result.placeCategory = index + 1));
			resultFiltered.sort((a, b) => a.placeCategory - b.placeCategory);
		}

		resultFiltered = await gapValue(resultFiltered);
		resultFiltered = await maxValue(resultFiltered);

		resultFiltered.forEach(elm => {
			elm.gap = secondesToTime(elm.gap);
			elm.time = secondesToTimeThousandths(elm.time);
			elm.gapPrev = secondesToTime(elm.gapPrev);
			elm.weightInGrams = Math.round(elm.weightInGrams / 10) / 100;
		});

		const categoryStr = category === 'T' ? `Общий протокол` : `Группа "${category}"`;
		const title = `${name}, Этап ${seriesNumber}, ${seriesType}, ${categoryStr}`;

		const charts = divisionChart(resultFiltered);

		if (view === 'Des') return resultsViewStageDes(ctx, charts, title, category);
		if (view === 'Mob') return resultsViewStageMob(ctx, resultFiltered, title, category);
	} catch (error) {
		console.log(error);
	}
}
