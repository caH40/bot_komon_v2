import cors from 'cors';
import express from 'express';
import { route } from './routes/routes.js';

export async function serverExpress() {
	const app = express();
	const PORT = 8080;

	app.use(express.json());
	app.use(cors());

	app.use(route);
	app.listen(PORT, () => console.log('server started on PORT=' + PORT));
}
