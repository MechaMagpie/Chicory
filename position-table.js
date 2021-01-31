class Discontinuity {
		constructor (begin, end) {
				if (end <= begin) throw new Error('Malformed discontinuity')
				this.begin = begin
				this.end = end
		}

		overlaps(d2) {
				return this.end >= d2.begin || this.begin <= d2.end
		}

		[Symbol.toPrimitive](hint) {
				if (hint == 'number') {
						return (this.begin + this.end) / 2
				} else return null
		}
}

class DisconTable {
		constructor() {
				this.treeified = false
				this.discs = []
				this.tree = {}
		}

		treeify() {
				this.discs.sort()
				
		}

		add(d) {
				discs.push(d)
		}
}

class PositionTable {
		constructor(base) {
				if (base instanceof PositionTable)
						this.base = base
				
		}

		forward(pos) {
				
		}

		back(pos) {

		}

		cut(start, end) {
				
		}
}
