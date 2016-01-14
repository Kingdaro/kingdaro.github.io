# out: bg-animation.js, sourcemap: true

window.addEventListener 'load', ->
  canvasElement = document.querySelector('canvas.bg-animation')
  canvasElement.width = window.outerWidth
  canvasElement.height = window.outerHeight

  canvas = canvasElement.getContext '2d'

  orbs = []
  orbTimer = 0.4
  orbStartTime = orbTimer

  currentTime = Date.now()

  canvas.font = '16pt sans-serif'
  canvas.fillStyle = 'rgba(255, 255, 255, 0.02)'

  newOrb = ->
    orbs.push
      x: window.innerWidth + 100
      y: Math.random() * window.innerHeight
      size: Math.random() + 0.2
      offset: Math.random() * 10

    return

  drawOrb = (orb) ->
    sineOffset = Math.sin(currentTime / 1000 + orb.offset) * 20
    canvas.beginPath()
    canvas.arc orb.x, orb.y + sineOffset, 80 * orb.size, 0, Math.PI * 2
    canvas.fill()
    return

  update = (delta) ->
    if (orbTimer = orbTimer - delta) <= 0
      orbTimer += orbStartTime
      newOrb()

    orbs = orbs.filter (orb) ->
      orb.x -= 100 * delta * orb.size
      orb.x > -100

    return

  draw = ->
    canvas.clearRect 0, 0, window.outerWidth, window.outerHeight
    drawOrb orb for orb in orbs
    return

  animationLoop = ->
    delta = (Date.now() - currentTime) * 0.001
    currentTime = Date.now()

    if document.hasFocus()
      update delta
      draw()

    window.requestAnimationFrame animationLoop
    return

  for i in [1..250]
    update 0.1

  draw()
  animationLoop()

  return
