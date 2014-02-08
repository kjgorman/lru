/*jshint asi:true, expr:true */
-function () {

  function Cache (threshold) {
    if (threshold < 1)
      throw new Error("Cannot build cache with a threshold less than 1")

    this.threshold = threshold
    this.cache = {}
    this.orderLookup = {}
    this.head = null, this.tail = null
    this.count = 0
  }

  Cache.prototype.insert = function (key, value) {
    var node = new Node(key)
    node.next = this.head
    node.next === null || (node.next.prev = node)
    this.tail === null && (this.tail = node)

    this.head = node
    this.orderLookup[key] = node
    this.count++

    this.count > this.threshold && evictOldest.call(this)

    this.cache[key] = value
  }

  Cache.prototype.update = function (key, value) {
    updateOrdering.call(this, key)
    var was = this.cache[key]
    was && (this.cache[key] = value)
    return was
  }

  Cache.prototype.remove = function (key) {
    var node = orderLookup[key]
    this.head === node && (this.head = node.next)
    this.tail === node && (this.tail = node.prev)

    linkAdjacent(node)

    ;delete orderLookup[key]
    ;delete cache[key]
  }

  Cache.prototype.get = function (key) {
    var hit = this.cache[key]
    hit && updateOrdering.call(this, key)
    return hit
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
      ;delete this.cache[oldestKey]
      ;delete this.orderLookup[oldestKey]
      this.count--
  }

  function Node (key) {
    this.prev = null
    this.next = null
    this.key  = key
  }

  module.exports = Cache
}()
