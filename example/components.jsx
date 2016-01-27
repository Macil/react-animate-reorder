import React from 'react';
import ReorderAnimator from '../src';

export const Item = React.createClass({
  render() {
    return (
      <div className="item">
        Some item: {this.props.text} : lots of text aeiou aeiou aeiou aeiou aeiou
        aeiou aeiouaeiouaeiouaeiouaeiouaeiouaeiou aeiou aeiouaeiouaeiou aeiou
        {' '}
        {this.props.children}
      </div>
    );
  }
});

export const List = React.createClass({
  render() {
    const list = this.props.items.map(item =>
      <Item text={item.text} key={item.key}>Test <i>Text</i></Item>
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
