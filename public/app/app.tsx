import * as React from 'react';

export default class App extends React.Component<any, any> {
	public render(): JSX.Element {
		return (
			<div>
				<h1>{'App Template'}</h1>
				<section>
					<h2>{'Section 1'}</h2>
				</section>
				<section>
					<h2>{'Section 2'}</h2>
				</section>
			</div>
		);
	}
}
