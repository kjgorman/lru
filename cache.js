!function () {

  function Cache (threshold) {
    this.threshold = threshold
    this.cache = {}
    this.orderLookup = {}
    this.head = null, this.tail = null
    this.count = 0
  }

  Cache.prototype.insert = function (key, value) {
    //push to ordering
    var node = new Node(key), oldestKey
    node.next = this.head
    this.tail || (this.tail = node)

    this.head = node
    this.orderLookup[key] = node
    this.count++

    if(this.count > this.threshold) {
      oldestKey = this.tail.key
      this.tail = this.tail.prev
      delete this.cache[oldestKey]
      delete this.orderLookup[oldestKey]
      this.count--
    }

    this.cache[key] = value
  }

  Cache.prototype.update = function (key, value) {
    this.updateOrdering(key)
    this.cache[key] = value
  }

  Cache.prototype.remove = function (key) {
    var node = orderLookup[key]
    if (this.head === node)
      this.head = node.next
    if (this.tail === node)
      this.tail = node.prev

    this.linkAdjacent(node)

    delete orderLookup[key]
    delete cache[key]
  }

  Cache.prototype.get = function (key) {
    var hit = this.cache[key]
    if (hit) this.updateOrdering(key)
    return hit
  }

  Cache.prototype.updateOrdering = function (key) {
    var node = this.orderLookup[key]

    if (node === this.tail)
      this.tail = node.prev

    this.linkAdjacent(node)

    node.next = this.head
    this.head = node
  }

  Cache.prototype.linkAdjacent = function (node) {
    node.prev && (node.prev.next = node.next)
    node.next && (node.next.prev = node.prev)
  }

  function Node (key) {
    this.prev = null
    this.next = null
    this.key  = key
  }

  module.exports = Cache
}()
