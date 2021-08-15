class LexToken {
	constructor(start, end, text) {
		this.start = start; this.end = end; this.text = text
	}
}

function addX(regex) {
	return function(src, i, dest) {
		regex.lastIndex = i
		let m = src.match(regex)
		if (m) {
			let j = regex.lastIndex
			dest.push(
				new LexToken(i, j, m[0]))
			return j
		} else return false
	}
}

const plausibleNum =
	  /[+-]?(0x)?[0-9]+(\.[0-9]*([Ee]-?[0-9]+)?)?[UuLl]?/y
const addNum = addX(plausibleNum)

const punctuator = new RegExp(String.raw`((%:){1,2})|(\.\.\.)|(->)
|([+\-<>&|#])\5|([<>=!*/%+\-&^|]=)|([<>]{2}=)|(<[:%])|([:%]>)
|([\[\](){}.&*+\-~!/%<>^|?:;=,#])`.replace(/\s/g, ''), 'y')
const addPunct = addX(punctuator)

const ident = /[_A-z][_A-z0-9]*/y
const addId = addX(ident)

const strConst = /".*(?<!\\)"/y
const addStrConst = addX(strConst)

const charConst = /'(.|(\\.))'/y
const addCharConst = addX(charConst)

const ws = /\s/y
function eatWs(src, i) {
	ws.lastIndex = i
	if (src.match(ws))
		return i+1
	else
		return false
}

const addTokens = [eatWs, addNum, addPunct, addId, addStrConst,
				   addCharConst]
function lexSource(src) {
	let i = 0
	let dest = []
	lexLoop: while (i < src.length - 1)
		for(fun of addTokens) {
			let r = fun(src, i, dest)
			if (r) {
				i = r
				continue lexLoop
			}
		}	
	return dest
}