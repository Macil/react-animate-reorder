import _ from 'lodash';
import React from 'react';

function _childrenToList(children) {
  const list = [];
  React.Children.forEach(children, child => {
    list.push(child);
  });
  return list;
}

const ReorderChildWrapper = React.createClass({
  moveRelativeY(y) {
    if (this.isMounted()) {
      const node = this.getDOMNode();
      if (!node.classList.contains('reorder-wrapper-item')) {
        node.classList.add('reorder-wrapper-item');
        node.style.top = '0';
        setTimeout(() => {
          node.style.top = y+'px';
        }, 1);
      } else {
        node.style.top = y+'px';
      }
      console.log('will move', node, y);
    }
  },
  resetRelativeY() {
    if (this.isMounted()) {
      node.classList.remove('reorder-wrapper-item');
      node.style.top = '';
    }
  },
  render() {
    return this.props.children;
  }
});

const ReorderAnimator = React.createClass({
  getDefaultProps() {
    return {
      component: 'div',
      style: {
        position: 'relative'
      }
    };
  },
  getInitialState() {
    return {
      children: this.props.children
    };
  },
  componentWillReceiveProps(nextProps) {
    const prevChildList = _childrenToList(this.state.children);
    const nextChildList = _childrenToList(nextProps.children);

    let didReorder = false;

    if (prevChildList.length > 0 && prevChildList.length === nextChildList.length) {
      const length = prevChildList.length;
      const prevKeys = prevChildList.map(child => child.key);
      const nextKeysSet = new Set(nextChildList.map(child => child.key));

      const isReorder = prevKeys.every(prevKey =>
        nextKeysSet.has(prevKey) && this.refs[prevKey] && this.refs[prevKey].isMounted()
      );
      if (isReorder) {
        const keyHeights = _.zipObject(prevChildList.map(child => {
          const ref = this.refs[child.key];
          const height = ref.getDOMNode().offsetHeight;
          return [child.key, height];
        }));

        const lastKeyYs = {};
        {
          lastKeyYs[ prevChildList[0].key ] = 0;
          let lastY = 0;
          for (let i=1; i < prevChildList.length; i++) {
            const y = lastY + keyHeights[prevChildList[i-1].key];
            lastKeyYs[ prevChildList[i].key ] = y;
            lastY = y;
          }
        }

        const newKeyYs = {};
        {
          newKeyYs[ nextChildList[0].key ] = 0;
          let lastY = 0;
          for (let i=1; i < nextChildList.length; i++) {
            const y = lastY + keyHeights[nextChildList[i-1].key];
            newKeyYs[ nextChildList[i].key ] = y;
            lastY = y;
          }
        }

        for (let key in lastKeyYs) {
          const ref = this.refs[key];
          //ref.moveRelativeY(lastKeyYs[key] - newKeyYs[key]);
          ref.moveRelativeY(newKeyYs[key] - lastKeyYs[key]);
        }
        didReorder = true;
      }

    }

    if (!didReorder) {
      for (let key in refs) {
        const ref = this.refs[key];
        ref.resetRelativeY();
      }
      this.setState({
        children: nextProps.children
      });
    }
  },
  render() {
    const children = React.Children.map(this.state.children, child =>
      <ReorderChildWrapper ref={ child.key }>{ child }</ReorderChildWrapper>
    );
    return React.createElement(
      this.props.component,
      this.props,
      children
    );
  }
});

export default ReorderAnimator;
