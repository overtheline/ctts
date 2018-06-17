import * as React from 'react';

interface IProps {
  title: string;
}

interface IState {
  name: string;
}

export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      name: 'world',
    };
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p> Hello {this.state.name}</p>
      </div>
    );
  }
}
