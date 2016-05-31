(function() {
  window.addEventListener('load', function() {
    var animationLoop, canvas, canvasElement, currentTime, draw, drawOrb, newOrb, orbStartTime, orbTimer, orbs, update;
    canvasElement = document.querySelector('canvas.bg-animation');
    canvasElement.width = window.outerWidth;
    canvasElement.height = window.outerHeight;
    canvas = canvasElement.getContext('2d');
    orbs = [];
    orbTimer = 0.4;
    orbStartTime = orbTimer;
    currentTime = Date.now();
    canvas.font = '16pt sans-serif';
    canvas.fillStyle = 'rgba(255, 255, 255, 0.02)';
    newOrb = function() {
      return orbs.push({
        x: window.innerWidth + 100,
        y: Math.random() * window.innerHeight,
        size: Math.random() + 0.2,
        offset: Math.random() * 10
      });
    };
    drawOrb = function(orb) {
      var sineOffset;
      sineOffset = Math.sin(currentTime / 1000 + orb.offset) * 20;
      canvas.beginPath();
      canvas.arc(orb.x, orb.y + sineOffset, 80 * orb.size, 0, Math.PI * 2);
      return canvas.fill();
    };
    update = function(delta) {
      orbTimer -= delta;
      while (orbTimer <= 0) {
        orbTimer = orbStartTime;
        newOrb();
      }
      return orbs = orbs.filter(function(orb) {
        orb.x -= 100 * delta * orb.size;
        return orb.x > -100;
      });
    };
    draw = function() {
      var i, len, orb, results;
      canvas.clearRect(0, 0, window.outerWidth, window.outerHeight);
      results = [];
      for (i = 0, len = orbs.length; i < len; i++) {
        orb = orbs[i];
        results.push(drawOrb(orb));
      }
      return results;
    };
    animationLoop = function() {
      var delta;
      delta = (Date.now() - currentTime) * 0.001;
      currentTime = Date.now();
      if (document.hasFocus()) {
        update(delta);
        draw();
      }
      return window.requestAnimationFrame(animationLoop);
    };
    while ((orbs[0] == null) || orbs[0].x > 0) {
      update(0.05);
    }
    draw();
    return animationLoop();
  });

}).call(this);
