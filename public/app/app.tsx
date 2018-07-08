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
	private irisChartRef: React.RefObject<any>;

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

	public componentDidMount(): void {
		fetch('/data/irisData')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json: IRawIrisDatum[]) => { createChart(this.irisChartRef, '#iris-chart', json); },
				(err) => { console.log(err); }
			);
	}

	public handleNameChange(event: any): void {
		this.setState({ name: event.target.value });
	}

	public handleTextChange(event: any): void {
		this.setState({ text: event.target.value });
	}

	public handleSubmit(event: any): void {
		event.preventDefault();
		fetch(`/data/quotes?name=${this.state.name}&text=${this.state.text}`)
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { console.log(json); },
				(err) => { console.log(err); }
			);
	}

	public handlePredict(): void {
		fetch(`/data/predictIris?petalLength=${0.5}&petalWidth=${3.4}&sepalLength=${1.7}&sepalWidth=${2.5}`)
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { console.log(json); },
				(err) => { console.log(err); }
			);
	}

	public handleGetData(): void {
		fetch('/data/irisData')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { console.log(json); },
				(err) => { console.log(err); }
			);
	}

	public handleGetQuotes(): void {
		fetch('/data/words')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { console.log(json); },
				(err) => { console.log(err); }
			);
	}

	public renderIrisChart(): JSX.Element {
		return (
			<div id="iris-chart" />
		);
	}

	public render(): JSX.Element {
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
