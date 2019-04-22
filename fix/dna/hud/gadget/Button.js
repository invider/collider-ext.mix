'use strict'

let instances = 0

const Button = function(dat) {
    instances ++
    this.name = 'button_' + instances
    this.text = 'Button ' + instances
    this.disabled = false
    this.toggled = false

    this.x = 0
    this.y = 0
    this.w = 20
    this.h = 20

    this.color = {
        active: {
            text: env.hud.preset.color,
            pane: '#404040'
        },
        hover: {
            text: '#FFFF00',
            pane: '#606060',
        },
        toggled: {
            text: '#806020',
            pane: '#202020',
        },
        toggledHover: {
            text: '#806020',
            pane: '#403010',
        },
        disabled: {
            text: '#101010',
            pane: '#202020',
        },
    }
    this.hspace = 5
    this.vspace = 5
    this.font = env.hud.preset.font
    this.fontHeight = env.hud.preset.baseHeight

    sys.augment(this, dat)
    this.adjustSize()
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

Button.prototype.getState = function() {
    if (this.disabled) return 'disabled'
    if (this.toggled) {
        if (this._hover) return 'toggledHover'
        else return 'toggled'
    }
    if (this._hover) return 'hover'
    return 'active'
}

Button.prototype.drawBackground = function() {
    const cset = this.color[this.getState()]
    ctx.fillStyle = cset.pane
    ctx.fillRect(this.x, this.y, this.w, this.h)
}

Button.prototype.drawContent = function() {
    const cset = this.color[this.getState()]
    ctx.fillStyle = cset.text 
    ctx.font = this.font
    ctx.textBaseline = 'middle'
    ctx.textAlign = "center"
    ctx.fillText(this.text, this.x + this.w/2, this.y + this.h/2);
}

Button.prototype.draw = function() {
    this.drawBackground()
    this.drawContent()
}

return Button
