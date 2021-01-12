//Filling in static values for now
var c = document.getElementById("braceletview")
const minDimension = 400
const circleRadius = minDimension*.45
const braceletCenterX = 250
const braceletCenterY = 200

function renderViewer() {
  var c = document.getElementById("braceletview")
  console.log(c)
  drawBracelet(c)
}

function drawBracelet(drawingCanvas) {
  // calculate circle radius
  let ctx = drawingCanvas.getContext('2d')
  const numBeads = 20

  console.log(circleRadius)
  ctx.beginPath()
  ctx.arc(braceletCenterX, braceletCenterY, circleRadius, 0, 2*Math.PI)
  ctx.stroke()
// draw a skeleton of the beads around the bracelet
// all beads are assumed to be same size
  for (i=0; i<numBeads; i++) {
    // calc the position
      var angle = 90 + (i*(360/numBeads)) 
      drawBead(ctx, angle)
  }
}

// These should eventually not be on the canvas
function drawBeadList(beads) {

}


// draw individual bead 
function drawBead(context, angle) {
  let angleInRads = angle*(Math.PI/180)
  let partialX = Math.round((Math.cos(angleInRads) + Number.EPSILON)*100)/100
  console.log(partialX)
  let partialY = Math.round((Math.sin(angleInRads) + Number.EPSILON)*100)/100
  var centerX = braceletCenterX + (circleRadius*partialX)
  var centerY = braceletCenterY - (circleRadius*partialY)
  
  console.log(circleRadius*Math.cos(angle), circleRadius*Math.sin(angle))

  context.beginPath()
  context.arc(centerX, centerY, 20, 0, 2*Math.PI)
  context.stroke()
}