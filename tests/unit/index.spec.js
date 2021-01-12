const { describe, it } = require('mocha')
const { expect } = require('chai')

const recursion = require('../../src/index')

describe('recursion', () => {
  describe('iterate()', () => {
    it('should return an object indicating what to do on the next iteration', () => {
      const result = recursion.iterate(1, 2, 3)
      expect(result.recurse).to.be.true
      expect(result.args).to.deep.equal([1, 2, 3])
    })
  })

  describe('end()', () => {
    it('should return an object indicating what to do on the next iteration', () => {
      const result = recursion.end([1, 2, 3])
      expect(result.recurse).to.be.false
      expect(result.result).to.deep.equal([1, 2, 3])
    })
  })

  describe('doAsync()', () => {
    it('should execute a recursive function', async () => {
      const factorial = recursion.doAsync((n, acc) => {
        if (typeof acc === 'undefined') {
          acc = 1
        }

        if (n > 1) {
          return recursion.iterate(n - 1, acc * n)
        }
        else {
          return recursion.end(acc)
        }
      })

      const result = await factorial(5)
      expect(result).to.equal(120)
    })

    it('should also execute async functions', async () => {
      const slow_sum = recursion.doAsync(async (n, acc) => {
        if (typeof acc === 'undefined') {
          acc = 0
        }

        // async breakpoint, abstracts away an asynchronous task
        await 0

        if (n > 0) {
          return recursion.iterate(n - 1, acc + n)
        }
        else {
          return recursion.end(acc)
        }
      })

      const result = await slow_sum(5)
      expect(result).to.equal(15)
    })

    it('should raise the exception thrown in a recursion', async () => {
      const will_fail = recursion.doAsync(() => {
        throw new Error('must fail')
      })

      try {
        await will_fail()
        throw new Error('did not fail')
      }
      catch (err) {
        expect(err).to.be.an('error')
        expect(err.message).to.equal('must fail')
      }
    })

    it('should raise the exception thrown in an async recursion', async () => {
      const will_fail = recursion.doAsync(async () => {
        // async breakpoint, abstracts away an asynchronous task
        await 0

        throw new Error('must fail')
      })

      try {
        await will_fail()
        throw new Error('did not fail')
      }
      catch (err) {
        expect(err).to.be.an('error')
        expect(err.message).to.equal('must fail')
      }
    })
  })
})
