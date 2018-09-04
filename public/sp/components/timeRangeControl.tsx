import * as React from 'react';

import './timeRangeControlStyles.css';

export interface ITimeRangeControlProps {
	options: string[];
	onClick: (event: any) => void;
	selectedTimeRangeOption: string;
}

export default function TimeRangeControl({
	options,
	onClick,
	selectedTimeRangeOption,
}: ITimeRangeControlProps): JSX.Element {
	function mapInputs() {
		return options.map((option) => {
			const classStyle = option === selectedTimeRangeOption
				? 'selected-button' : 'button';

			return (
				<input
					className={classStyle}
					key={option}
					onClick={onClick}
					type={'button'}
					value={option}
				/>
			);
		});
	}

	return (
		<div className={'control-container'}>
			{mapInputs()}
		</div>
	);
}
