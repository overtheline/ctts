import {
	bindAll,
} from 'lodash';
import * as React from 'react';

import {
	IIrisDatum,
	IRawIrisDatum,
} from '../../types';
import { createChart } from './chart/scatter';

interface IProps {
	title: string;
}

interface IState {
	name: string;
	text: string;
}

export default class App extends React.Component<IProps, IState> {
	irisChartRef: React.RefObject<any>;

	constructor(props: IProps) {
		super(props);

		this.irisChartRef = React.createRef();

		bindAll(this, [
			'handleSubmit',
			'handleNameChange',
			'handleTextChange',
			'handlePredict',
			'handleGetData',
			'handleGetQuotes',
		]);
	}

	componentDidMount() {
		fetch('/data/irisData')
			.then((res) => {
				return res.json();
			})
			.then((json: IRawIrisDatum[]) => {
				console.log(json);
				createChart(this.irisChartRef, '#iris-chart', json);
			});
	}

	handleNameChange(event: any) {
		this.setState({ name: event.target.value });
	}

	handleTextChange(event: any) {
		this.setState({ text: event.target.value });
	}

	handleSubmit(event: any) {
		event.preventDefault();
		return fetch(`/data/quotes?name=${this.state.name}&text=${this.state.text}`)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			console.log(json);
		});
	}

	handlePredict() {
		return fetch(`/data/predictIris?petalLength=${0.5}&petalWidth=${3.4}&sepalLength=${1.7}&sepalWidth=${2.5}`)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			console.log(json);
		});
	}

	handleGetData() {
		return fetch('/data/irisData')
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			console.log(json);
		});
	}

	handleGetQuotes() {
		return fetch('/data/words')
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			console.log(json);
		});
	}

	renderIrisChart() {
		return (
			<div id="iris-chart" />
		);
	}

	render() {
		return (
			<div>
				<h1>{this.props.title}</h1>
				<section>
					<div>
						<input type="button" value="predict" onClick={this.handlePredict}/>
					</div>
					<div>
						<input type="button" value="get data" onClick={this.handleGetData}/>
					</div>
					<div>
						{this.renderIrisChart()}
					</div>
				</section>
				<section>
					<h2>This is index.html</h2>
					<form onSubmit={this.handleSubmit}>
						<label>
							Name:
							<input type="text" placeholder="name" onChange={this.handleNameChange} />
						</label>
						<label>
							Text:
							<input type="text" placeholder="quote" onChange={this.handleTextChange} />
						</label>
						<input type="submit" value="Submit" />
					</form>
					<div>
						<input type="button" value="get quotes" onClick={this.handleGetQuotes}/>
					</div>
				</section>
			</div>
		);
	}
}
