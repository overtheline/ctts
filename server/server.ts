import * as bodyParser from 'body-parser';
import { Router } from 'express';
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as morgan from 'morgan';
import * as path from 'path';

import {
	addQuote,
	getQuotes,
} from './database';
import { IrisDataStore } from './iris-data-store';

class App {
	public app: Application;
	private irisDataStore: IrisDataStore;
	private irisDataRouter: Router;
	private quoteDataRouter: Router;

	constructor() {
		// initialize server app
		this.app = express();

		// construct new data stores
		this.irisDataStore = new IrisDataStore();

		// Routers for data
		this.irisDataRouter = Router();
		this.quoteDataRouter = Router();

		// setup server
		this.setup();
		this.mountRoutes();
	}

	private setup() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(morgan('combined'));

		// Static Routes
		this.app.use('/', express.static(path.join(__dirname, '../public')));

		// App Data Routes
		this.app.use('/irisdata', this.irisDataRouter);
		this.app.use('/quotedata', this.quoteDataRouter);

		// set up index.html route
		this.app.get('/', (req, res) => {
			res.sendfile(path.join(`${__dirname}/index.html`));
		});
	}

	private mountRoutes(): void {
		this.quoteDataRouter.get('/getAllQuotes', getQuotes);

		this.quoteDataRouter.get('/addQuote', addQuote);

		this.irisDataRouter.get('/predictIris', (req, res) => {
			const irisItem = {
				petalLength: Number(req.query.petalLength),
				petalWidth: Number(req.query.petalWidth),
				sepalLength: Number(req.query.sepalLength),
				sepalWidth: Number(req.query.sepalWidth),
			};

			this.irisDataStore.getPrediction(irisItem).then(
				(data: any) => { res.json(data); },
				(err) => { res.json(err); }
			);
		});

		this.irisDataRouter.get('/irisData', (req, res) => {
			this.irisDataStore.getIrisData().then(
				(irisData: any[]) => { res.json(irisData); },
				(err) => { res.json(err); }
			);
		});
	}
}

export default new App().app;
