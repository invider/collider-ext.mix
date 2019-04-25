'use strict'

let instances = 0
const Button = function(dat) {
    this.name = 'button_' + ++instances
    this.text = 'Button ' + instances
    this.disabled = false
    this.toggled = false

    this.x = 0
    this.y = 0
    this.w = 20
    this.h = 20

    this.hspace = 5
    this.vspace = 5
    this.font = env.hud.font
    this.fontHeight = env.hud.baseHeight

    sys.augment(this, dat)
    this.adjustSize()
}

Button.prototype.init = function() {
    this.injectStyle()
}

Button.prototype.injectStyle = function() {
    const c = this.__
    this.color = {
        active: {
            base: c.style('button/base'),
            content: c.style('button/content'),
            font: c.style('button/font'),
        },
        hover: {
            base: c.style('button/hover/base'),
            content: c.style('button/hover/content'),
            font: c.style('button/hover/font'),
        },
        toggled: {
            base: c.style('button/toggled/base'),
            content: c.style('button/toggled/content'),
            font: c.style('button/toggled/font'),
        },
        disabled: {
            base: '#202020',
            content: '#101010',
            font: c.style('button/disabled/font'),
        },
    }
}

Button.prototype.adjustSize = function() {
    ctx.font = this.font
    const m = ctx.measureText(this.text)
    const requestW = m.width + this.hspace*2
    const requestH = this.fontHeight + this.vspace*2
    if (this.w < requestW) this.w = requestW
    if (this.h < requestH) this.h = requestH
}

Button.prototype.onMouseDown = function() {
    this.toggled = true
}

Button.prototype.onMouseUp = function() {
    this.toggled = false
}

// need this for _hover flag to work
Button.prototype.onMouseMove = function() {}


Button.prototype.getState = function() {
    if (this.disabled) return 'disabled'
    if (this.toggled) {
        return 'toggled'
    }
    if (this._hover) return 'hover'
    return 'active'
}

Button.prototype.drawBackground = function() {
    const cset = this.color[this.getState()]
    ctx.fillStyle = cset.base
    ctx.fillRect(this.x, this.y, this.w, this.h)
}

Button.prototype.drawContent = function() {
    const cset = this.color[this.getState()]
    ctx.fillStyle = cset.content
    ctx.font = cset.font
    ctx.textBaseline = 'middle'
    ctx.textAlign = "center"
    ctx.fillText(this.text, this.x + this.w/2, this.y + this.h/2);
}

Button.prototype.draw = function() {
    this.drawBackground()
    this.drawContent()
}

return Button
