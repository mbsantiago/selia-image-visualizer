import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';

import React from 'react';
import ReactDOM from 'react-dom';


import(/* webpackIgnore: true */'/visualizer.js').then(module => {
  var config = {
    canvas: document.getElementById('visualizerCanvas'),
    active: true,
    itemInfo: {
      url: 'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
    }
  }

  var visualizer = new Visualizer.default(config);

  ReactDOM.render(
    visualizer.renderToolbar(),
    document.getElementById('toolbar'));
});
