function addX(regex) {
		return function(src, i, dest) {
				regex.lastIndex = i
				let m = src.match(regex)
				if (m) {
						dest[dest.length] = m[0]
						return regex.lastIndex
				} else return false
		}
}

const plausibleNum = /(0x)?[0-9]+(\.[0-9]*([Ee]-?[0-9]+)?)?[UuLl]?/y
const addNum = addX(plausibleNum)

const punctuator = new RegExp(String.raw`((%:){1,2})|(\.\.\.)|(->)
|([+\-<>&|#])\\5|([<>=!*/%+\-&^|]=)|([<>]{2}=)|(<[:%])|([:%]>)
|([\[\](){}.&*+\-~!/%<>^|?:;=,#])`, 'y')
const addPunct = addX(punctuator)

const ident = /[_A-z][_A-z0-9]*/y
const addId = addX(ident)

const ws = /\s/y
function eatWs(src, i) {
		ws.lastIndex = i
		if (src.match(ws))
				return i+1
		else
				return false
}
						 
function lexSource(src) {
		let i = 0
		let dest = []
		lexLoop: while (i < src.length - 1)
				for(fun of [eatWs, addNum, addPunct, addId]) {
						let r = fun(src, i, dest)
						if (r) {
								i = r
								continue lexLoop
						}
				}	
		return dest
}
