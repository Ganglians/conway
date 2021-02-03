let canvas, ctx;

window.addEventListener("load", function(event) {
  canvas = document.getElementById("overworld");
  ctx = canvas.getContext("2d");
  renderer.drawGrid(canvas.width, canvas.height, "smallGrid");
});

var renderer = (function() {

  function _drawGrid(w, h, id) {
      var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
          <defs> \
              <pattern id="smallGrid" width="4" height="4" patternUnits="userSpaceOnUse"> \
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.2" /> \
              </pattern> \
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
                  <rect width="80" height="80" fill="url(#smallGrid)" /> \
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" /> \
              </pattern> \
          </defs> \
          <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
      </svg>';

      var DOMURL = window.URL || window.webkitURL || window;
      
      var img = new Image();
      var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      var url = DOMURL.createObjectURL(svg);
      
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
      }
      img.src = url;
  }

  return { //accessor
    drawGrid: _drawGrid
  };
})();