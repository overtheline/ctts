import * as bodyParser from 'body-parser';
import { Router } from 'express';
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import {
	map,
	pick,
} from 'lodash';
import * as morgan from 'morgan';
import * as path from 'path';

import {
	ITestIrisDatum,
} from '../types';
import {
	connectToDb,
	getAllIrisData,
	getQuotes,
} from './database';
import {
	CTTSKNN,
	IDatum,
} from './ml/ctts-knn';

class App {
	public app: Application;
	private dataRouter: Router;
	private cttsknn: CTTSKNN;

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

		connectToDb().then(
			() => {
				getAllIrisData().then(
					(irisData: any[]) => { this.runCTTSKNN(irisData); },
					(err) => { console.log(err); }
				);
			},
			(err) => { console.log('connectToDb error', err); }
		);
	}

	private runCTTSKNN(irisData: any[]) {
		const irisFeatures = [
			'sepalLength',
			'sepalWidth',
			'petalLength',
			'petalWidth',
		];

		const preparedData: IDatum[] = map(irisData, (datum) => {
			const features = pick(datum, irisFeatures);
			const classification = datum.type;

			return ({
				classification,
				features,
			});
		});

		this.cttsknn = new CTTSKNN({
			data: preparedData,
			featureKeys: irisFeatures,
		});
	}

	private mountRoutes(): void {
		this.dataRouter.get('/words', getQuotes);

		this.dataRouter.get('/quotes', (req, res) => {
			res.json(req.query.name);
		});

		this.dataRouter.get('/predictIris', (req, res) => {
			const irisItem = {
				petalLength: Number(req.query.petalLength),
				petalWidth: Number(req.query.petalWidth),
				sepalLength: Number(req.query.sepalLength),
				sepalWidth: Number(req.query.sepalWidth),
			};

			res.json(this.cttsknn.predict(irisItem));
		});

		this.dataRouter.get('/irisData', (req, res) => {
			getAllIrisData().then(
				(irisData: any[]) => { res.json(irisData); },
				(err) => { res.json(err); }
			);
		});
	}
}

export default new App().app;
