const Tree = require('./tree.js')
const BezierSpline = require('../../bezier-spline/src/index.js')

class Layer {
  constructor (ctx) {
    this.ctx = ctx
    this.spline = new BezierSpline([
      [0, 500],
      [window.innerWidth / 2, 800],
      [window.innerWidth, 500]]
    )
    // this.spline = splineFromKnots([[0, 500], [window.innerWidth / 2, 800], [window.innerWidth, 500]].map((v) => vec2(v)), -0.2)

    var numTrees = 400
    var xs = [...Array(numTrees)].map(() => Math.random() * window.innerWidth)
    var ys = xs.map((x) => Math.random())
    this.treePositions = zip(xs, ys)

    this.trees = []
    this.treePositions.forEach((pos) => {
      this.trees.push(new Tree(this.ctx, pos))
    })
    this.trees.sort((a, b) => b.y - a.y)
  }

  get endPoint () {
    return this.spline[this.spline.length - 1][3]
  }

  get startPoint () {
    return this.spline[0][0]
  }

  draw () {
    this.ctx.fillStyle = '#409950'
    this.ctx.moveTo(...this.spline.curves[0].controlPoints[0])
    this.ctx.beginPath()
    for (let i = 0; i < this.spline.curves.length; ++i) {
      var [, [cx1, cy1], [cx2, cy2], [x2, y2]] = this.spline.curves[i].controlPoints
      this.ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2)
    }
    this.ctx.lineTo(window.innerWidth, window.innerHeight)
    this.ctx.lineTo(0, window.innerHeight)
    this.ctx.closePath()
    this.ctx.fill()
    this.trees.forEach((tree) => tree.draw())

    // for (let x = 0; x < window.innerWidth; x += 50) {
    //   let y = this.spline.getPoints(0, x)[0].y
    //   this.ctx.beginPath()
    //   this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
    //   this.ctx.fill()
    // }

    // Commented lines draw knots for debugging purposes.
    this.ctx.fillStyle = '#000000'
    for (let i = 0; i < this.spline.curves.length; ++i) {
      this.ctx.beginPath()
      this.ctx.arc(this.spline.curves[i].controlPoints[0].x, this.spline.curves[i].controlPoints[0].y, 4, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.beginPath()
      this.ctx.arc(this.spline.curves[i].controlPoints[3].x, this.spline.curves[i].controlPoints[3].y, 4, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }
}

function zip (...lists) {
  return lists[0].map((_, i) => lists.map((list) => list[i]))
}

module.exports = Layer
