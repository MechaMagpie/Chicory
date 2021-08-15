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

/*
* This is one of the major concessions made. C has a staggering amount of
* numerical constant formats, most of them largely unused in practice.
*/
class Constant extends Node {}
const parseConstant = disjunction([
	parseIntConstant, parseFloatConstant, parseCharConstant])

class IntConstant extends Constant {}
const parseIntConstant = disjunction([
	parseHexConstant, parseDecConstant, parseOctConstant])

class HexConstant extends IntConstant {}
const parseHexConstant = singleReg(/0[xX][0-9A-Fa-f]+/, HexConstant)

class DecConstant extends IntConstant {}
const parseDecConstant = singleReg(/[1-9][0-9]*/, DecConstant)

class OctConstant extends IntConstant {}
const parseOctConstant = singleReg(/0[0-9]+/, OctConstant)

class FloatConstant extends Constant {}
const parseFloatConstant = disjunction([parseFraction, parseExponential])
const parseFraction = singleReg(/[0-9]*\.[0-9]+([eE][0-9]+)?/, FloatConstant)
const parseExponential = singleReg(/[0-9]+[eE][0-9]+/, FloatConstant)

class CharConstant extends Constant {}
const parseCharConstant = singleReg(
	/'([^\\']|(\\['"?\\abfnrtv]))'/, CharConstant)

class StringLiteral extends Node {}
const parseStringLiteral = singleReg(
	/"(([^"\\]|(\\["?\\abfnrtv]))*)"/, StringLiteral)
