'use strict'

return {
    Z: 101,

    lineSpacing: 28,
    font: '22px moon',
    color: '#B0A000',

    time: 0,
    fps: 50,
    last: 0,
    smoothing: 0.99,

    init: function() {
        this.last = Date.now()
    },
    evo: function(dt) {
        this.time += dt
    },
    draw: function() {
        let t = Date.now()
        let d = (t - this.last)/1000
        if (d > 0) {
            let f = 1/d
            this.fps = (this.fps * this.smoothing) + (f * (1-this.smoothing))
        }

        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        ctx.font = this.font
        ctx.fillStyle = this.color

        let x = ctx.width - 20
        let y = ctx.height - 20

        let hshift = 0
        ctx.fillText('FPS: ' + Math.round(this.fps), x, y) 

        hshift += this.lineSpacing
        ctx.fillText('Time: ' + Math.floor(this.time), x, y - hshift)

        if (env.info) {
            Object.keys(env.info).forEach(key => {
                hshift += this.lineSpacing
                ctx.fillText(key + ': ' + env.info[key], x, y - hshift)
            })
        }

        this.last = t
    },
}
