import {
	bindAll,
} from 'lodash';
import * as React from 'react';

interface IProps {
	title: string;
}

interface IState {
	name: string;
	text: string;
}

export default class App extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		bindAll(this, [
			'handleSubmit',
			'handleNameChange',
			'handleTextChange',
		]);
	}

	handleNameChange(event: any) {
		this.setState({ name: event.target.value });
	}

	handleTextChange(event: any) {
		this.setState({ text: event.target.value });
	}

	handleSubmit(event: any) {
		event.preventDefault();
		return fetch('/data/quotes', {
			body: JSON.stringify(this.state),
			method: 'POST',
		}).then((res) => {
			console.log(res);
		});
	}

	render() {
		return (
			<div>
				<h1>{this.props.title}</h1>
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
			</div>
		);
	}
}
