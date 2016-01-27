import zipObject from 'lodash/array/zipObject';
import React from 'react';
import Kefir from 'kefir';

const TICK = 17;

function _childrenToList(children) {
  const list = [];
  React.Children.forEach(children, child => {
    list.push(child);
  });
  return list;
}

const ReorderChildWrapper = React.createClass({
  componentWillMount: function() {
    this.resetter = Kefir.emitter();
  },
  moveRelativeY(y) {
    this.resetter.emit();
    if (this.isMounted()) {
      const node = this.getDOMNode();
      let animated = false;
      if (!node.classList.contains('reorder-wrapper-item')) {
        if (y !== 0) {
          node.classList.add('reorder-wrapper-item');
          node.style.top = '0';
          Kefir.later(TICK).takeUntilBy(this.resetter).onValue(() => {
            node.style.top = y+'px';
          });
          animated = true;
        }
      } else {
        if (parseInt(node.style.top, 10) !== y) {
          node.style.top = y+'px';
          animated = true;
        }
      }
      if (animated) {
        return Kefir.merge([
          Kefir.fromEvent(node, 'transitionend'),
          Kefir.fromEvent(node, 'webkitTransitionEnd'),
          Kefir.fromEvent(node, 'mozTransitionEnd'),
          Kefir.fromEvent(node, 'oTransitionEnd'),
          Kefir.fromEvent(node, 'MSTransitionEnd')
        ]).take(1).takeUntilBy(this.resetter);
      }
    }
    return Kefir.constant(null);
  },
  resetRelativeY() {
    this.resetter.emit();
    if (this.isMounted()) {
      const node = this.getDOMNode();
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

    if (
      this.isMounted() &&
      prevChildList.length > 0 && prevChildList.length === nextChildList.length
    ) {
      const length = prevChildList.length;
      const prevKeys = prevChildList.map(child => child.key);
      const nextKeysSet = new Set(nextChildList.map(child => child.key));

      const keyHeights = zipObject(prevChildList.map(child => {
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

      const streams = [];
      for (let key in lastKeyYs) {
        const ref = this.refs[key];
        streams.push(ref.moveRelativeY(newKeyYs[key] - lastKeyYs[key]));
      }
      Kefir.combine(streams)
        .take(1)
        .onValue(() => {
          this._resetChildren(nextProps.children);
        });
    } else {
      this._resetChildren(nextProps.children);
    }
  },
  _resetChildren(nextChildren) {
    for (let key in this.refs) {
      const ref = this.refs[key];
      ref.resetRelativeY();
    }
    this.setState({
      children: nextChildren
    });
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
