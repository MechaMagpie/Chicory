// Helpers
class Node {
	constructor(children) {
		for (const child in children) {
			this[child] = children[child]
		}
	}
}

function singleReg(type, regex) {
	return function (buffer) {
		let res = regex.match(buffer[0])
		if (res && res[0].length == buffer[0].length) {
			return [new type({val: buffer[0]}), buffer.slice(1)]
		}
	}
}

function disjunction(funs) {
	return function (buffer) {
		for (fun of funs) {
			let res = fun(buffer)
			if (res) return res
		}
		return false
	}
}

function multiSequence(type, isMult, ...terms) {
	function consumePunct(punctuator, buffer) {
		if (punctuator == buffer[0].text)
			return buffer.slice(1)
		else
			return false
	}
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

function sequence(type, ...terms) {
	return multiSequence(type, false, terms)
}

const identifier = /[_A-z][_0-9A-z]/
/*
* This is one of the major concessions made. C has a staggering amount of
* numerical constant formats, most of them largely unused in practice.
*/
class Constant extends Node {}
const parseConstant = disjunction([
	parseIntConstant, parseFloatConstant, parseCharConstant, enumConstant])

class IntConstant extends Constant {}
const parseIntConstant = disjunction([
	parseHexConstant, parseDecConstant, parseOctConstant])

class HexConstant extends IntConstant {}
const parseHexConstant = singleReg(HexConstant, /0[xX][0-9A-Fa-f]+/)

class DecConstant extends IntConstant {}
const parseDecConstant = singleReg(DecConstant, /[1-9][0-9]*/)

class OctConstant extends IntConstant {}
const parseOctConstant = singleReg(OctConstant, /0[0-9]+/)

class FloatConstant extends Constant {}
const parseFloatConstant = disjunction([parseFraction, parseExponential])
const parseFraction = singleReg(FloatConstant, /[0-9]*\.[0-9]+([eE][0-9]+)?/)
const parseExponential = singleReg(FloatConstant, /[0-9]+[eE][0-9]+/)

class CharConstant extends Constant {}
const parseCharConstant = singleReg(CharConstant,
	/'([^\\']|(\\['"?\\abfnrtv]))'/)

class EnumConstant extends Constant {}
const parseEnumConstant = singleReg(EnumConstant, identifier)

class StringLiteral extends Node {}
const parseStringLiteral = singleReg(StringLiteral,
	/"(([^"\\]|(\\["?\\abfnrtv]))*)"/)

class Identifier extends Node {}
const parseIdentifier = singleReg(Identifier, identifier)

class PrimaryExpression extends Expression {}
const parsePrimaryExpression = disjunction([
	parseIdentifier, parseConstant,	parseStringLiteral,

