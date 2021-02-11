"use strict";

let canvas, ctx;
let timeStamp = 0, oldTimeStamp = 0, dt = 0; // Time markers
let colors = ["#999999", "#ccccff"];

window.addEventListener("load", function(event) {
  canvas = document.getElementById("overworld");
  ctx = canvas.getContext("2d");
  // render grid inside canvas right from the start
  renderer.drawGrid(canvas.width, canvas.height, "smallGrid");
  game.setup();
});

function cell(x = 0, y = 0, w = 5, h = 5) {
  this.x = x;
  this.y = y;
  // square w x l will represent cell (with w = l, of course, had them be different vars for the sake of generallization)
  this.w = w; // width
  this.h = h; // height

  // Determine whether or not the cell is dead or alive w/ coinflip odds
  this.isAlive = Math.random() > 0.5 ? 1: 0;
  // this.col = colors[isAlive];
}

var renderer = (function() {
  function _drawGrid(w, h, id) { // grid that exists at all times
      var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
          <defs> \
              <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse"> \
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" stroke-width="1" /> \
              </pattern> \
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
                  <rect width="80" height="80" fill="url(#smallGrid)" /> \
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" stroke-width="1" /> \
              </pattern> \
          </defs> \
          <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
      </svg>';

      var DOMURL = window.URL || window.webkitURL || window;
      
      var img = new Image(); // blobbing
      var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      var url = DOMURL.createObjectURL(svg);
      
      img.onload = function () {
        // ctx.globalAlpha = 0.5;
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
      }
      img.src = url;
  }

  function _drawRect(x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  }

  function _drawCell(entity) {
    _drawRect(entity.x, entity.y, entity.w, entity.h, colors[entity.isAlive]);
  }

  function _render() { // renders game objects
    let i, entity, entities = game.entities();

    for(i = 0; i < entities.length; i ++) {
      entity = entities[i];
      if(entity instanceof cell) {
        _drawCell(entity);
      }
      else {
        _drawRect(entity);
      }
    }
  }

  function _clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { //accessor
    drawGrid: _drawGrid,
    drawRect: _drawRect,
    drawCell: _drawCell,
    render:   _render,
    clear:    _clear
  };
})();

var game = (function() {
  var _entities = []; // array to store cells
  var _deletion = []; // store objects marked for deletion

  function _setup() {
    _populate(5, 5);
    // window.requestAnimationFrame(_gameLoop);
    renderer.render();
  }

  function _populate(c_w, c_h) {
    // dimensions that each cell will have
    // Fill up canvas with grid of cells, number depends on their size and the size of the canvas
    for(let x = 0; x < canvas.width; x += c_w) {
      for(let y = 0; y < canvas.height; y += c_h) {
        let c_new = new cell(x, y, c_w, c_h);
        _entities.push(c_new);
      }
    }
  }

  function _gameLoop(timeStamp) {
    // timepass
    dt = (timeStamp - oldTimeStamp)/1000;
    dt = Math.min(dt, 0.1);
    oldTimeStamp = timeStamp;

    // drawing
    // renderer.clear();
    // renderer.render();

    // window.requestAnimationFrame(_gameLoop);
  }

  return { // accessors
    // methods
    setup:    _setup,
    populate: _populate,
    gameLoop: _gameLoop,

    // data
    entities: function() { return _entities; },
    deletion: function() { return _deletion; }
  }
})();
