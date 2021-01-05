function Index() {
		this.arr = []
		this.len = 0
		this.index = 0
}
Object.assign(
		Index.prototype,
		{
				pop: function() {
						return this.arr[this.index++]
				},
				peek: function() {
						return this.arr[this.index]
				},
				retreat: function(n) {
						this.index -= n
				},
				depleted: function() {
						return this.index == this.len
				}
		})

function IndexString(string) {
		Index.call(this)
		this.arr = string
		this.len = string.length
}
IndexString.prototype = Object.create(Index.prototype)

function IndexLex() {
		Index.call(this)
}
IndexLex.prototype =
		Object.assign(
				Object.create(Index.prototype),
				{
						add: function(l) {
								this.arr[len] = l
								this.len++
						}
				})

function lex(src, dest) {
		for (let fun of [addNum, addPunct, addTxt]) {
				if (fun(src, dest))
						return true
		}
		return false
}

function addNum(src, dest) {
		let buf = ''
		while ('0123456789'.includes(src.peek()))
				buf += src.pop()
		if (buf.length > 0) {
				dest.add(buf)
				return true
		} else return false
}

const punctuators =
			['[', ']', '(', ')', '{', '}', '.', '->', '++', '--', '&', '*',
			 '+', '-', '~', '!', '/', '%', '<<', '>>', '<', '>', '<=', '>=',
			 '==', '!=', '^', '|', '&&', '||', '?', ':', ';', '...', '=',
			 '*=', '/=', '%=', '+=', '-=', '<<=', '>>=', '&=', '^=', '|=',
			 ',', '#', '##', '<:', ':>', '<%', '%>', '%:', '%:%:']
function addPunct(src, dest) {
		let buf = ''
		let c = 0
		while ('[](){}.->+&*~!/%<=^|?:;#'.includes(src.peek())) {
				buf += src.pop()
				c++
		}
		if (buf.length > 0 && punctuators.includes(buf)) {
				dest.add(buf)
				return true
		} else {
				src.retreat(c)
				return false
		}
}

const initChar = /[_A-z]/
const txtChar = /[_A-z0-9]/
function addTxt(src, dest) {
		let buf = ''
		if (!initChar.test(src.peek()))
				return false
		while (txtChar.test(src.peek()))
				buf += src.pop()
		dest.add(buf)
		return true
}

function lexSource(src) {
		let b1 = new IndexString(src)
		let b2 = new IndexLex()
		while (!b1.depleted())
				lex(b1, b2)
		return b2
}
