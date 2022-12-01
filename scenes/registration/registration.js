import { Scenes } from 'telegraf';

import { registrationToDB } from '../../controllersDB/registration/save.js';
import { getTelegramId } from './telegramid.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };
import { finalMessage, riderData } from '../../locales/template.js';
import {
	checkZwiftId,
	validationGender,
	validationLink,
	validationNameEn,
	validationNameRus,
} from './validation.js';
import { Rider } from '../../Model/Rider.js';

const t = textJson.scenes.registration;

export const firstSceneReg = new Scenes.BaseScene('firstSceneReg');
firstSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account = {};
		ctx.session.data.account.counter = 0;
		getTelegramId(ctx);
		// показать данные райдера, если уже зарегистрирован
		const riderDB = await Rider.findOne({ telegramId: ctx.session.data.account.telegramId });
		if (riderDB) {
			ctx.session.data.account.zwiftIdRiderWithUpdating = riderDB.zwiftId;
			const message = riderData(riderDB);
			await ctx.replyWithHTML(message, { disable_web_page_preview: true });
			await ctx.replyWithHTML(t.first.question);
		} else {
			const nameTg = ctx.session.data.account.first_name;
			await ctx.replyWithHTML(t.first.welcome1 + nameTg + t.first.welcome2);
			await ctx.replyWithHTML(t.first.question);
		}
	} catch (e) {
		console.log(e);
	}
});
firstSceneReg.command('quit', async ctx => {
	await ctx.replyWithHTML(t.quit);
	return await ctx.scene.leave();
});
firstSceneReg.on('message', async ctx => {
	ctx.session.data.account.counter++;
	const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
	if (isManyAttempts) return await ctx.scene.leave();

	const text = ctx.message.text;
	ctx.session.data.messagesIdForDelete.push(ctx.message.message_id);
	const isValid = validationNameRus(text);
	if (isValid) {
		ctx.session.data.account.firstName = text;
		return ctx.scene.enter('secondSceneReg');
	}
	await ctx.replyWithHTML(t.first.wrong);
});
// =====================================================================
export const secondSceneReg = new Scenes.BaseScene('secondSceneReg');
secondSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account.counter = 0;
		await ctx.replyWithHTML(t.second.question);
	} catch (e) {
		console.log(e);
	}
});
secondSceneReg.command('quit', async ctx => {
	try {
		await ctx.replyWithHTML(t.quit);
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
secondSceneReg.on('message', async ctx => {
	try {
		ctx.session.data.account.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		const text = ctx.message.text;
		const isValid = validationNameRus(text);
		if (isValid) {
			ctx.session.data.account.lastName = text;
			return ctx.scene.enter('fourthSceneReg');
		}
		await ctx.replyWithHTML(t.second.wrong);
	} catch (e) {
		console.log(e);
	}
});

// =====================================================================

export const fourthSceneReg = new Scenes.BaseScene('fourthSceneReg');
fourthSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account.counter = 0;
		await ctx.replyWithHTML(t.fourth.question);
	} catch (e) {
		console.log(e);
	}
});
fourthSceneReg.command('quit', async ctx => {
	try {
		await ctx.replyWithHTML(t.quit);
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
fourthSceneReg.on('message', async ctx => {
	try {
		ctx.session.data.account.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		const text = ctx.message.text?.toLowerCase();
		const isValid = validationGender(text);
		if (isValid) {
			ctx.session.data.account.gender = text;
			return ctx.scene.enter('fifthSceneReg');
		}
		await ctx.replyWithHTML(t.fourth.wrong);
	} catch (e) {
		console.log(e);
	}
});
// =====================================================================
export const fifthSceneReg = new Scenes.BaseScene('fifthSceneReg');
fifthSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account.counter = 0;
		await ctx.replyWithHTML(t.fifth.question, { disable_web_page_preview: true });
	} catch (e) {
		console.log(e);
	}
});
fifthSceneReg.command('quit', async ctx => {
	try {
		await ctx.replyWithHTML(t.quit);
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
fifthSceneReg.on('message', async ctx => {
	try {
		ctx.session.data.account.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		const text = ctx.message.text;
		const isValid = validationNameEn(text);
		if (isValid) {
			ctx.session.data.account.firstNameZwift = text;
			return ctx.scene.enter('sixthSceneReg');
		}
		await ctx.replyWithHTML(t.fifth.wrong);
	} catch (e) {
		console.log(e);
	}
});

// =====================================================================
export const sixthSceneReg = new Scenes.BaseScene('sixthSceneReg');
sixthSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account.counter = 0;
		await ctx.replyWithHTML(t.sixth.question);
	} catch (e) {
		console.log(e);
	}
});
sixthSceneReg.command('quit', async ctx => {
	try {
		await ctx.replyWithHTML(t.quit);
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
sixthSceneReg.on('message', async ctx => {
	try {
		ctx.session.data.account.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		const text = ctx.message.text;
		const isValid = validationNameEn(text);
		if (isValid) {
			ctx.session.data.account.lastNameZwift = text;
			return ctx.scene.enter('seventhSceneReg');
		}
		await ctx.replyWithHTML(t.sixth.wrong);
	} catch (e) {
		console.log(e);
	}
});
// =====================================================================
export const seventhSceneReg = new Scenes.BaseScene('seventhSceneReg');
seventhSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account.counter = 0;
		await ctx.replyWithHTML(t.seventh.question);
	} catch (e) {
		console.log(e);
	}
});
seventhSceneReg.command('quit', async ctx => {
	try {
		await ctx.replyWithHTML(t.quit);
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
seventhSceneReg.on('message', async ctx => {
	try {
		ctx.session.data.account.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		const text = ctx.message.text;
		const isValid = validationNameEn(text);
		if (isValid) {
			ctx.session.data.account.cycleTrainer = text;
			return ctx.scene.enter('eighthSceneReg');
		}
		await ctx.replyWithHTML(t.seventh.wrong);
	} catch (e) {
		console.log(e);
	}
});
// =====================================================================
export const eighthSceneReg = new Scenes.BaseScene('eighthSceneReg');
eighthSceneReg.enter(async ctx => {
	try {
		ctx.session.data.account.counter = 0;
		await ctx.replyWithHTML(t.eighth.question, {
			disable_web_page_preview: true,
		});
	} catch (e) {
		console.log(e);
	}
});
eighthSceneReg.command('save', async ctx => {
	try {
		const response = await registrationToDB(ctx.session.data.account);
		if (response) {
			ctx.session.data.account = {};
			await ctx.replyWithHTML(t.eighth.successfulDB);
		} else {
			ctx.session.data.account = {};
			await ctx.replyWithHTML(t.eighth.wrongDB);
		}
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
eighthSceneReg.command('repeat', async ctx => await ctx.scene.enter('firstSceneReg'));
eighthSceneReg.command('quit', async ctx => {
	try {
		await ctx.replyWithHTML(t.quit);
		return await ctx.scene.leave();
	} catch (e) {
		console.log(e);
	}
});
eighthSceneReg.on('message', async ctx => {
	try {
		ctx.session.data.account.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.account.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		const text = ctx.message.text;
		const isValid = validationLink(text);
		if (isValid) {
			const regExp = /\d+/;
			const zwiftId = text.match(regExp)[0];
			const zwiftIdRiderWithUpdating = ctx.session.data.account.zwiftIdRiderWithUpdating;
			const isUniqueId = await checkZwiftId(zwiftId, zwiftIdRiderWithUpdating);
			if (isUniqueId) {
				ctx.session.data.account.zwiftPower = text;
				ctx.session.data.account.zwiftId = zwiftId;
				return await ctx.replyWithHTML(finalMessage(ctx), {
					disable_web_page_preview: true,
				});
			} else {
				await ctx.replyWithHTML(t.eighth.wrongZwiftId, {
					disable_web_page_preview: true,
				});
			}
		} else {
			await ctx.replyWithHTML(t.eighth.wrong, {
				disable_web_page_preview: true,
			});
		}
	} catch (e) {
		console.log(e);
	}
});

async function attempts(ctx, counter) {
	try {
		if (counter > 3) {
			return await ctx.replyWithHTML(t.attempts);
		}
	} catch (e) {
		console.log(e);
	}
}
