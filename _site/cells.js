"use strict";

let canvas, ctx;
let timeStamp = 0, oldTimeStamp = 0, dt = 0; // Time markers
let colors = ["#999999", "#ccccff"];

window.addEventListener("load", function(event) {
  canvas = document.getElementById("overworld");
  ctx = canvas.getContext("2d");
  // render grid inside canvas right from the start
  // renderer.drawGrid(canvas.width, canvas.height, "smallGrid");
  game.setup();
});

function cell(x = 0, y = 0, w = 1, h = 1) {
  this.x = x;
  this.y = y;
  // square w x l will represent cell (with w = l, of course, had them be different vars for the sake of generallization)
  this.w = w; // width
  this.h = h; // height

  // Determine whether or not the cell is dead or alive w/ coinflip odds
  this.isAlive = Math.random() > 0.5 ? true : false;
  // this.col = colors[isAlive];
  this.neighbors = 0; // Number of living neighbors around the cell on 2D plane
}
// var physics = (function() {}); // Not needed, there are no motion vectors to apply in this case

var renderer = (function() {
  function _drawGrid(w, h, id) { // grid that exists at all times
      var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
          <defs> \
              <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse"> \
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="black" stroke-width="1" /> \
              </pattern> \
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
                  <rect width="80" height="80" fill="url(#smallGrid)" /> \
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="black" stroke-width="1" /> \
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
    let color = entity.isAlive ? 1 : 0;
    _drawRect(entity.x, entity.y, entity.w, entity.h, colors[color]);
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
  let w = 5, h = 5; // width and height of cells
  let frame = 0, frameRate = 10;

  function _setup() {
    _populate();
    // _gameRules();
    window.requestAnimationFrame(_gameLoop);
    // renderer.render();
  }

  function _populate() {
    // dimensions that each cell will have
    // Fill up canvas with grid of cells, number depends on their size and the size of the canvas
    for(let x = 0; x < canvas.width; x += w) {
      for(let y = 0; y < canvas.height; y += h) {
        let c_new = new cell(x, y, w, h);
        _entities.push(c_new);
      }
    }
  }

  function _gameRules() {
    // apply game rules 
    // how many cells there are in each row (divide width by width of cell)
    let perRow = Math.floor(canvas.width/w);
    // same as top, with height
    let perCol = Math.floor(canvas.height/h);

    // iterate through each element and count neighbors for each one
    for(let i = 0; i < _entities.length; ++ i) {
      let currentCell = _entities[i];

      let leftOf = i - 1, rightOf = i + 1, top = i - perRow, bottom = i + perRow;
      let topLeft = top - 1, topRight = top + 1, bottomLeft = bottom - 1, bottomRight = bottom + 1;
      // reset, so = and not +=
      // could also write
      // currentCell.neighbors = 0;
      // currentCell.neighbors += leftOf  %  perRow == 0 ? 1 : 0;
      // .. etc
      // need to change this because we're not using sums of whether or not the cell has neighbors, because after checking if the neighbor exists, you have to see if said neighbor is alive or not
      // currentCell.neighbors = leftOf  %  perRow == 0 ? 1 : 0;
      // currentCell.neighbors += rightOf % perRow == 0 ? 1 : 0;
      // currentCell.neighbors += top >= 0 ? 1 : 0;
      // currentCell.neighbors += bottom <= _entities.length ? 1 : 0;

      currentCell.neighbors = 0; // reset, to recount the neighbors
      if(leftOf >= 0 && (leftOf % perRow) != perRow - 1) {
        if(_entities[leftOf].isAlive) {
          ++ currentCell.neighbors;
        }
        if(topLeft >= 0 && topLeft % perRow != perRow - 1) {
          if(_entities[topLeft].isAlive) {
            ++ currentCell.neighbors;
          }
        }
        if(bottomLeft >= 0 && bottomLeft < _entities.length && bottomLeft % perRow != perRow - 1) {
          if(_entities[bottomLeft].isAlive) {
            ++ currentCell.neighbors;
          }
        }
      } 
      if(rightOf < _entities.length && rightOf % perRow != 0) {
        if(_entities[rightOf].isAlive) {
          ++ currentCell.neighbors;
        }  
        if(topRight >= 0 && topRight % perRow != perRow - 1) {
          if(_entities[topRight].isAlive) {
            ++ currentCell.neighbors;
          }
        }
        if(bottomRight < _entities.length && bottomRight % perRow != 0) {
          if(_entities[bottomRight].isAlive) {
            ++ currentCell.neighbors;
          }
        }     
      }
      if(top >= 0) {
        if(_entities[top].isAlive) {
          ++ currentCell.neighbors;
        }
      }
      if(bottom < _entities.length) {
        if(_entities[bottom].isAlive) {
          ++ currentCell.neighbors;
        }
      }
    }

    for(let i = 0; i < _entities.length; ++ i) {
      let currentCell = _entities[i];
      if(currentCell.neighbors == 2) {

      }
      else if(currentCell.neighbors == 3) {
        currentCell.isAlive = true;
      }
      else {
        currentCell.isAlive = false;
      }
    }
  }

  function _gameLoop(timeStamp) {
    // timepass
    dt = (timeStamp - oldTimeStamp)/1000;
    dt = Math.min(dt, 0.1);
    oldTimeStamp = timeStamp;
    if(frame ++ >= frameRate) {
      frame = 0;
      _gameRules();
      // drawing
      // renderer.drawGrid(canvas.width, canvas.height, "smallGrid");
      renderer.clear();
      renderer.render();
    }

    window.requestAnimationFrame(_gameLoop);
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
