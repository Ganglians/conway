let canvas, ctx;

window.addEventListener("load", function(event) {
  canvas = document.getElementById("overworld");
  ctx = canvas.getContext("2d");
  renderer.drawGrid();
});


var renderer = (function() {
  function _drawGrid() {
    ctx.beginPath();
    // ctx.lineWidth = '.5';
    // ctx.strokeStyle = 'black';

    for(let x = 0; x < canvas.width; x += 30) {
      ctx.lineWidth = '.1';
         ctx.strokeStyle = 'black';
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }


  }

  return {
    drawGrid: _drawGrid
  };
})();