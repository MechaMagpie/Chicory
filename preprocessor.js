class TranslationFragment {
	contructor(file, fstart, fend, rawtext) {
		this.file = file; this.fstart = fstart;
		this.fend = fend; this.rawtext = rawtext
	}
}

class TranslationUnit {
	constructor(text, frags) {
		this.text = text, this.frags = frags
	}

	origin(charNum) {
		let i = 0
		for (fragment of frags) {
			i += fragment.rawtext.length
			if (i > charNum)
				return fragment
		}
		return false;
	}
}

const cComment = /(?:\/\/.*$)|(?:\/\*(?:[^*]|\*(?!\/))*\*\/)/mug
function stripComments(sources) {
	let output = []
	function regexMatchAll(src, reg, arr) {
		let res = reg.exec(src)
		if (res) {
			arr.push(res)
			regexMatchAll(src, reg, arr)
		}
	}
	for (source of sources) {
		cComment.lastIndex = 0;
		let comments = regexMatchAll(source.rawText, cComment, [])
		for (let i = 0; i < comments.length; i++) {
			let last =
				i == 0 ? 0 : comments[i-1].index + comments[i-1][0].length
			let end = comments[i].index
			let text = source.rawText.substring(last, end)
			output.push(new TranslationFragment(source.file,
												source.fstart + last,
												source.fstart + end,
												text))
		}
	}
	return output
}

function process(source) {
	let out = stripComments(source)
	let text = out.reduce((s1, s2) => s1.concat(s2))
	return new TranslationUnit(text, out)
}