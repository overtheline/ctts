import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as path from 'path';

class App {
	express: Application;

	constructor() {
		this.express = express();
		this.mountRoutes();
	}

	private mountRoutes(): void {
		const router = express.Router();

		router.get('/', (req, res) => {
			res.sendFile(path.join(__dirname, '../public/index.html'));
		});

		this.express.use('/', express.static(path.join(__dirname, '../public')));
	}
}

export default new App().express;
