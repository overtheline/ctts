import {
	map,
} from 'lodash';
import * as React from 'react';
import Select from 'react-select';
import './styles.css';

interface ISelectOption {
	label: string;
	value: string;
}

interface IState {
	spNames: ISelectOption[];
}

export default class SPApp extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			spNames: [],
		};
	}

	public componentDidMount() {
		this.fetchSPNames();
	}

	public render() {
		return (
			<div>
				<h1>S and P</h1>
				<div className={'dropdown'}>
					{!!this.state.spNames.length && this.renderNamesDropdown()}
				</div>
			</div>
		);
	}

	private renderNamesDropdown = () => (
		<Select options={this.state.spNames} />
	)

	private fetchSPNames = () => {
		fetch('/sp/names').then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(names: string[]) => {
				const spNames = map(
					names,
					(name) => ({
						label: name,
						value: name,
					})
				);
				this.setState({ spNames });
			}
		);
	}
}
