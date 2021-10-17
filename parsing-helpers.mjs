// Helpers
export class Node {
	constructor(children) {
		for (const child in children) {
			this[child] = children[child]
		}
	}
}

export function fixme() {
	return function(buffer) {
		throw 'TODO'
	}
}

export function singleReg(type, regex) {
	return function (buffer) {
		let res = regex.match(buffer[0].text)
		if (res && res[0].length == buffer[0].text.length) {
			return [new type({val: buffer[0]}), buffer.slice(1)]
		}
	}
}

function consumePunct(punctuator, buffer) {
	if (punctuator == buffer[0].text)
		return buffer.slice(1)
	else
		return false
}

export function optTerm(parsingFun) {
	return function (buffer) {
		let res = parsingFun(buffer)
		if (res)
			return res
		else
			return [null, buffer]
	}
}

export function csvList(separator, parsingFun) {
	return function (buffer) {
		let resList, res
		while (res = parsingFun(buffer)) {
			buffer = res[1]
			resList.push(res[0])
			if (!(buffer = consumePunct(separator, buffer)))
				break;
		}
		return [resList, buffer]
	}
}

export function indefList(parsingFun) {
	return function (buffer) {
		let resList, res
		while (res = parsingFun(buffer)) {
			buffer = res[1]
			resList.push(res[0])
		}
		return [resList, buffer]
	}
}

export function disjunction(...funs) {
	return function (buffer) {
		for (fun of funs) {
			let res = fun(buffer)
			if (res) return res
		}
		return false
	}
}

function baseSequence(type, isMult, ...terms) {
	function parseTerm(term, buffer, result) {
		let res, fun = (isMult ? term[1] : term)
		if (!(res = fun(buffer))) return false
		if (isMult) {
			result[term[0]] = res[0]
			return [result, res[1]]
		} else
			return [res[0], buffer]
	}
	return function (buffer) {
		let result = {}
		for (term of terms) {
			if (typeof term == 'string')
				if (!(buffer = consumePunct(term, buffer)))
					return false
			else {
				let res1 = parseTerm(term, buffer, result)
				if (!res1)
					return false
				[result, buffer] = res1				
			}
		}
		if (isMult)
			return [new type(result), buffer]
		else
			return [result, buffer]
	}
}

export function multiSequence(type, ...terms) {
	return baseSequence(type, true, terms)
}

export function sequence(type, ...terms) {
	return baseSequence(type, false, terms)
}

export function preFix(type, parsingFun, prefix) {
	return new multiSequence(type, prefix, ['val', parsingFun])
}

export function postFix(type, parsingFun, postfix) {
	return new multiSequence(type, ['val', parsingFun], postfix)
}

export function infix(type, parsingFun, infix) {
	return new multiSequence(type, ['left', parsingFun],
							 infix, ['right', parsingFun])
}