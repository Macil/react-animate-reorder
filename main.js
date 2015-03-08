import _ from 'lodash';
import React from 'react';
import * as Components from './components.jsx';

const onReady = new Promise(function(resolve, reject) {
  if (document.readyState === "complete") {
    resolve();
  } else {
    document.addEventListener("DOMContentLoaded", resolve, false);
    window.addEventListener("load", resolve, false);
  }
});

onReady.then(main).catch(function(e) {
  console.error(e, e.stack);
});

function main() {
  const mainDiv = document.getElementById('main');
  let items = [
    {text:'a', key:'a'},
    {text:'b', key:'b'},
    {text:'c', key:'c'},
    {text:'d', key:'d'},
    {text:'e', key:'e'},
    {text:'f', key:'f'}
  ];
  function render() {
    React.render(
      React.createElement(Components.List, {items, shuffle, add, remove}),
      mainDiv
    );
  }
  function shuffle() {
    items = _.shuffle(items);
    render();
  }
  function add() {
    const val = ''+Math.random();
    const newItem = {text:val, key:val};
    items.splice(_.random(0, items.length), 0, newItem);
    render();
  }
  function remove() {
    items.splice(_.random(0, items.length-1), 1);
    render();
  }
  render();
}
