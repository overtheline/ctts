import * as bodyParser from 'body-parser';
import { Router } from 'express';
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as morgan from 'morgan';
import * as path from 'path';

import { db, ml } from '../services';

class App {
	public app: Application;
	private irisDataRouter: Router;
	private quoteDataRouter: Router;

	constructor() {
		// initialize server app
		this.app = express();

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
		this.quoteDataRouter.get('/getAllQuotes', db.getQuotes);
		this.quoteDataRouter.get('/addQuote', db.addQuote);
		this.irisDataRouter.get('/predictIris', ml.getIrisPrediction);
		this.irisDataRouter.get('/irisData', db.getAllIrisData);
	}
}

export default new App().app;
