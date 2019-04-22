'use strict'

let instances = 0

const defaults = {
    clip: true,
    opaque: false,
    color: {
        background: '#32323470',
        active:  {
            frame: '#ffff00',
            background: '#343635A0',
        }
    },
    showActiveFrame: false,
}

let Container = function(dat) {
    // name can be assigned from child constructors!
    if (!this.name) this.name = 'container' + ++instances
    sys.supplement(this, defaults)

    sys.LabFrame.call(this, dat)
}
Container.prototype = Object.create(sys.LabFrame.prototype)

Container.prototype.onClick = function(x, y, b, e) {
    //if (x < 0 || y < 0 || x > this.w || y > this.h) return
    //log.debug('click on [' + this.name + '] @' + x + 'x' + y)
    this._ls.forEach(g => {
        if (g.hidden || g.disabled) return

        const lx = x - g.x
        const ly = y - g.y
        if (lx >= 0 && lx <= g.w && ly >= 0 && ly <= g.h) {
            if (sys.isFun(g.onClick)) {
                g.onClick(lx, ly, e)
            }
            if (sys.isFun(g.onFocus)) {
                this.captureFocus(g)
                g.onFocus()
            }
        } else {
            if (g.focus && sys.isFun(g.onUnfocus)) {
                this.releaseFocus(g)
                g.onUnfocus()
            }
        }
    })
}

Container.prototype.onDblClick = function(x, y, b, e) {
    this._ls.forEach(g => {
        if (g.hidden || g.disabled) return

        const lx = x - g.x
        const ly = y - g.y
        if (lx >= 0 && lx <= g.w && ly >= 0 && ly <= g.h) {
            if (sys.isFun(g.onDblClick)) {
                g.onDblClick(lx, ly, e)
            }
            if (sys.isFun(g.onFocus)) {
                this.captureFocus(g)
                g.onFocus()
            }
        } else {
            if (g.focus && sys.isFun(g.onUnfocus)) {
                this.releaseFocus(g)
                g.onUnfocus()
            }
        }
    })
}

Container.prototype.onMouseDown = function(x, y, b, e) {
    if (x < 0 || y < 0 || x > this.w || y > this.h) return
    //log.debug('mouse down on [' + this.name + '] @' + x + 'x' + y)
    this._ls.forEach(g => {
        const lx = x - g.x
        const ly = y - g.y
        if (lx >= 0 && lx <= g.w && ly >= 0 && ly <= g.h) {
            if (sys.isFun(g.onMouseDown)) {
                g.onMouseDown(lx, ly, e)
            }
            if (sys.isFun(g.onMouseDrag)) {
                this.captureMouse(g)
            }
            if (sys.isFun(g.onFocus)) {
                this.captureFocus(g)
                g.onFocus()
            }
        }
    })
}

Container.prototype.onMouseUp = function(x, y, b, e) {
    if (x < 0 || y < 0 || x > this.w || y > this.h) return
    //log.debug('mouse up on [' + this.name + '] @' + x + 'x' + y)
    this._ls.forEach(g => {
        if (sys.isFun(g.onMouseUp)) {
            const lx = x - g.x
            const ly = y - g.y
            if (!g._captured && (lx >= 0 && lx <= g.w && ly >= 0 && ly <= g.h)) {
                g.onMouseUp(lx, ly, e)
            }
        }
    })
}

Container.prototype.onMouseMove = function(x, y, e) {
    //if (x < 0 || y < 0 || x > this.w || y > this.h) return
    //log.debug('mouse move on [' + this.name + '] @' + x + 'x' + y)
    this._ls.forEach(g => {
        if (sys.isFun(g.onMouseMove)) {
            const lx = x - g.x
            const ly = y - g.y
            if (!g._captured && (lx >= 0 && lx <= g.w && ly >= 0 && ly <= g.h)) {
                if (!g._hover) {
                    g._hover = true
                    if (sys.isFun(g.onMouseEnter)) g.onMouseEnter(lx, ly, e)
                }
                g.onMouseMove(lx, ly, e)
            } else {
                g._hover = false
            }
        }
    })
}

Container.prototype.onMouseWheel = function(d, x, y, e) {
    //if (x < 0 || y < 0 || x > this.w || y > this.h) return
    //log.debug('mouse move on [' + this.name + '] @' + x + 'x' + y)
    this._ls.forEach(g => {
        if (sys.isFun(g.onMouseWheel)) {
            const lx = x - g.x
            const ly = y - g.y
            if (lx >= 0 && lx <= g.w && ly >= 0 && ly <= g.h) {
                g.onMouseWheel(d, lx, ly, e)
            }
        }
    })
}

Container.prototype.onReleasedFocus = function() {
    this._ls.forEach(g => {
        if (sys.isFun(g.onFocus)) {
            this.releaseFocus(g)
        }
        if (sys.isFun(g.onReleasedFocus)) {
            g.onReleasedFocus()
        }
    })

}

Container.prototype.captureMouse = function(gadget) {
    this.__.captureMouse(gadget)
}

Container.prototype.releaseMouse = function(gadget) {
    this.__.releaseMouse(gadget)
}

Container.prototype.captureFocus = function(gadget) {
    this.__.captureFocus(gadget)
}

Container.prototype.releaseFocus = function(gadget) {
    this.__.releaseFocus(gadget)
}

Container.prototype.onFocus = function() {
    this.focus = true
}

Container.prototype.onUnfocus = function() {
    this.focus = false
}

Container.prototype.drawBackground = function() {
    if (this.opaque) return

    if (this.focus) ctx.fillStyle = this.color.active.background
    else ctx.fillStyle = this.color.background
    ctx.fillRect(0, 0, this.w, this.h)

    if (this.showActiveFrame && this.focus) {
        ctx.strokeStyle = this.color.active.frame
        ctx.lineWidth = 2
        ctx.strokeRect(0, 0, this.w, this.h)
    }
}

Container.prototype.drawComponents = function() {
    for (let i = 0; i < this._ls.length; i++) {
        let e = this._ls[i]
        if (e.draw && !e.hidden) {
            e.draw()
        }
    }
}

Container.prototype.drawForeground = function() {}

Container.prototype.draw = function() {
    if (this.hidden) return
    ctx.save()
    ctx.translate(this.x, this.y)
    if (this.clip) {
        ctx.beginPath()
        ctx.rect(0,0,this.w,this.h)
        ctx.clip()
    }

    this.drawBackground()
    this.drawComponents()
    this.drawForeground()

    ctx.restore()
}

module.exports = Container
