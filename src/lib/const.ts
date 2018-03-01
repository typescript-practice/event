// The EventEmitter instance will emit its own 'newListener'
// event before a listener is added to its internal array of
// listeners.
export const NEW_LISTENER = 'newListener';

// The 'removeListener' event is emitted after the listener
// is removed.
export const REMOVE_LISTENER = 'removeListener';

// a maximum of 10 listeners can be registered for any single event
export const DEFAULT_MAX_LISTENER = 10;
