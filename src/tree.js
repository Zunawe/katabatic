const {vec2} = require('vecn')

const phi = (1 + Math.sqrt(5)) / 2
const dt = 0.02

class Tree {
  constructor (ctx, pos, scale) {
    this._salt = Math.random()

    this._greenShade = Math.trunc((Math.random() * 20) + 180).toString(16)

    // Spring constant
    this._kappa = 21.2
    this.omega = 0
    // Angular position
    this.theta = ((this._salt * 5)) * Math.PI / 180

    this.ctx = ctx

    // Position of the center of this tree
    this.pos = vec2(pos)
    // Distance from center to top and bottom middle
    this.r = phi + (this._salt * 0.3) - 0.15
    this.scale = scale
  }

  draw () {
    this.ctx.fillStyle = '#40' + this._greenShade + '50'

    this.ctx.save()
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.theta / 2)
    this.ctx.scale(this.scale, this.scale)

    this.ctx.beginPath()

    this.ctx.moveTo(-0.5, this.r * 0.25)
    this.ctx.lineTo(0.5, this.r * 0.25)

    this.ctx.rotate(this.theta)
    this.ctx.lineTo(0, -this.r * 0.75)

    this.ctx.closePath()

    this.ctx.fill()
    this.ctx.restore()
  }

  /**
   * Updates the tree's parameters.
   * @param {vec2} Fw The force of the wind.
   */
  update (Fw) {
    // Torque
    let tao = (this.r * Fw * Math.sin(this.theta + (Math.PI / 2))) - (this._kappa * this.theta) - (2 * this.omega)
    let alpha = tao / this.r / this.r

    this.theta = this.theta + (this.omega * dt) + (0.5 * alpha * dt * dt)
    this.omega = this.omega + (alpha * dt)
  }
}

module.exports = Tree
