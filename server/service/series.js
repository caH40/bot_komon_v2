import { Series } from '../../Model/Series.js';

export async function getSeries(seriesId) {
	try {
		if (seriesId) return await Series.findOne({ _id: seriesId });
		const seriesDB = await Series.find();
		return seriesDB;
	} catch (error) {
		console.log(error);
	}
}

export async function getSeriesOne(seriesId) {
	try {
		const seriesDB = await Series.findOne({ _id: seriesId });
		return seriesDB;
	} catch (error) {
		console.log(error);
	}
}

export async function changeSeries({
	_id,
	name,
	dateStart,
	type,
	organizer,
	hasGeneral,
	hasTeams,
	isFinished,
}) {
	try {
		const seriesDB = await Series.findOneAndUpdate(
			{ _id },
			{ $set: { name, dateStart, type, organizer, hasGeneral, hasTeams, isFinished } }
		);
		return { message: `Изменения в ${name} сохранены!` };
	} catch (error) {
		console.log(error);
		throw 'Непредвиденная ошибка на сервере';
	}
}
