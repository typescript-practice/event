'use strict'
import EventEmitter from '../src/events'
const NOOP = function() {
  // empty
}

// Basics
test('basic', cb => {
  const events = new EventEmitter()
  events.on('testName', function(this: any, a: any, b: any) {
    expect(a).toEqual('value1')
    expect(b).toEqual('value2')
    expect(this).toEqual(events)
    cb()
  })
  events.emit('testName', 'value1', 'value2')
})

test('getMaxListeners()', () => {
  const events = new EventEmitter()
  expect(events.getMaxListeners()).toEqual(10)
})

test('setMaxListeners(200)', () => {
  const events = new EventEmitter()
  events.setMaxListeners(200)
  expect(events.getMaxListeners()).toEqual(200)
  expect(() => {
    events.setMaxListeners(-200)
  }).toThrow(Error)
})

test('on()&&emit()', function(this: any) {
  const events = new EventEmitter()
  events.on('testName1', function(this: any, a: any, b: any) {
    expect(a).toEqual('value1')
    expect(b).toEqual('value2')
    expect(this).toEqual(events)
  })
  events.on('testName1', (a: any, b: any) => {
    expect(a).toEqual('value1')
    expect(b).toEqual('value2')
    expect(this).toEqual({})
  })
  events.on('testName2', function(a: any, b: any) {
    expect(a).toEqual('value3')
    expect(b).toEqual('value4')
  })
  expect(events.emit('testName1', 'value1', 'value2')).toBeTruthy()
  expect(events.emit('testName2', 'value3', 'value4')).toBeTruthy()
  expect(events.emit('testName3', 'value3', 'value4')).toBeFalsy()
})

test('eventNames()', function(this: any) {
  const events = new EventEmitter()
  expect(events.eventNames()).toEqual([])
  events.on('testName1', NOOP)
  events.on('testName2', NOOP)
  events.on('testName3', NOOP)
  expect(events.eventNames()).toEqual(['testName1', 'testName2', 'testName3'])
})

test('eventNames()', function(this: any) {
  const events = new EventEmitter()
  events.on('testName1', NOOP)
  events.on('testName1', NOOP)
  events.on('testName1', NOOP)
  expect(events.listenerCount('testName1')).toEqual(3)
  expect(events.listenerCount('testNameX')).toEqual(0)
})

test('listeners()', function(this: any) {
  const events = new EventEmitter()
  const list = [
    function testFn1() {
      // empty
    },
    function testFn2() {
      // empty
    },
    function testFn3() {
      // empty
    },
    function testFn4() {
      // empty
    },
    function testFn4() {
      // empty
    }
  ]
  list.forEach(fn => {
    events.addListener('testName1', fn)
  })
  expect(events.listeners('testName1')).toEqual(list)
  expect(events.listeners('testNameX')).toEqual([])
})

test('once()', function(this: any) {
  const events = new EventEmitter()
  events.once('testName1', function() {
    // empty
  })
  expect(events.emit('testName1')).toBeTruthy()
  expect(events.emit('testName1')).toBeFalsy()
})

test('prependListener()', function(this: any) {
  const events = new EventEmitter()
  const res: any = []
  events.on('foo', () => res.push('a'))
  events.prependListener('foo', () => res.push('b'))
  expect(events.emit('foo')).toBeTruthy()
  expect(res).toEqual(['b', 'a'])
})

test('prependOnceListener()-1', function(this: any) {
  const events = new EventEmitter()
  let res: any = []
  events.on('foo', () => res.push('a'))
  events.once('foo', () => res.push('b'))
  events.prependOnceListener('foo', () => res.push('c'))

  expect(events.emit('foo')).toBeTruthy()
  expect(events.listenerCount('foo')).toEqual(1)
  expect(res).toEqual(['c', 'a', 'b'])
  expect(events.emit('foo')).toBeTruthy()
})

test('prependOnceListener()-2', function(this: any) {
  const events = new EventEmitter()
  let res: any = []
  events.once('foo', () => res.push('a'))
  events.once('foo', () => res.push('b'))
  events.prependOnceListener('foo', () => res.push('c'))

  expect(events.emit('foo')).toBeTruthy()
  expect(events.listenerCount('foo')).toEqual(0)
  expect(res).toEqual(['c', 'a', 'b'])
  expect(events.emit('foo')).toBeFalsy()
})

test('removeAllListeners()-1', function(this: any) {
  const events = new EventEmitter()
  const list = [
    function testFn1() {
      // empty
    },
    function testFn2() {
      // empty
    },
    function testFn3() {
      // empty
    },
    function testFn4() {
      // empty
    },
    function testFn4() {
      // empty
    }
  ]
  list.forEach(fn => {
    events.on('testName1', fn)
  })
  list.forEach(fn => {
    events.on('testName2', fn)
  })
  expect(events.listeners('testName1')).toEqual(list)
  expect(events.listeners('testName2')).toEqual(list)

  events.removeAllListeners(['testName2'])
  expect(events.listeners('testName1')).toEqual(list)
  expect(events.listeners('testName2')).toEqual([])
  events.removeAllListeners(['testName1'])
  expect(events.listeners('testName1')).toEqual([])
})

test('removeAllListeners()-2', function(this: any) {
  const events = new EventEmitter()
  const list = [
    function testFn1() {
      // empty
    },
    function testFn2() {
      // empty
    },
    function testFn3() {
      // empty
    },
    function testFn4() {
      // empty
    },
    function testFn4() {
      // empty
    }
  ]
  list.forEach(fn => {
    events.on('testName1', fn)
  })
  list.forEach(fn => {
    events.on('testName2', fn)
  })

  events.removeAllListeners()
  expect(events.listeners('testName1')).toEqual([])
  expect(events.listeners('testName2')).toEqual([])
})

test('removeListener()', function(this: any) {
  const events = new EventEmitter()
  const list = [
    function testFn1() {
      // empty
    },
    function testFn2() {
      // empty
    },
    function testFn3() {
      // empty
    },
    function testFn4() {
      // empty
    },
    function testFn4() {
      // empty
    }
  ]
  list.forEach(fn => {
    events.on('testName1', fn)
  })
  expect(events.removeListener('testName1', list[1])).toEqual(events)
  expect(events.removeListener('testName1', NOOP)).toEqual(events)
  expect(events.removeListener('testNameX', NOOP)).toEqual(events)
  expect(events.listenerCount('testName1')).toEqual(4)
  events.off('testName1', list[2])
  expect(events.listenerCount('testName1')).toEqual(3)
})

test('rawListeners()-1', function(this: any) {
  const events = new EventEmitter()
  const res: any = []
  events.once('log', () => res.push('a'))

  const listeners = events.rawListeners('log')
  const logFnWrapper = listeners[0]
  logFnWrapper.listener()
  expect(events.listenerCount('log')).toEqual(1)

  logFnWrapper()
  expect(events.listenerCount('log')).toEqual(0)
})

test('rawListeners()-2', function(this: any) {
  const events = new EventEmitter()
  const res: any = []
  events.on('log', () => res.push('a'))

  const listeners = events.rawListeners('log')
  const logFnWrapper = listeners[0]
  logFnWrapper.listener()
  expect(events.listenerCount('log')).toEqual(1)

  logFnWrapper()
  expect(events.listenerCount('log')).toEqual(1)
})
