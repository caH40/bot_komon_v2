import { session, Telegraf } from 'telegraf';

import { Click } from '../Model/Click.js';
import { Rider } from '../Model/Rider.js';
import { Stage } from '../Model/Stage.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

const pauseInMilliseconds = 40;

export async function getUsersForSpam(theme) {
  try {
    // news,newRace,botInfo,training
    const ridersDB = await Rider.find();
    const ridersWishNotice = await Rider.find({ [`settings.notice.${theme}`]: true });
    const ridersClickingDB = await Click.find();

    let telegramIdsRider = [];
    ridersDB.forEach((rider) => telegramIdsRider.push(rider.telegramId));

    let telegramIdsRiderClicking = [];
    ridersClickingDB.forEach((rider) => telegramIdsRiderClicking.push(rider.user.id));

    const usersFiltered = telegramIdsRiderClicking.filter(
      (telegramId) => !telegramIdsRider.includes(telegramId)
    );

    let telegramIdsRiderWishNotice = [];
    ridersWishNotice.forEach((rider) => telegramIdsRiderWishNotice.push(rider.telegramId));

    const users = [...usersFiltered, ...telegramIdsRiderWishNotice];

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function noticeGetResult(protocol) {
  try {
    const users = await getUsersForSpam('botInfo');
    const stageDB = await Stage.findOne({ _id: protocol.stageId }).populate('seriesId');

    //массив с telegramID райдеров, принимавших участие в заезде
    const ridersDB = await Rider.find();
    let telegramIdRidersInProtocol = [];
    protocol.results.forEach((result) => {
      telegramIdRidersInProtocol.push(
        ridersDB.find((rider) => +result.zwiftId === rider.zwiftId)?.telegramId
      );
    });

    users.forEach((telegramId, index) => {
      let subMessage = telegramIdRidersInProtocol.includes(telegramId)
        ? 'в котором Вы принимали участие.'
        : '';
      let message = `${new Date().toLocaleString()}. Загружены результаты этапа №${
        stageDB.number
      } ${stageDB.seriesId.name} ${subMessage} 📋`;
      setTimeout(async () => {
        await bot.telegram
          .sendMessage(telegramId, message)
          .catch((error) => console.log('Не найден chatId'));
      }, index * pauseInMilliseconds);
    });
  } catch (error) {
    console.log(error);
  }
}

export async function noticePost(ctx, theme, message) {
  try {
    const users = await getUsersForSpam(theme);

    users.forEach((telegramId, index) => {
      setTimeout(async () => {
        await ctx.telegram.sendMessage(telegramId, message).catch((error) => true);
      }, index * pauseInMilliseconds);
    });
  } catch (error) {
    console.log(error);
  }
}

export async function noticeFromAdmin(ctx, message) {
  try {
    const users = await getUsersForSpam('botInfo');

    users.forEach((telegramId, index) => {
      setTimeout(async () => {
        await ctx.telegram.sendMessage(telegramId, message).catch((error) => true);
      }, index * pauseInMilliseconds);
    });
  } catch (error) {
    console.log(error);
  }
}
export async function noticeFromAdminService(message) {
  try {
    const users = await getUsersForSpam('botInfo');

    users.forEach((telegramId, index) => {
      setTimeout(async () => {
        await bot.telegram.sendMessage(telegramId, message).catch((error) => true);
      }, index * pauseInMilliseconds);
    });
  } catch (error) {
    console.log(error);
  }
}
