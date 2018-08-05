import { bindAll } from 'lodash';
import * as React from 'react';
import { runInThisContext } from 'vm';

interface IState {
	name: string;
	text: string;
	quotes: Array<{
		name: string;
		text: string;
	}>;
}

export default class App extends React.Component<{}, IState> {
	constructor(props: {}) {
		super(props);

		this.state = {
			name: '',
			quotes: [],
			text: '',
		};

		bindAll(this, [
			'handleGetQuotes',
			'handleSubmit',
			'handleNameChange',
			'handleTextChange',
		]);
	}

	public handleGetQuotes(): void {
		fetch('/quotedata/getAllQuotes')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { this.setState({ quotes: json}); },
				(err) => { console.log(err); }
			);
	}

	public handleSubmit(event: any): void {
		event.preventDefault();
		fetch(`/quotedata/addQuote?name=${this.state.name}&text=${this.state.text}`)
			.then(
				(res) => ({}),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { console.log(json); },
				(err) => { console.log(err); }
			);
	}

	public handleNameChange(event: any): void {
		this.setState({ name: event.target.value });
	}

	public handleTextChange(event: any): void {
		this.setState({ text: event.target.value });
	}

	public renderQuotes() {
		return this.state.quotes.map(({ name, text}, i) => {
			return (
				<div key={`${name}:${text}:${i}`}>
					{`${name}: ${text}`}
				</div>
			);
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<h1>{'App Template'}</h1>
				<section>
					<h2>{'Section 1: Add a Quote'}</h2>
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
				</section>
				<section>
					<h2>{'Section 2: Get the Quotes'}</h2>
					<div>
						<input type="button" value="get quotes" onClick={this.handleGetQuotes}/>
					</div>
					<div>
						{this.renderQuotes()}
					</div>
				</section>
			</div>
		);
	}
}
