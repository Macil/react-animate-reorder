import _ from 'lodash';
import React from 'react';
import ReorderAnimator from './reorder-animator.jsx';

export const Item = React.createClass({
  render() {
    return (
      <div className="item">
        Some item: {this.props.text}
      </div>
    );
  }
});

export const List = React.createClass({
  render() {
    const list = this.props.items.map(item =>
      <Item text={item.text} key={item.key} />
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
