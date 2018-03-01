'use strict'
import EventEmitter from '../src/events'

const NOOP = function() {
  // empty
}

// Basics
test('newListener', () => {
  const events = new EventEmitter()
  const res: any = []
  const fnA = () => {
    res.push('A')
  }
  const fnB = () => {
    res.push('B')
  }
  // Only do this once so we don't loop forever
  events.once('newListener', (eventName: any, listener: any) => {
    if (eventName === 'event') {
      // Insert a new listener in front
      events.on('event', fnB)
    }

    expect(listener).toEqual(fnA)
  })
  events.on('event', fnA)
  events.emit('event')
  expect(res).toEqual(['B', 'A'])
})

test('Symbol', () => {
  const events = new EventEmitter()
  const res: any = []
  events.on('foo', () => {
    res.push('foo')
  })
  events.on('bar', () => {
    res.push('bar')
  })

  const sym = Symbol('symbol')
  events.on(sym, () => {
    res.push('sym')
  })

  events.emit('foo')
  events.emit(sym)
  events.emit('bar')
  expect(res).toEqual(['foo', 'sym', 'bar'])
  // Prints: [ 'foo', 'bar', Symbol(symbol) ]
})

test('removeListener', () => {
  const events = new EventEmitter()
  let res: any = []
  const callbackA = () => {
    res.push('A')
    events.removeListener('event', callbackB)
  }

  const callbackB = () => {
    res.push('B')
  }

  events.on('event', callbackA)

  events.on('event', callbackB)

  // callbackA removes listener callbackB but it will still be called.
  // Internal listener array at time of emit [callbackA, callbackB]
  events.emit('event')
  expect(res).toEqual(['A', 'B'])

  res = []

  // callbackB is now removed.
  // Internal listener array [callbackA]
  events.emit('event')
  expect(res).toEqual(['A'])
})
