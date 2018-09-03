import * as React from 'react';

export interface ITimeRangeControlProps {
	options: string[];
	onClick: (event: any) => void;
}

export default function TimeRangeControl({ options, onClick }: ITimeRangeControlProps): JSX.Element {
	function mapInputs() {
		return options.map((option) => (
			<input
				key={option}
				onClick={onClick}
				type={'button'}
				value={option}
			/>
		));
	}

	return (
		<div className={'control-container'}>
			{mapInputs()}
		</div>
	);
}
