import { Rights } from '../Model/Rights.js';
import { noticeFromAdmin } from '../modules/notice.js';

export async function sendNotice(ctx) {
  try {
    const message = ctx.message.text;
    if (!message?.includes('#forAll')) return;

    const userId = ctx.message.from.id;
    const adminDB = await Rights.findOne({ admin: userId });
    if (!adminDB) return;

    const messageEdited = message.replace(
      '#forAll',
      `${new Date().toLocaleString()}, BotInfo:`
    );

    await noticeFromAdmin(ctx, messageEdited);
  } catch (error) {
    console.log(error);
  }
}
