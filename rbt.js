function sibPar(n) {
		if (!n.p || !n.p.p)	return null
		else return n.p.p.l !== n.p ? n.p.p.l : n.p.p.r
}

function sib(n) {
		if (!n.p) return null
		else return n.p.l !== n ? n.p.l : n.p.r
}

function swap(n1, n2) {
		if (n1.p) {
				if (n1.p.l === n1)
						n1.p.l = n2
				else
						n1.p.r = n2
		}
		[n1.p, n2.p] = [n2.p, n1.p]
}

function rotL(n) {
		let a = n, b = n.r ? n.r.l : null, c = n.r;
		swap(a, c);
		a.r = b; b ? b.p = a : null
		c.l = a; a.p = c
}

function rotR(n) {
		let a = n.l, b = n.l ? n.l.r : null, c = n;
		swap(c, a);
		c.l = b; b ? b.p = c : null
		a.r = c; c.p = a
}

function nullCh(n) {
		return {p: n, l: null, r: null}
}

function* iter(root) {
		if (root.r)
				yield* iter(root.r)
		yield root.v
		if (root.l)
				yield* iter(root.l)
}

class TreeSet {
		constructor(comparator) {
				this.root = {p: null, l: null, r: null, red: false}
				if (comparator instanceof Function)
						this.comp = comparator
				else
						this.comp = (a, b) => a - b
		}

		insertAdjust(n) {
				n.red = true
				if (n.p && n.p.red) {
						if (sibPar(n) && sibPar(n).red) {
								n.p.red = false
								sibPar(n).red = false
								n.p.p.red = true
								this.insertAdjust(n.p.p)
						} else if (n.p.p && n.p.p.l === n.p) {
								if (n.p.r === n)
										rotL(n = n.p)
								n.p.red = false
								n.p.p.red = true
								rotR(n.p.p)
						} else if (n.p.p && n.p.p.r == n.p) {
								if (n.p.l === n)
										rotR(n = n.p)
								n.p.red = false
								n.p.p.red = true
								rotL(n.p.p)
						}
				}
				if (this.root.p) {
						let r = this.root
						while (r.p)
								r = r.p
						r.red = false
						this.root = r
				}
		}
		
		insert(v, from) {
				let n = from ? from : this.root
				if (!n.v) {
						n.v = v
						this.insertAdjust(n)
				} else {
						let com = this.comp(n.v, v)
						if (com < 0) {
								if (!n.l)
										n.l = nullCh(n)
								this.insert(v, n.l)
						} else if (com > 0) {
								if (!n.r)
										n.r = nullCh(n)
								this.insert(v, n.r)
						} else 
								throw new Error(
										'Value ' + v + 'compares 0 to ' + n.v + '!')
				}
		}

		[Symbol.iterator]() {
				return iter(this.root)
		}
}
