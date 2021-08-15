// Helpers
class Node {
	constructor(children) {
		for (const child in children) {
			this[child] = children[child]
		}
	}
}

function singleReg(regex, type) {
	return function (buffer) {
		let res = regex.match(buffer[0])
		if (res && res[0].length == buffer[0].length) {
			return [new type(val = buffer[0]), buffer.slice(1)]
		}
	}
}

function disjunction(funs) {
	return function(buffer) {
		for (fun of funs) {
			let res = fun(buffer)
			if (res) return res
		}
		return false
	}
}

