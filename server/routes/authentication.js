import { Router } from 'express';
import {
	registration,
	authorization,
	logout,
	checkAuth,
	refresh,
	confirmEmail,
	resetPassword,
	checkRequestPassword,
	newPassword,
} from '../controllers/authentication.js';

export const routerAuth = new Router();

routerAuth.post('/registration', registration);
routerAuth.post('/authorization', authorization);
routerAuth.post('/logout', logout);
routerAuth.get('/check', checkAuth);
routerAuth.post('/refresh', refresh);
routerAuth.post('/confirm-email', confirmEmail);
routerAuth.post('/reset-password', resetPassword);
routerAuth.post('/check-request-password', checkRequestPassword);
routerAuth.post('/new-password', newPassword);
