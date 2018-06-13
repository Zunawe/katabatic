const Layer = require('./layer.js')

// function shuffle (list) {
//   for (let i = list.length - 1; i > 0; --i) {
//     const j = Math.floor(Math.random() * (i + 1))
//     ;[list[i], list[j]] = [list[j], list[i]]
//   }
//   return list
// }

// function randomRange (lower, upper) {
//   return (Math.random() * (upper - lower)) - lower
// }

var windSpeed = 5

class App {
  constructor () {
    this.canvas = document.getElementById('my-canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  start () {
    this.wind = new Wind(windSpeed)

    this.layer = new Layer(this.ctx)

    this.ctx.canvas.width = window.innerWidth
    this.ctx.canvas.height = window.innerHeight
    this.update()
  }

  clear () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  update () {
    this.clear()

    this.layer.draw()
    // var d = new Date()
    // this.trees.forEach((tree) => {
    // tree.update(this.wind.getForce(d.getTime() - (tree.x * windSpeed / 3)))
    // tree.draw()
    // })
    window.requestAnimationFrame(this.update.bind(this))
  }
}

class Wind {
  constructor (speed = 5) {
    this.speed = speed
  }

  getForce (t) {
    var speed = (this.speed / 6) + 2
    return (this.speed / 5) * ((Math.sin(t / (10 * (speed + 1)))) * (Math.sin(t / 50))) + (speed / 2)
  }
}

var app = new App()
app.start()

window.addEventListener('resize', function () {
  app.canvas.width = window.innerWidth
  app.canvas.height = window.innerHeight
})
