import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as morgan from 'morgan';
import * as path from 'path';

class App {
	express: Application;

	constructor() {
		this.express = express();
		this.mountRoutes();
	}

	private mountRoutes(): void {
		const router = express.Router();

		this.express.use(morgan('combined'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: true }));
		this.express.use('/', express.static(path.join(__dirname, '../public')));
		this.express.use('/data', router);

		router.get('/words', (req, res) => {
			console.log('words');
			res.json({
				foo: 'bar',
			});
		});

		router.post('/quotes', (req, res) => {
			console.log(req.body.text);
			res.json(req.body.text);
		});
	}
}

export default new App().express;
