import cors from 'cors';
import express from 'express';
import path from 'path';
import { routerAuth } from './routes/authentication.js';
import { router } from './routes/routes.js';

const __dirname = path.resolve();

export async function serverExpress() {
	const app = express();
	const PORT = 8080;

	app.use(express.json());
	app.use(express.static(path.resolve(__dirname, 'build')));
	app.use(cors());

	app.use(router);
	app.use(routerAuth);
	app.listen(PORT, () => console.log('server started on PORT=' + PORT));
}
