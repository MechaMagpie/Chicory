// Helpers
class Node {
	constructor(children) {
		for (const child in children) {
			this[child] = children[child]
		}
	}
}

function fixme {
	return function(buffer) {
		throw 'TODO'
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

function consumePunct(punctuator, buffer) {
	if (punctuator == buffer[0].text)
		return buffer.slice(1)
	else
		return false
}

function csvList(type, separator, parsingFun) {
	return function (buffer) {
		let resList, resNode
		for (;;) {
			let res = parsingFun(buffer)
			if (res) 
				[resNode, buffer] = res
			else break;
			list.push(resNode)
			if (!(buffer = consumePunct(separator, buffer)))
				break;
		}
		return [new type({list: resList}), buffer]
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
	sequence(Expression,'(', parseExpression, ')')])

class PostfixExpression extends Expression {}
const parsePostfixExpression = disjunction([
	parsePrimaryExpression,
	parseArrayIndexExpression,
	parseFunctionCallExpression,
	parseMemberExpression,
	parseDereferenceMemberExpression,
	parsePostIncrement,
	parsePostDecrement,
	parseInitializerList])

class ArrayIndexExpression extends PostfixExpression {}
const parseArrayIndexExpression =
	  multiSequence(ArrayIndexExpression, ['name', parsePostfixExpression],
					'[', ['index', parseExpression], ']')

class ArgumentList extends Node {}
const parseArgumentList = csvList(ArgumentList, ',' parseAssignmentExpression)

class FunctionCallExpression extends PostfixExpression {}
const parseFunctionCallExpression =
	  multiSequence(FunctionCallExpression, ['name', parsePostfixExpression],
					'(', ['args', parseArgumentList], ')')

class MemberExpression extends PostfixExpression {}
const parseMemberExpression =
	  multiSequence(MemberExpression, ['name', parsePostfixExpression],
					'.', ['index', parseIdentifier])

class DereferenceMemberExpression extends PostfixExpression {}
const parseDereferenceMemberExpression =
	  multiSequence(DereferenceMemberExpression,
					['name', parsePostfixExpression], '->',
					['index', parseIdentifier])

class PostIncrement extends PostfixExpression {}
const parsePostIncrement =
	  multiSequence(PostIncrement, ['val', parsePostfixExpression], '++')

class PostDecrement extends PostfixExpression {}
const parsePostDecrement =
	  multiSequence(PostDecrement, ['val', parsePostfixExpression], '--')

class InitializerList extends PostfixExpression {}
const parseInitializerList = fixme()

class AssignmentExpression extends Expression {}
const parseAssignmentExpression = fixme()

class UnaryExpression extends Expression {}
const parseUnaryExpression =
	  disjunction([parsePostfixExpression,
				   parsePreIncrement,
				   parsePreIncrement,
				   parseUnaryOperation,
				   parseSizeOf,
				   parseSizeOfType])

class PreIncrement extends UnaryExpression {}
const parsePreIncrement =
	  multisequence(PreIncrement, '++', ['val', parseUnaryExpression])

class PreDecrement extends UnaryExpression {}
const parsePreDecrement =
	  multisequence(PreDecrement, '--', ['val', parseUnaryExpression])

