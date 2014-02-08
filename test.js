var assert = require('assert')
var Cache = require('./cache')

describe('insert', function () {
  it('should have one element', function () {
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
