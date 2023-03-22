import cors from 'cors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import { routerAuth } from './routes/authentication.js';
import { router } from './routes/routes.js';
import { routerZP } from './routes/routesZP.js';

const __dirname = path.resolve();

export async function serverExpress() {
	const PORT = 8080;

	const app = express();
	app.use(cors());
	// app.use(
	// 	cors({
	// 		credentials: true,
	// 		origin: process.env.FRONT,
	// 	})
	// );
	app.use(express.json({ limit: '5mb' }));

	app.use(cookieParser());

	app.use(express.static(path.resolve(__dirname, 'build')));

	app.use(router);
	app.use(routerZP);
	app.use('/api/auth', routerAuth);
	app.listen(PORT, () => console.log('server started on PORT=' + PORT));
}
