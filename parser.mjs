import {
	Node, fixme, singleReg, optTerm, csvList, indefList, disjunction,
	multiSequence, sequence, preFix, postFix, infix
} from './parsing-helpers.mjs'

const identifierReg = /[_A-z][_A-z0-9]*/

class Type extends Node {}
const parseType = singleReg(Type, identifierReg)

class Identifier extends Node {}
const parseIdentifier = singleReg(Identifier, identifierReg)

class Declarator extends Node {}
const parseDeclarator = multiSequence(
	Declarator, ['type', parseType], ['name', parseIdentifier])

class FunctionDeclaration extends Node {}
const parseFunctionDecl = multiSequence(
	FunctionDeclaration, ['returnType', parseType], ['name', parseIdentifier],
	'(', ['argList', csvList(',', parseDeclarator)], ')')

class Block extends Node {}
const parseBlock = multiSequence(
	Block, '{', '}')

class FunctionDefinition extends Node {}
const parseFunctionDef = multiSequence(
	FunctionDefinition, ['head', parseFunctionDecl], ['body', parseBlock])

const parseExternalDeclaration =
	  disjunction(parseFunctionDef)

class TranslationUnit extends Node {}
const parseTranslationUnit =
	  indefList(TranslationUnit, parseExternalDeclaration)