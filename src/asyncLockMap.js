'use strict'

const AsyncMutex = require('./asyncMutex')

class AsyncLockMap {
    constructor() {
        this.map = new Map()
    }
    
    acquire(key) {
        if(!this.map.has(key)) {
            this.map.set(key, new AsyncMutex())
        }
        
        return this.map.get(key).acquire()
    }
    
    release(key) {
        if(this.map.has(key)) {
            this.map.get(key).release()
            
            if(this.map.get(key).queueSize() == 0) {
                this.map.delete(key)
            }
        }
    }
}

module.exports = AsyncLockMap
