export function finalMessage(ctx) {
	return `
Проверьте данные:
<b>Имя:</b> ${ctx.session.data.account.firstName};
<b>Фамилия:</b> ${ctx.session.data.account.lastName};
<b>Пол:</b> ${ctx.session.data.account.gender};
<b>Имя в Звифте:</b> ${ctx.session.data.account.firstNameZwift};
<b>Фамилия в Звифте:</b> ${ctx.session.data.account.lastNameZwift};
<b>Велотрейнер:</b> ${ctx.session.data.account.cycleTrainer};
<b>ZwiftPower:</b> ${ctx.session.data.account.zwiftPower};
=============================
Если всё верно, для <b>сохранения</b> наберите <u>/save</u>
Для <b>повторного ввода</b> данных <u>/repeat</u>
Для выхода <b>без сохранения</b> информации <u>/quit</u>
`;
}
export function finalMessageTeamCr(ctx) {
	return `
Проверьте данные:
<b>Название команды:</b> ${ctx.session.data.teamCreate.name};
<b>Краткое описание:</b> ${ctx.session.data.teamCreate.description};
<b>Капитан команды:</b> ${ctx.session.data.teamCreate.telegramUsername};
=============================
Если всё верно, для <b>сохранения</b> наберите <u>/save</u>
Для <b>повторного ввода</b> данных <u>/repeat</u>
Для выхода <b>без сохранения</b> информации <u>/quit</u>
`;
}

//<b>Год рождения:</b> ${ctx.session.data.account.yearBirth};

export function riderData(rider) {
	return `
Для изменения данных необходимо ввести все данные заново.
Ваши данные в БД:
=============================
<b>Имя:</b> ${rider.firstName};
<b>Фамилия:</b> ${rider.lastName};
<b>Пол:</b> ${rider.gender};
<b>Имя в Звифте:</b> ${rider.firstNameZwift};
<b>Фамилия в Звифте:</b> ${rider.lastNameZwift};
<b>Велотрейнер:</b> ${rider.cycleTrainer};
<b>ZwiftPower:</b> ${rider.zwiftPower};
=============================
Для выхода <b>без сохранения</b> информации <u>/quit</u>
`;
}
