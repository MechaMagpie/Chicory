var test = require('tape')
var fs = require('fs/promises')
var dep2 = import('./lexer.mjs').then(module => {lexer = module})
var dep1 = import('./parser.mjs').then(module => {parser = module})

async function ensureLoaded() {
	await dep1
	await dep2
}

function source(name) {
	let fullName = './samples/' + name;
	return fs.readFile(fullName, 'utf-8');
}

test('basic parsing test', async function(t) {
	await ensureLoaded()
	let text = await source('basic.c')
	let lexed = lexer.lexSource(text)
	let parsed = parser.parseTranslationUnit(lexed)
	t.ok(parsed)
})