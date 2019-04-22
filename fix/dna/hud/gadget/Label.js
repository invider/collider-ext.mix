'use strict'
// @depends(/env/hud/preset)

let instances = 0

const Label = function Label(dat) {
    instances ++
    this.name = 'label_' + instances

    if (!dat) dat = {}
    else if (sys.isString(dat)) dat = { text: dat }

    sys.augment(this, dat)

    // preconfigure
    this.color = env.hud.preset.color
    this.font = env.hud.preset.font

    // must follow preconfigure
    if (dat.text) this.setText(dat.text)
    else this.setText('Label ' + instances)
}

Label.prototype.setText = function(text) {
    this.text = text
    this.th = parseInt(this.font)
    ctx.font = this.font
    this.tw = ctx.measureText(text).width
    this.w = this.tw
    this.h = this.th
}

Label.prototype.draw = function() {
    ctx.fillStyle = this.color
    ctx.font = this.font
    ctx.textAlign = "left"
    ctx.textBaseline = 'top'
    ctx.fillText(this.text, this.x, this.y);
}

return Label
