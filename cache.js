/*jshint asi:true, expr:true */
-function () {

  function Cache (threshold) {
    if (!threshold || threshold < 1)
      throw new Error("Cannot build cache with a threshold less than 1")

    this.threshold = threshold
    this.cache     = {}   , this.orderLookup = {}
    this.head      = null , this.tail        = null
    this.count     = 0
  }

  Cache.prototype.insert = function (key, value) {
    var node = new Node(key)
    node.next = this.head
    node.next === null || (node.next.prev = node)
    this.tail === null && (this.tail = node)

    this.head = node, this.orderLookup[key] = node

    ++this.count > this.threshold && evictOldest.call(this)

    this.cache[key] = value
  }

  Cache.prototype.update = function (key, value) {
    updateOrdering.call(this, key)
    var was = this.cache[key]
    was && (this.cache[key] = value)
    return was
  }

  Cache.prototype.remove = function (key) {
    var node = this.orderLookup[key]
    this.head === node && (this.head = node.next)
    this.tail === node && (this.tail = node.prev)

    linkAdjacent(node)

    remove.call(this, key)
  }

  Cache.prototype.get = function (key) {
    var hit = this.cache[key]
    hit && updateOrdering.call(this, key)
    return hit
  }

  Cache.prototype.onEvict = function (λ) {
    (this.afterEvict || (this.afterEvict =[])).push(λ)
  }

  function updateOrdering (key) {
    var node = this.orderLookup[key]
    if(!node) return

    node === this.tail && (this.tail = node.prev)
    linkAdjacent(node)

    node.next = this.head
    this.head = node
  }

  function linkAdjacent (node) {
    node.prev && (node.prev.next = node.next)
    node.next && (node.next.prev = node.prev)
  }

  function evictOldest (key) {
    var oldestKey = this.tail.key
    this.tail = this.tail.prev
    var removed = remove.call(this, oldestKey)
    this.afterEvict && this.afterEvict.map(function (λ) { λ(removed) })
  }

  function remove (key) {
    delete this.orderLookup[key]
    var was = this.cache[key]
    ;delete this.cache[key]
    this.count--
    return was
  }

  function Node (key) {
    this.prev = null
    this.next = null
    this.key  = key
  }

  module.exports = Cache
}()
