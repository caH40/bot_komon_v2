import { downloadFile } from './axios/download.js';

export async function getFileTelegram(ctx, dlPath) {
	try {
		const fileId = ctx.message.document.file_id;
		const fileName = ctx.message.document.file_name;
		ctx.session.data.fileName = fileName;

		const mimeType = ctx.message.document.mime_type;
		const mimeTypeXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		const mimeTypeJSON = 'application/json';
		if (mimeType === mimeTypeXlsx || mimeType === mimeTypeJSON) {
		} else {
			ctx.reply(
				'Файл должен быть файлом Excel или JSON. Расширение - xlsx или json\nПопробуйте еще раз.'
			);
			return false;
		}

		const resGetFile = await ctx.telegram.getFile(fileId);
		const filePath = resGetFile.file_path;

		const isExistsFile = await downloadFile(fileName, filePath, dlPath);

		if (isExistsFile) {
			ctx.reply('Файл с таким именем уже существует\nПопробуйте еще раз.');
			return false;
		}
		await ctx.reply('Файл загружен');
		return true;
	} catch (error) {
		console.log(error);
	}
}
