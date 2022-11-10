import { Series } from '../Model/Series.js';
import { Stage } from '../Model/Stage.js';
import { convertDate } from '../utility/date-convert.js';

export async function scheduleToDB(dataSeries, dataStages) {
	try {
		const series = new Series({
			name: dataSeries[0].name,
			dateStart: convertDate(dataSeries[0].dateStart),
			description: dataSeries[0].description,
			type: dataSeries[0].type,
			organizer: dataSeries[0].organizer,
			hasGeneral: dataSeries[0].hasGeneral,
			hasTeams: dataSeries[0].hasTeams,
		});
		const response = await series.save().catch(error => console.log(error));

		if (!response) return console.log('Ошибка при сохранении данных серии');

		const length = dataStages.length;
		for (let index = 0; index < length; index++) {
			let stage = new Stage({
				seriesId: response._id,
				number: dataStages[index].number,
				dateStart: convertDate(dataStages[index].dateStart, dataStages[index].timeStart),
				world: dataStages[index].world,
				route: dataStages[index].route,
				laps: dataStages[index].laps,
				distance: dataStages[index].distance,
				ascent: dataStages[index].ascent,
				type: dataStages[index].type,
				link: dataStages[index].link,
			});
			await stage.save().catch(error => console.log(error));
		}
	} catch (error) {
		console.log(error);
	}
}
