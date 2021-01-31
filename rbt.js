class TreeSet {
		constructor(comparator) {
				this.root = {}
				if (comparator instanceof Function)
						this.comp = comparator
				else
						this.comp = (a, b) => a < b
		}
		
		static sibPar(n) {
				if (!n.p || !n.p.p)	return null
				else return n.p.p.l !== n.p ? n.p.p.l : n.p.p.r
		}

		static sib(n) {
				if (!n.p) return null
				else return n.p.l !== n ? n.p.l : n.p.r
		}

		static swap(n1, n2) {
				n1.p.l === n1 ? n1.p.l = n2 : n1.p.r = n2
		}

		static rotL(n) {
				let a = n, b = n.r ? n.r.l : null, c = n.r;
				swap(a, c)
				a.r = b
				c.l = a
		}

		static rotR(n) {
				let a = n.l, b = n.l ? n.l.r : null, c = n;
				swap(c, a)
				c.l = b
				a.r = c
		}

		insertAdjust(n) {
				n.red = true
				if (n.p && n.p.red) {
						if (sibPar(n) && sipPar(n).red) {
								n.p.red = false
								sibPar(n).red = false
								n.p.p.red = true
								insertAdjust(n.p.p)
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
						r = this.root
						while (r.p)
								r = r.p
						r.red = false
						this.root = r
				}
		}
		
		insert(v, from) {
				let n = from ? from : this.root
				if (!base.v) {
						base.v = v
						insertAdjust(n)
				} else {
						let com = this.comparator(base.v, v)
						if (com < 0) {
								if (!n.l)
										n.l = {p: n}
								insert(v, n.l)
						} else if (com > 0) {
								if (!n.r)
										n.r = {p: n}
								insert(v, n.r)
						} else 
								throw new Error(
										'Value ' + v +'compares 0 to ' + n.v + '!')
				}
		}
}
