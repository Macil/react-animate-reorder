# react-animate-reorder

This is a React component which causes its children to be animated to their new
positions if they're re-ordered.

Note that only vertical movement is handled currently, and adding or removing
elements to the list is not animated. The module
[react-shuffle](https://github.com/FormidableLabs/react-shuffle) handles that,
so you might want to use it instead. However, it currently mounts its children
twice and doesn't handle state well on its children.

## Usage

Your application must include this CSS rule:

```css
.reorder-wrapper-item {
  position: relative;
  transition: top 1s ease-in;
}
```

Then wrap some elements with the AnimateReorder component. Make sure that each
element has a unique key set!

```js
var AnimateReorder = require('react-animate-reorder');

class SomeComponent extends React.Component {
  render() {
    var list = [ /* ... */ ];
    return (
      <div>
        <AnimateReorder>
          {list}
        </AnimateReorder>
      </div>
    );
  }
}
```
