import * as _ from 'lodash';
import * as React from 'react';
import Select from 'react-select';

export interface IProps {
	selectedTableData: number[][];
	selectedTableNames: string[];
	stockNames: string[];
}

export default class CorrelationTable extends React.Component<IProps, any> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			stockNames: props.stockNames.map((name) => ({ label: name, value: name })),
		};
	}

	public render(): JSX.Element {
		return (
			<div>
				<table>
					{this.renderHeaderRow()}
					{this.renderRows()}
				</table>
			</div>
		);
	}

	private renderHeaderRow(): JSX.Element {
		const rowData = this.props.selectedTableNames.map((name, index) => <td key={name}>{name}</td>);
		const crossCell = (<td key={'/'}>{'/'}</td>);

		return (<tr>{[crossCell, ...rowData]}</tr>);
	}

	private renderRows(): JSX.Element[] {
		return this.props.selectedTableData.map((dataRow, index) => {
			const rowData = dataRow.map((rowDatum, jdex) => (<td key={`${index}${rowDatum}`}>{rowDatum}</td>));
			const name = this.props.selectedTableNames[index];
			const nameCol = (
			<td key={`${index}${name}`}>
				<Select
					maxMenuHeight={200}
					onChange={logg}
					options={this.state.stockNames}
					value={_.find(this.state.stockNames, ({value}) => value === name)}
				/>
			</td>
			);

			return (<tr key={`row:${index}:${rowData[0]}`}>{[nameCol, ...rowData]}</tr>);
		});
	}
}

function logg(m: any) { console.log(m); }
