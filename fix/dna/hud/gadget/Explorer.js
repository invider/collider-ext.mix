'use strict'

//@depends(/dna/hud/gadget/Window)
const Window = dna.hud.gadget.Window
const DynamicList = dna.hud.gadget.DynamicList

function mark(ch, n) {
    let s = ''
    for (let i = 0; i < n; i++) s += ch
    return s
}

function findName(node, parent) {
    if (sys.isObj(node) && node.name) return node.name

    let name = 'anonymous'
    if (sys.isFrame(parent)) {
        Object.keys(parent._dir).forEach(k => {
            if (parent[k] === node) name = k
        })
    } else if (sys.isArray(parent)) {
        name = '#' + parent.indexOf(node)
    } else if (sys.isObj(parent)) {
        Object.keys(parent).forEach(k => {
            if (parent[k] === node) name = k
        })
    }
    return name
}

function nodeTitle(node, dir, i) {
    //let title = '#' + i + ': '
    let title = ''

    if (sys.isFrame(node)) {
        title += node.name
        if (sys.isFun(node)) title += '()'
        title += '/'
        if (node._ls.length < 7) title += mark('.', node._ls.length)
        else title += '*'
    } else if (sys.isFun(node)) {
        title += findName(node, dir) + '()'
    } else if (sys.isObj(node)) {
        title += '{' + findName(node, dir) + '}'
    } else if (sys.isArray(node)) {
        title += '[' + findName(node, dir) + ']'
    } else {
        title += findName(node, dir) + ': ' + node
    }
    return title
}

const NodeList = function(dat) {
    this.lastPos = []
    this.lastSelect = []
    this.lastName = []
    DynamicList.call(this, dat)
}
NodeList.prototype = Object.create(DynamicList.prototype)

NodeList.prototype.onKeyDown = function(e) {
    if (e.key === 'Enter' && e.shiftKey) {
        if (this.selected >= 0) this.onItemAction(this.selected, 3);
    } else if (e.key === 'Escape') {
        log.out('exiting')
        this.__.detach()
    } else {
        DynamicList.prototype.onKeyDown.call(this, e)
    }
}

NodeList.prototype.updatePath = function() {
    let t = this.__.dir
    let path = findName(t)

    while(t.__) {
        t = t.__
        let name = findName(t)
        if (name === '/') name = ''
        path = name + '/' + path
    }
    this.__.status = path
}

NodeList.prototype.item = function(i) {
    const dir = this.__.dir

    if (i === 0) return '..'

    if (sys.isFrame(dir)) {
        if (i < 0) {
            return dir._ls.length + 1
        } else {
            return nodeTitle(dir._ls[i-1], dir, i-1)
        }
    } else if (sys.isObj(dir)) {
        const keys = Object.keys(dir)
        if (i < 0) {
            return dir._ls.length + 1
        } else {
            return nodeTitle(dir._ls[i-1], dir, i-1)
        }
    }
}

NodeList.prototype.onItemAction = function(i, action) {
    if ((i === 0 && action === 0) || action === 2) {
        if (this.__.dir.__) {
            // going up the tree
            let pos = 0
            let sel = 0
            if (this.lastPos.length > 0) {
                pos = this.lastPos.pop()
                sel = this.lastSelect.pop()
            }

            this.__.dir = this.__.dir.__
            this.pos = pos
            this.selected = sel
            this.scrollbar.pos = pos
            this.max = this.__.dir._ls.length
            this.updatePath()
            this.adjust()
        }
    } else if (action === 1) {
        const node = this.__.dir._ls[i-1]
        log.dump(node)
    } else if (action === 3) {
        const next = this.__.dir._ls[i-1]
        if (next && (sys.isObj(next) || sys.isFrame(next))) {
            const expl = new Explorer({
                x: this.__.x + this.__.w,
                y: this.__.y,
                w: this.__.w,
                h: this.__.h,
            })
            this.__.__.attach(expl)
            expl.dir = next
            expl.pane.updatePath()
        }
    } else {
        const next = this.__.dir._ls[i-1]
        if (next && (sys.isObj(next) || sys.isFrame(next))) {
            this.lastName.push(findName(next))
            this.lastPos.push(this.pos)
            this.lastSelect.push(i)
            this.pos = 0
            this.selected = 0
            this.scrollbar.pos = 0
            if (sys.isFrame(next)) {
                this.__.dir = next
                this.max = next._ls.length
            } else if (sys.isObj(next)) {
                // normalize first
                this.__.dir = {
                    _dir: {},
                    _ls: [],
                }

                Object.keys(next).forEach(k => {
                    this.__.dir[k] = next[k]
                    if (!k.startsWith('_')) {
                        this.__.dir._dir[k] = next[k]
                        this.__.dir._ls.push(next[k])
                    }
                })
                this.max = this.__.dir._ls.length
            }
            this.updatePath()
            this.adjust()
        } else {
            console.dir(next)
            console.log('not surveyable')
        }
    }
}

const defaults = {
    title: '',
    status: '/',
    x: 0,
    y: 0,
    w: 200,
    h: 200,
    dir: _._$
}

let instances = 0
const Explorer = function(dat) {
    if (!this.name) this.name = 'explorer' + ++instances
    sys.supplement(this, defaults)

    Window.call(this, dat)
    sys.augment(this, dat)

    this.attach(new NodeList({
        x: 0,
        y: 0,
        w: 10,
        h: 10,
    }), 'pane')
    this.pane.updatePath()
    this.adjust()
}
Explorer.prototype = Object.create(Window.prototype)

module.exports = Explorer

