'use strict'

// @depends(/dna/hud/Container)
let instances = 0
let Hud = function(dat) {
    this.name = 'hud' + ++instances
    dna.hud.Container.call(this, dat)

    this.span = true
    this.opaque = true
    this.captured = []
    this.focused = []

    //sys.augment(this, dat)
    
    // fix preset if not present
    //env.attach(sys.clone(dna.hud.preset), 'hud')

    // append another trap on click event
    let hud = this

    sys.after(trap, 'click', function(e) {
        let x = e.pageX - hud.x
        let y = e.pageY - hud.y
        hud.onClick(x, y, e.button, e)
    })

    sys.after(trap, 'dblClick', function(e) {
        let x = e.pageX - hud.x
        let y = e.pageY - hud.y
        hud.onDblClick(x, y, e.button, e)
    })

    sys.after(trap, 'mouseUp', function(e) {
        let x = e.pageX - hud.x
        let y = e.pageY - hud.y
        hud.onMouseUp(x, y, e.button, e)
    })

    sys.after(trap, 'mouseDown', function(e) {
        let x = e.pageX - hud.x
        let y = e.pageY - hud.y
        hud.onMouseDown(x, y, e.button, e)
    })

    sys.after(trap, 'mouseMove', function(e) {
        let x = e.pageX - hud.x
        let y = e.pageY - hud.y
        hud.onMouseMove(x, y, e)
    })

    sys.after(trap, 'mouseWheel', function(e) {
        let x = e.pageX - hud.x
        let y = e.pageY - hud.y
        hud.onMouseWheel(e.wheelDelta, x, y, e)
    })

    sys.after(trap, 'keyDown', function(e) {
        hud.onKeyDown(e)
    })

    sys.after(trap, 'keyUp', function(e) {
        hud.onKeyUp(e)
    })
}

const Container = dna.hud.Container
Hud.prototype = Object.create(Container.prototype)

Hud.prototype.onMouseDown = function(x, y, b, e) {
    this.captured.forEach(g => {
        if (sys.isFun(g.onMouseDown)) g.onMouseDown(x, y, e)
    })
    Container.prototype.onMouseDown.call(this, x, y, e)
}

Hud.prototype.onMouseUp = function(x, y, b, e) {
    this.captured.forEach(g => {
        if (sys.isFun(g.onMouseUp)) g.onMouseUp(x, y, e)
    })
    this.releaseMouse()
    Container.prototype.onMouseUp.call(this, x, y, b, e)
}

Hud.prototype.onMouseMove = function(x, y, e) {
    const dx = _._$.env.mouseX - _._$.env.mouseLX
    const dy = _._$.env.mouseY - _._$.env.mouseLY
    this.captured.forEach(g => {
        if (sys.isFun(g.onMouseMove)) g.onMouseMove(dx, dy, e)
        if (sys.isFun(g.onMouseDrag)) g.onMouseDrag(dx, dy, e)
    })
    Container.prototype.onMouseMove.call(this, x, y, e)
}

Hud.prototype.onKeyDown = function(e) {
    this.focused.forEach(g => {
        if (sys.isFun(g.onKeyDown)) g.onKeyDown(e)
    })
}

Hud.prototype.onKeyUp = function(e) {
    this.focused.forEach(g => {
        if (sys.isFun(g.onKeyUp)) g.onKeyUp(e)
    })
}

Hud.prototype.expand = function() { // calculate operating area
    this.x = 0
    this.y = 0
    this.w = ctx.width
    this.h = ctx.height
}

Hud.prototype.captureMouse = function(gadget) {
    gadget._captured = true
    if (this.captured.indexOf(gadget) < 0) this.captured.push(gadget)
}

Hud.prototype.releaseMouse = function() {
    this.captured.forEach(g => {
        g._captured = false
    })
    this.captured = []
}

Hud.prototype.captureFocus = function(gadget) {
    gadget.focus = true
    if (this.focused.indexOf(gadget) < 0) this.focused.push(gadget)
}

Hud.prototype.releaseFocus = function(gadget) {
    gadget.focus = false
    const i = this.focused.indexOf(gadget)
    if (i >= 0) {
        this.focused.splice(i, 1)
    }

    if (sys.isFun(gadget.onReleasedFocus)) {
        gadget.onReleasedFocus()
    }
}

Hud.prototype.draw = function() {
    if (this.span) this.expand()
    Container.prototype.draw.call(this)
}

module.exports = Hud
