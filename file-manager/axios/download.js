import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
// сохранение файла на сервере
export async function downloadFile(name, pathTelegram, dlPath) {
	try {
		const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${pathTelegram}`;

		const pathSrc = path.resolve(__dirname, dlPath, name);
		const isExistsFile = fs.existsSync(pathSrc);
		if (isExistsFile) return true;

		const writeStream = fs.createWriteStream(pathSrc);

		const resAxios = await axios({
			url,
			method: 'GET',
			responseType: 'stream',
		});

		resAxios.data.pipe(writeStream);

		writeStream.on('finish', () => console.log(`${name} was downloaded`));
		writeStream.on('error', error => console.log('module-download.js', error));
	} catch (error) {
		console.log(error);
	}
}
