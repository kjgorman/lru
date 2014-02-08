/*jshint asi:true, expr:true */
-function () {
  'use strict';

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

    ++this.count > this.threshold && evictOldest(this)

    this.cache[key] = value
  }

  Cache.prototype.update = function (key, value) {
    updateOrdering(this, key)
    var was = this.cache[key]
    was && (this.cache[key] = value)
    return was
  }

  Cache.prototype.remove = function (key) {
    var node = this.orderLookup[key]
    this.head === node && (this.head = node.next)
    this.tail === node && (this.tail = node.prev)

    linkAdjacent(node)

    remove(this, key)
  }

  Cache.prototype.get = function (key) {
    var hit = this.cache[key]
    hit && updateOrdering(this, key)
    return hit
  }

  Cache.prototype.onEvict = function (λ) {
    (this.afterEvict || (this.afterEvict =[])).push(λ)
  }

  function updateOrdering (cache, key) {
    var node = cache.orderLookup[key]
    if(!node) return

    node === cache.tail && (cache.tail = node.prev)
    linkAdjacent(node)

    node.next = cache.head
    cache.head = node
  }

  function linkAdjacent (node) {
    node.prev && (node.prev.next = node.next)
    node.next && (node.next.prev = node.prev)
  }

  function evictOldest (cache, key) {
    var oldestKey = cache.tail.key
    cache.tail = cache.tail.prev
    var removed = remove(cache, oldestKey)
    cache.afterEvict && cache.afterEvict.map(function (λ) { λ(removed) })
  }

  function remove (cache, key) {
    delete cache.orderLookup[key]
    var was = cache.cache[key]
    ;delete cache.cache[key]
    cache.count--
    return was
  }

  function Node (key) {
    this.prev = null
    this.next = null
    this.key  = key
  }

  module.exports = Cache
}()
