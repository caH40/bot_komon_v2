import path from 'path';

import { getResultsStage } from '../../preparation_data/results-stage.js';
import { Rider } from '../../Model/Rider.js';
import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';
import { resultsSeriesGeneral } from '../../preparation_data/general/general-series.js';
import { mountainTable, sprintTable } from '../../utility/points.js';
import { getPointsSM } from '../../preparation_data/points-sm/points-sm.js';
import { getPointsTeams } from '../../preparation_data/teams/points-teams.js';
import { Click } from '../../Model/Click.js';
import { getStatRiders } from '../../preparation_data/statistics/riders.js';
import { getStatStages } from '../../preparation_data/statistics/stages.js';
import { Feedback } from '../../Model/Feedback.js';
import { getTeamWithRiders } from '../../preparation_data/teams/riders-team.js';
import { Rights } from '../../Model/Rights.js';
import { checkAdmin, checkAdminWithHash } from './auth.js';
import { saveResult } from '../../controllersDB/result-add.js';
import { resultsTourGeneral } from '../../preparation_data/tour/tour.js';
import { getProfile } from '../../preparation_data/profile/profile.js';

const __dirname = path.resolve();

export async function authenticate(req, res) {
	try {
		const { password, telegramId } = req.body;
		const hash = await checkAdmin(password, telegramId);

		if (hash) return res.status(200).json({ password: hash });
		return res.status(401).json({ message: 'Неверный логин или пароль!' });
	} catch (error) {
		console.log(error);
	}
}
export function mainPage(req, res) {
	try {
		res.status(200);
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	} catch (error) {
		console.log(error);
	}
}

export async function resultsStage(req, res) {
	try {
		const stageId = req.query.stageId;

		const resultsDB = await getResultsStage(stageId);

		if (resultsDB) return res.status(200).json({ message: `Результат найден`, resultsDB });
		return res.status(400).json({ message: `Результат не найден` });
	} catch (error) {
		console.log(error);
	}
}

export async function getRiderSettings(req, res) {
	try {
		const telegramId = req.query.telegramId;
		const riderDB = await Rider.findOne({ telegramId });
		if (riderDB)
			return res.status(200).json({ message: `Райдер найден`, settings: riderDB.settings.notice });
		return res.status(400).json({ message: `Райдер не найден` });
	} catch (error) {
		console.log(error);
	}
}

export async function postRiderSettings(req, res) {
	try {
		const { notice, telegramId } = req.body;

		const riderDB = await Rider.findOneAndUpdate(
			{ telegramId },
			{ $set: { 'settings.notice': notice } }
		);

		const messages = {
			true: 'Включено!',
			false: 'Выключено!',
			news: 'Оповещение о новостях:',
			newRace: 'Оповещение об анонсах заездов:',
			botInfo: 'Оповещение об изменениях данных в боте:',
			training: 'Оповещение о новых статьях про велотренировки:',
		};

		let response = '';
		const keys = Object.keys(notice);
		keys.forEach(key => {
			if (notice[key] !== riderDB.settings.notice[key])
				response = `${messages[key]} ${messages[notice[key]]}`;
		});

		if (riderDB)
			return res.status(200).json({ message: `Обновлены настройки оповещения`, response });
		return res.status(400).json({ message: `Райдер не найден в БД` });
	} catch (error) {
		console.log(error);
	}
}

