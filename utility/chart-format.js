import { regexp } from '../modules/text.js';

export function format(value, lengthColumn) {
	try {
		if (value === 'undefined') value = undefined;
		//удаление всех emoji
		if (value) value = value.replace(regexp, '');
		if (value) value = value.replace('https://', '');
		if (value) value = value.replace('⁣', '');
		if (value) value = value.replace('⁣', '');

		//ширина столбцов
		if (!value) {
			let spaces = '';
			for (let i = 0; i < lengthColumn; i++) {
				spaces += ' ';
			}
			return spaces + '|';
		}
		// убрать символы, которые не помещаются в столбец
		if (value.length > lengthColumn) {
			return value.slice(0, lengthColumn - 1) + '.' + '|';
		}
		// добавить символы до нужной ширины столбца
		if (value.length < lengthColumn) {
			const missingSpaces = lengthColumn - value.length;
			let spaces = '';
			for (let i = 0; i < missingSpaces; i++) {
				spaces += ' ';
			}
			return value + spaces + '|';
		}
		return value + '|';
	} catch (error) {
		console.log(error);
	}
}
