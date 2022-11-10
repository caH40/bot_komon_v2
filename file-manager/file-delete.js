import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

export function deleteFile(fileName, dlPath) {
	try {
		const pathSrc = path.resolve(__dirname, dlPath, fileName);
		fs.unlinkSync(pathSrc);
	} catch (error) {
		console.log(error);
	}
}
