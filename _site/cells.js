"use strict";

let canvas, ctx;
let timeStamp = 0, oldTimeStamp = 0, dt = 0; // Time markers


window.addEventListener("load", function(event) {
  canvas = document.getElementById("overworld");
  ctx = canvas.getContext("2d");
  // render grid inside canvas right from the start
  renderer.drawGrid(canvas.width, canvas.height, "smallGrid");
  game.setup();
});

function cell(x = 10, y = 10, w = 10, h = 10, col = "green") {
  this.x = x;
  this.y = y;
  // square w x l will represent cell (with w = l, of course, had them be different vars for the sake of generallization)
  this.w = w; // width
  this.h = h; // height
  this.col = col; // cell color
}

var renderer = (function() {
  function _drawGrid(w, h, id) { // grid that exists at all times
      var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
          <defs> \
              <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse"> \
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="black" stroke-width=".09" /> \
              </pattern> \
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
                  <rect width="80" height="80" fill="url(#smallGrid)" /> \
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" /> \
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
    _drawRect(entity.x, entity.y, entity.w, entity.h, entity.col);
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
    let cellA = new cell(10, 10, 100, 10);
    _entities.push(cellA);
    // window.requestAnimationFrame(_gameLoop);
    renderer.render();
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
    gameLoop: _gameLoop,

    // data
    entities: function() { return _entities; },
    deletion: function() { return _deletion; }
  }
})();
