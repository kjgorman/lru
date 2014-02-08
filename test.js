var assert = require('assert')
  , Cache  = require('./cache')

describe('construction', function () {
  it('should violently reject stupid cache sizes', function () {
    assert.throws(function () { return new Cache(0) }, Error)
    assert.throws(function () { return new Cache(-1) }, Error)
    assert.doesNotThrow(function () { return new Cache(1) })
  })
})

describe('insert', function () {
  it('should increment the counter', function () {
    var cache = new Cache(20)
    cache.insert('foo', 'bar')
    assert.equal(1, cache.count)
  })

  it('should allow one to retrieve the element', function () {
    var cache = new Cache(1)
    cache.insert('foo', 'bar')
    assert.equal('bar', cache.get('foo'))
  })

  it('should insert no more than the threshold', function () {
    var cache = new Cache(1)
    cache.insert('foo', 'bar')
    cache.insert('bar', 'quux')
    assert.equal(1, cache.count)
  })

  it('should remove the least recently updated', function () {
    var cache = new Cache(1)
    cache.insert('foo', 'bar')
    cache.insert('bar', 'quux')
    assert.equal(null, cache.get('foo'))
    assert.equal('quux', cache.get('bar'))
  })
})

describe('update', function () {
  it('should adjust the cached valued', function () {
    var cache = new Cache(1)
    cache.insert('foo', 'bar')
    cache.update('foo', 'quux')
    assert.equal('quux', cache.get('foo'))
  })

  it('should return the previous value', function () {
    var cache = new Cache(1)
    cache.insert('foo', 'bar')
    assert.equal('bar', cache.update('foo', 'quux'))
  })

  it('should not insert if the key wasn\'t already present', function () {
    var cache = new Cache(1)
    cache.update('foo', 'bar')
    assert.equal(0, cache.count)
    assert.equal(null, cache.get('foo'))
  })

  it('should reorder lru', function () {
    var cache = new Cache(2)
    cache.insert('a', 'b')
    cache.insert('c', 'd')
    cache.update('a', 'B')
    cache.insert('e', 'f')
    assert.equal(2, cache.count)
    assert.equal('B', cache.get('a'))
    assert.equal(null, cache.get('c'))
  })
})
