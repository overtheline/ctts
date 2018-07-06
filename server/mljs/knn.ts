import * as csv from 'csvtojson';
import * as KNN from 'ml-knn';
import * as path from 'path';

import { IRawIrisDatum, ITestIrisDatum } from '../../types';
import { getAllIrisData } from '../database';

let knn: any;

const csvFilePath = path.join(__dirname, 'iris.csv');

const names = [
	'sepalLength',
	'sepalWidth',
	'petalLength',
	'petalWidth',
	'type',
];

let separationSize: number;

let data: IRawIrisDatum[] = [];
const X: number[][] = [];
const y: number[] = [];

let trainingSetX: any[] = [];
let trainingSetY: any[] = [];
let testSetX: number[][] = [];
let testSetY: number[] = [];

export function runTrain() {
	getAllIrisData()
		.then((jsonObj: IRawIrisDatum[]) => {
			data = jsonObj;
			separationSize = 0.7 * data.length;
			data = shuffleArray(data);
			dressData();
		}, (err) => { console.log(err); });
}

export function getData(): IRawIrisDatum[] {
	return data;
}

function shuffleArray(array: any[]) {
	const stage = array.map((datum) => ({ datum, sortOrder: Math.random() }));
	stage.sort((a, b) => a.sortOrder - b.sortOrder);
	return stage.map((d) => d.datum);
}

function dressData() {
	const types = new Set();

	data.forEach((row) => {
		types.add(row.type);
	});

	const typesArray = [...types];

	data.forEach((row) => {
		const keys = [
			'sepalLength',
			'sepalWidth',
			'petalLength',
			'petalWidth',
		];
		const rowArray = keys.map((key: keyof IRawIrisDatum) => parseFloat(row[key]));
		const typeNumber = typesArray.indexOf(row.type);

		X.push(rowArray);
		y.push(typeNumber);
	});

	trainingSetX = X.slice(0, separationSize);
	trainingSetY = y.slice(0, separationSize);
	testSetX = X.slice(separationSize);
	testSetY = y.slice(separationSize);

	train();
}

function train() {
	knn = new KNN(trainingSetX, trainingSetY, {k: 5});
	test();
}

function test() {
	const result = knn.predict(testSetX);
	const testSetLength = testSetX.length;
	const predictionError = error(result, testSetY);
	console.log(`Test Set Size = ${testSetLength} and nummber of Misclassifications = ${predictionError}`);
	// predict();
}

function error(predicted: any, expected: any) {
	let misclassifications = 0;
	for (let index = 0; index < predicted.length; index++) {
		if (predicted[index] !== expected[index]) {
			misclassifications++;
		}
	}

	return misclassifications;
}

export function predict({
	petalLength,
	petalWidth,
	sepalLength,
	sepalWidth,
}: ITestIrisDatum) {
	const temp = [
		Number(petalLength),
		Number(petalWidth),
		Number(sepalLength),
		Number(sepalWidth),
	];

	console.log(temp);

	const prediction = knn.predict(temp);
	console.log(`With ${temp} -- type = ${prediction}`);

	return prediction;
}
