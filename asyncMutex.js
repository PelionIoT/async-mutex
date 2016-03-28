'use strict'

/**
 * An asynchronous analog to a mutex
 * in multithreaded programming. This is
 * used to coordinate access to a series
 * of asynchronous callbacks or chained
 * promises. In asynchronous programming
 * the same chain of promises executed
 * twice can become intermixed during 
 * execution such that the sequence of
 * the first effectively happens in parallel
 * with the second.
 * 
 * @class AsyncMutex
 * @constructor
 * * @example
 * ```
 * let lock = new AsyncMutex()
 * 
 * function cs() {
 *     lock.acquire().then(function() {
 *         ...
 *     }).then(function() {
 *         ...
 *     }).then(function(result) {
 *         lock.release()
 *         return result
 *     }, function(error) {
 *         lock.release()
 *         throw error
 *     })
 * }
 * ```
 */
class AsyncMutex {
    constructor() {
        this.queue = [ ]
        this.acquired = false
    }

    /**
     * This method returns a promise that resolves
     * as soon as all other callers of acquire()
     * have invoked release(). When the promise
     * resolves, you can access to critical section
     * or protected resource
     * 
     * @method acquire
     * @return {Promise}
     */
    acquire() {
        let self = this
    
        return new Promise(function(resolve, reject) {
            if(self.acquired) {
                self.queue.push(resolve)
            }
            else {
                self.acquired = true
                resolve()
            }
        })
    }

    /**
     * This method indicates that you are done
     * with the critical section and will give
     * control to the next caller to acquire()
     * 
     * @method release
     */
    release() {
        let next = this.queue.shift()
    
        if(next) {
            next()
        }
        else {
            this.acquired = false
        }
    }
    
    /**
     * This method returns the length of the
     * number of threads waiting to acquire
     * this lock
     */
    queueSize() {
        return this.queue.length
    }
}

module.exports = AsyncMutex
