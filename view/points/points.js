import { Rider } from '../../Model/Rider.js';
import { Series } from '../../Model/Series.js';
import { getResultsSeries } from '../../modules/getResults.js';
import { posting } from './posting.js';

export async function resultsPoints(ctx, cbqData) {
	try {
		let typePoints = '';

		if (cbqData.includes(`m_1_all_4_E`)) {
			typePoints = 'pointsSprint';
		} else if (cbqData.includes(`m_1_all_5_E`)) {
			typePoints = 'pointsMountain';
		} else return;

		const seriesId = cbqData.slice(13);

		const seriesDB = await Series.findOne({ _id: seriesId });
		const results = await getResultsSeries(seriesId);

		let totalResult = [];
		results.forEach(result => {
			if (result[typePoints] === 0) return;
			const riderResult = totalResult.find(riderResult => {
				return riderResult?.riderId.toString() === result.riderId.toString();
			});
			if (riderResult) return (riderResult[typePoints] += result[typePoints]);
			totalResult.push({ riderId: result.riderId, [typePoints]: result[typePoints] });
		});

		for (let i = 0; i < totalResult.length; i++) {
			let riderDB = await Rider.findOne({ _id: totalResult[i].riderId }).populate({
				path: 'teamId',
				select: 'name',
			});
			totalResult[i].name = `${riderDB.lastName} ${riderDB.firstName}`;
			totalResult[i].team = riderDB.teamId.name;
			totalResult[i].series = riderDB.teamId.name;
		}
		totalResult = totalResult.sort((a, b) => b[typePoints] - a[typePoints]);
		totalResult.forEach((riderResult, index) => (riderResult.place = index + 1));

		return posting(ctx, totalResult, typePoints, seriesDB.name);
	} catch (error) {
		console.log(error);
	}
}