export async function postStageEdit(req, res) {
	try {
		const { newCategory, zwiftId, stageId, telegramId, password } = req.body;

		const hash = await checkAdminWithHash(password, telegramId);
		if (!hash) return res.status(401).json({ message: 'Неверный логин или пароль!' });

		const riderDB = await Rider.findOneAndUpdate(
			{ zwiftId: zwiftId },
			{ $set: { category: newCategory } }
		);
		// if (!riderDB) return res.status(400).json({ message: `Райдер не найден в БД` });

		const stageDB = await Stage.findOne({ _id: stageId });
		if (!stageDB) return res.status(400).json({ message: `Не найдена серия заездов` });

		const stagesDB = await Stage.find({ seriesId: stageDB.seriesId, hasResults: true });
		if (stagesDB.length === 0)
			return res.status(400).json({ message: `Не найден ни один этап серии` });

		const resultDB = await Result.findOne({ zwiftRiderId: zwiftId });

		for (let i = 0; i < stagesDB.length; i++) {
			let response = await Result.updateMany(
				{ stageId: stagesDB[i]._id, zwiftRiderId: zwiftId },
				{ $set: { category: newCategory } }
			);
		}

		const message = `Успех! Райдеру "${resultDB.name}" изменена категория с "${resultDB.category}" на "${newCategory}"`;

		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}

export async function postStagePoints(req, res) {
	try {
		const { nameElement, name, place, resultId, telegramId, password } = req.body;
		const numberElementPoints = +name.slice(-1) - 1;

		const hash = await checkAdminWithHash(password, telegramId);
		if (!hash) return res.status(401).json({ message: 'Неверный логин или пароль!' });

		let pointsTable = {};
		if (nameElement === 'pointsMountain') pointsTable = mountainTable;
		if (nameElement === 'pointsSprint') pointsTable = sprintTable;

		const points = pointsTable.find(point => point.place === place)?.points;
		const elementPoints = `${nameElement}.${numberElementPoints}.points`;

		const elementPlace = `${nameElement}.${numberElementPoints}.place`;

		const { stageId } = await Result.findOne({ _id: resultId });

		if (place !== 'none') {
			const resultCheckingDB = await Result.findOne({ stageId, [elementPlace]: place });
			if (resultCheckingDB)
				return res.status(202).json({
					message: `Внимание!!! Место №${place} уже присвоено райдеру "${resultCheckingDB.name}"`,
				});
		}

		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { [elementPlace]: place, [elementPoints]: points } }
		);

		if (!resultDB)
			return res.status(400).json({ message: `Не найден результат id: ${resultId}` });
		let message = '';
		if (place === 'none') {
			message = `Успех! Райдеру "${resultDB.name}" установленно "${place}" в "${name}"`;
		} else {
			message = `Успех! Райдеру "${resultDB.name}" присвоено №${place} место в "${name}"`;
		}
		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}

export async function postStagePenalty(req, res) {
	try {
		const { newPenalty, resultId, telegramId, password } = req.body;

		const hash = await checkAdminWithHash(password, telegramId);
		if (!hash) return res.status(401).json({ message: 'Неверный логин или пароль!' });

		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { 'penalty.powerUp': newPenalty } }
		);

		if (!resultDB)
			return res.status(400).json({ message: `Не найден результат id: ${resultId}` });
		let message = `Успех! Райдеру "${resultDB.name}" начислены штрафные баллы в количестве ${newPenalty}шт.`;
		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}

export async function postAddResult(req, res) {
	try {
		const result = req.body;
		const { response, message } = await saveResult(result);
		if (response) return res.status(200).json({ message: 'Новый результат сохранен в БД' });
		return res.status(400).json({ message });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: `Ошибка при сохранении нового результата` });
	}
}

export async function getGeneralPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;
		const generalPoints = await resultsSeriesGeneral(seriesId);

		if (generalPoints)
			return res
				.status(200)
				.json({ message: `Данные по генеральному зачету получены`, generalPoints });
		return res.status(400).json({ message: `Ошибка при получении данных генерального зачета` });
	} catch (error) {
		console.log(error);
	}
}

export async function getGeneralTour(req, res) {
	try {
		const seriesId = req.query.seriesId;
		const resultsTour = await resultsTourGeneral(seriesId);

		if (resultsTour)
			return res
				.status(200)
				.json({ message: `Данные по генеральному зачету получены`, resultsTour });
		return res.status(400).json({ message: `Ошибка при получении данных генерального зачета` });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: `Ошибка при получении данных генерального зачета` });
	}
}

export async function getMountainPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;

		const pointsMountain = await getPointsSM(seriesId);

		if (pointsMountain)
			return res.status(200).json({ message: `Данные по горному зачету`, pointsMountain });
		return res.status(400).json({ message: `Ошибка при получении данных горного зачета` });
	} catch (error) {
		console.log(error);
	}
}

export async function getSprintPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;

		const pointsSprint = await getPointsSM(seriesId);

		if (pointsSprint)
			return res.status(200).json({ message: `Данные по спринтерскому зачету`, pointsSprint });
		return res.status(400).json({ message: `Ошибка при получении данных спринтерского зачета` });
	} catch (error) {
		console.log(error);
	}
}

