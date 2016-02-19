import React from 'react';
import ReorderAnimator from '../src';

export class Item extends React.Component {
  state = {
    selected: false
  };

  render() {
    return (
      <div
        className="item"
        style={{
          height: this.props.height||'auto',
          background: this.state.selected?'blue':'none'
        }}
        onClick={() => {this.setState({selected: !this.state.selected})}}
      >
        Some item: {this.props.text} : lots of text aeiou aeiou aeiou aeiou aeiou
        aeiou aeiouaeiouaeiouaeiouaeiouaeiouaeiou aeiou aeiouaeiouaeiou aeiou
        {' '}
        {this.props.children}
      </div>
    );
  }
}

export const List = React.createClass({
  render() {
    const list = this.props.items.map(item =>
      <Item text={item.text} height={item.height} key={item.key}>
        Test <i>Text</i>
      </Item>
    );
    return (
      <div className="list">
        Hello, this is list!<br/>
        <button onClick={this.props.shuffle}>Shuffle</button>
        <button onClick={this.props.add}>Add</button>
        <button onClick={this.props.remove}>Remove</button>
        <br/>
        <ReorderAnimator>
          {list}
        </ReorderAnimator>
      </div>
    );
  }
});
