const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

let db;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://localhost:27017/test', (err, client) => {
	if (err) { return console.log(err); }
	
	db = client.db('test');
	
	app.post('/quotes', (req, res) => {
		console.log(req.body);
		db.collection('quotes').save(req.body, (err, result) => {
			if (err) { return console.log(err); }
			
			console.log('saved to database');
			res.redirect('/');
		});
	});
	
	app.get('/', (req, res) => {
		console.log('get');
		res.sendFile(`${__dirname}/index.html`);
	});

	app.get('/words', (req, res) => {
		db.collection('quotes').find().toArray((err, results) => {
			console.log(results);
			res.json(results);
		});
	});
	
	app.listen(3000, () => {
		console.log('what what on 3000');
	});
});
