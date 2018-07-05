import * as bodyParser from 'body-parser';
import { Router } from 'express';
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as morgan from 'morgan';
import * as path from 'path';

import {
	ITestIrisDatum,
} from '../types';
import {
	getData,
	predict,
	runTrain,
} from './mljs/knn';

class App {
	app: Application;
	dataRouter: Router;

	constructor() {
		this.app = express();
		this.dataRouter = Router();

		this.init();
		this.mountRoutes();
	}

	private init() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(morgan('combined'));
		this.app.use('/', express.static(path.join(__dirname, '../public')));
		this.app.use('/data', this.dataRouter);

		runTrain();
	}

	private mountRoutes(): void {
		this.dataRouter.get('/words', (req, res) => {
			console.log('words');
			res.json({
				foo: 'bar',
			});
		});

		this.dataRouter.get('/quotes', (req, res) => {
			console.log(req.query.name);
			res.json(req.query.name);
		});

		this.dataRouter.get('/predictIris', (req, res) => {
			const irisItem: ITestIrisDatum = {
				petalLength: req.query.petalLength,
				petalWidth: req.query.petalWidth,
				sepalLength: req.query.sepalLength,
				sepalWidth: req.query.sepalWidth,
			};

			res.json({
				type: predict(irisItem),
			});
		});

		this.dataRouter.get('/irisData', (req, res) => {
			res.json(getData());
		});
	}
}

export default new App().app;
