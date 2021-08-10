// Helpers
class Node {
	constructor(children) {
		for (const child in children) {
			this[child] = children[child]
		}
	}
}

// Expressions
class Expression extends Node
function parseExpression(buffer) {
	let expresions = [], res
	if (res = parseAssigmnentExpression(buffer)) {
		buffer = res[1]
		expressions.push(res[0])
		while (buffer[0].text == ',') {
			if (!res = parseAssigmnentExpression(buffer.slice(1)))
				break
			buffer = res[1]
			expressions.push(res[0])
		}
	}
	if (expressions.length == 0)
		return false
	else
		return [new Expression({AssignmentExpressions: expressions}), buffer]
}

function parseAssigmnentExpression(buffer) {
	
}

class Constant extends Node
function parseConstant(buffer) {
	
}

function parseIntegerConstant(buffer) {

}

const decimalConstant = /[1-9][0-9]*/
class DecimalConstant extends Constant
function parseDecimalConstant(buffer) {
	if (decimalconstant.match(buffer[0].text))
		return [new DecimalConstant({value : buffer[0]}), buffer.slice(1)]
}

const identifier = /[_A-z][_A-z0-9]*/
class Identifier extends Node
function parseIdentifier(buffer) {
	if (identifier.match(buffer[0].text))
		return [new Identifier({name: buffer[0]}), buffer.slice(1)]
	else return false
}