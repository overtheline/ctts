import * as bodyParser from 'body-parser';
import { Router } from 'express';
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as morgan from 'morgan';
import * as path from 'path';

import {
	db,
	graphs,
	ml,
} from '../services';

class App {
	public app: Application;
	private irisDataRouter: Router;
	private quoteDataRouter: Router;
	private graphsDataRouter: Router;
	private spDataRouter: Router;

	constructor() {
		// initialize server app
		this.app = express();

		// Routers for data
		this.irisDataRouter = Router();
		this.quoteDataRouter = Router();
		this.graphsDataRouter = Router();
		this.spDataRouter = Router();

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
		this.app.use('/graphs', this.graphsDataRouter);
		this.app.use('/sp', this.spDataRouter);

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

		this.graphsDataRouter.get('/miserables', graphs.getMiserables);
		this.graphsDataRouter.get('/randomGraph', graphs.getRandomGraph);

		this.spDataRouter.get('/names', db.getSPNames);
		this.spDataRouter.get('/data', db.getSPData);
	}
}

export default new App().app;