export async function getTeamsPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;
		const pointsTeams = await getPointsTeams(seriesId);

		if (pointsTeams)
			return res.status(200).json({ message: `Данные по командному зачету`, pointsTeams });
		return res.status(400).json({ message: `Ошибка при получении данных командного зачета` });
	} catch (error) {
		console.log(error);
	}
}
export async function postClick(req, res) {
	try {
		const { telegramId } = req.body;
		if (telegramId == process.env.DEVELOPER_ID)
			return res.status(200).json({ message: `Подсчет кликов разработчиков не производится!` });
		if (!telegramId)
			return res.status(200).json({ message: `Запрос с вебинтерфейса при разработке` });

		const today = new Date().setHours(0, 0, 0, 0);

		const click = await Click.findOneAndUpdate(
			{ 'user.id': telegramId, 'clicksPerDay.date': today },
			{ $inc: { 'clicksPerDay.$[elem].clicks': 1 } },
			{ arrayFilters: [{ 'elem.date': today }] }
		);

		if (!click) {
			const updatedRider = await Click.findOneAndUpdate(
				{ 'user.id': telegramId },
				{ $push: { clicksPerDay: { date: today, clicks: 1 } } },
				{ returnDocument: 'after' }
			);
		}

		if (click) return res.status(200).json({ message: `Клик подсчитан!` });
		return res.status(400).json({ message: `Ошибка при подсчете клика!` });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: `Ошибка при подсчете клика!` });
	}
}
export async function getStatisticsRiders(req, res) {
	try {
		const statisticsRiders = await getStatRiders();
		if (statisticsRiders.length !== 0)
			return res.status(200).json({ message: `Статистика по райдерам`, statisticsRiders });
		return res.status(400).json({ message: `Ошибка при получении статистики по райдерам!` });
	} catch (error) {
		console.log(error);
	}
}
export async function getStatisticsStages(req, res) {
	try {
		const statisticsStages = await getStatStages();
		if (statisticsStages.length !== 0)
			return res.status(200).json({ message: `Статистика по заездам`, statisticsStages });
		return res.status(400).json({ message: `Ошибка при получении статистики по заездам!` });
	} catch (error) {
		console.log(error);
	}
}
export async function getFeedback(req, res) {
	try {
		const feedbackDB = await Feedback.find();

		return res.status(200).json({ message: 'Данные по обратной связи', feedbackDB });
		return res.status(400).json({ message: `Ошибка при получении данных по обратной связи!` });
	} catch (error) {
		console.log(error);
	}
}
export async function postFeedback(req, res) {
	try {
		const { telegramId, query, date } = req.body;
		const feedbackDB = await Feedback.findOne({ text: query });
		if (feedbackDB)
			return res
				.status(400)
				.json({ message: `Сообщение обратной связи с таким текстом уже существует` });

		const feedback = new Feedback({
			telegramId,
			text: query,
			date,
		});

		const savedFeedBack = await feedback.save().catch(e => console.log('error', e));

		if (!savedFeedBack)
			return res.status(400).json({ message: `Ошибка при сохранении данных обратной связи!` });
		res.status(200).json({ message: 'Данные по обратной связи сохранены!', savedFeedBack });
	} catch (error) {
		console.log(error);
	}
}
export async function getTeams(req, res) {
	try {
		const teams = await getTeamWithRiders();

		if (!teams)
			return res
				.status(400)
				.json({ message: `Ошибка получении данных по зарегистрированным командам` });

		res.status(200).json({ message: 'Данные по зарегистрированным командам!', teamsDB: teams });
	} catch (error) {
		console.log(error);
	}
}
export async function getRiders(req, res) {
	try {
		const telegramId = req.body.telegramId;
		const rightsDB = await Rights.findOne();

		if (!rightsDB.admin.includes(telegramId))
			return res.status(403).json({ message: `Доступ запрещен!` });

		const ridersDB = await Rider.find().populate('teamId');

		if (!ridersDB)
			return res
				.status(400)
				.json({ message: `Ошибка получении данных по зарегистрированным райдерам` });

		res.status(200).json({ message: 'Данные по зарегистрированным райдерам!', ridersDB });
	} catch (error) {
		console.log(error);
	}
}
export async function postDisqualification(req, res) {
	try {
		const { isDisqualification, resultId, password, telegramId } = req.body;

		const hash = await checkAdminWithHash(password, telegramId);
		if (!hash) return res.status(401).json({ message: 'Неверный логин или пароль!' });

		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { isDisqualification } }
		);

		const message = `Райдер "${resultDB.name}" ${
			isDisqualification ? 'дисквалифицирован!' : 'оправдан, с него снята дисквалификация!'
		}`;

		if (!resultDB)
			return res.status(400).json({ message: `Не найден райдер для дисквалификации` });

		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}
export async function postUnderChecking(req, res) {
	try {
		const { isUnderChecking, resultId, password, telegramId } = req.body;

		const hash = await checkAdminWithHash(password, telegramId);
		if (!hash) return res.status(401).json({ message: 'Неверный логин или пароль!' });

		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { isUnderChecking } }
		);

		const message = `Райдер "${resultDB.name}" ${
			isUnderChecking
				? 'один раз превысил показатели своей категории!'
				: 'оправдан, с него сняты подозрения о превышении показателей текущей категории!'
		}`;

		if (!resultDB) return res.status(400).json({ message: `Не найден райдер` });

		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}
export async function postProfile(req, res) {
	try {
		const { zwiftId } = req.body;
		const profile = await getProfile(zwiftId);
		const message = `Данные Райдера ${zwiftId} получены`;
		return res.status(200).json({ profile, message });
	} catch (error) {
		console.log(error);
	}
}
