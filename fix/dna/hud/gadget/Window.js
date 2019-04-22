'use strict'

//@depends(/env/hud/preset)
//@depends(/dna/hud/Container)
const Container = dna.hud.Container 

const defaults = {
    hidden: false,
    folded: false,
    disabled: false,
    focus: false,
    resizable: true,
    minifiable: true,
    closable: true,

    font: env.hud.preset.font,
    baseHeight: env.hud.preset.baseHeight,
    color: {
        text: '#d0d9d0',
        tag: '#007060',
        bar: '#202020',
        stretch: '#253030',
        stretchLine: '#556060',
    },
    pads: {
        tag: 6
    },
}

const Tag = function(dat) {
    this.name = 'tag'
    sys.augment(this, dat)
}
Tag.prototype.draw = function() {
    ctx.fillStyle = this.__.color.tag
    ctx.fillRect(this.x, this.y, this.w, this.h)

    ctx.fillStyle = this.__.color.text
    ctx.font = this.__.font
    ctx.textBaseline = 'middle'
    ctx.textAlign = "center"
    ctx.fillText(this.__.title, this.w/2,  this.y + this.h/2);
}
Tag.prototype.onMouseDrag = function(dx, dy) {
    this.__.x += dx
    this.__.y += dy
}

const Bar = function(dat) {
    this.name = 'bar'
    sys.augment(this, dat)
}
Bar.prototype.draw = function() {
    ctx.fillStyle = this.__.color.bar
    ctx.fillRect(this.x, this.y, this.w, this.h)

    ctx.fillStyle = this.__.color.text
    ctx.font = this.__.font
    ctx.textBaseline = 'middle'
    ctx.textAlign = "left"
    ctx.fillText(this.__.status, this.x + this.__.pads.tag, this.y + this.h/2);
}

const Stretch = function(dat) {
    this.name = 'stretch'
    sys.augment(this, dat)
}
Stretch.prototype.draw = function() {
    ctx.fillStyle = this.__.color.stretch
    ctx.fillRect(this.x, this.y, this.w, this.h)

    ctx.strokeStyle = this.__.color.stretchLine
    ctx.lineWidth = 3

    const d = this.w/3
    const f = 10
    ctx.moveTo(this.x+d, this.y+this.h-f)
    ctx.lineTo(this.x+this.w-f, this.y+this.h-f)

    ctx.moveTo(this.x+this.w-f, this.y+d)
    ctx.lineTo(this.x+this.w-f, this.y+this.h-f)
    ctx.stroke()
}
Stretch.prototype.onMouseDrag = function(dx, dy) {
    this.__.w += dx
    this.__.h += dy
    this.__.adjust()
    return false
}


let instances = 0
const Window = function(dat) {
    if (!this.name) this.name = 'window' + ++instances

    sys.supplement(this, defaults)
    Container.call(this, dat)

    this.attach(new Tag())
    this.attach(new Bar())
    this.attach(new Stretch())
    this.attach(new Container({
        name: 'pane',
        attach: function(node, name) {
            Container.prototype.attach.call(this, node, name)
        },
        drawBackground: function() {},
    }))
    this.adjust()
}
Window.prototype = Object.create(Container.prototype)

Window.prototype.adjust = function() {
    this.tag.x = 0
    this.tag.y = 0
    this.tag.w = this.w
    this.tag.h = this.baseHeight + this.pads.tag*2

    this.bar.x = 0
    this.bar.w = this.w
    this.bar.h = this.baseHeight + this.pads.tag*2
    this.bar.y = this.h - this.bar.h

    this.stretch.y = this.bar.y
    this.stretch.h = this.bar.h
    this.stretch.x = this.w - this.bar.h
    this.stretch.w = this.bar.h

    this.pane.x = 0
    this.pane.w = this.w
    this.pane.y = this.tag.h+1
    this.pane.h = this.h - this.tag.h - this.bar.h
    if (sys.isFun(this.pane.adjust)) this.pane.adjust()
}

module.exports = Window

