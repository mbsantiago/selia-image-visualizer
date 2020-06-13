import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';


import(/* webpackIgnore: true */'/visualizer.js').then(module => {
  const visualizer = new Visualizer.default({
    canvas: document.getElementById('visualizerCanvas'),
    toolbar: document.getElementById('toolbar'),
    active: false,
    itemInfo: {
      url: 'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
    },
  });
});
