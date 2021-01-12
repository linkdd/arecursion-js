module.exports = {
  iterate: (...args) => ({ recurse: true, args }),
  end: (result) => ({ recurse: false, result }),
  doAsync: fn => async (...initialArgs) => {
    const handler = (...args) => (resolve, reject) => {
      try {
        const nextIteration = status => {
          if (status.recurse) {
            const nextHandler = handler(...status.args)
            setImmediate(() => nextHandler(resolve, reject))
          }
          else {
            resolve(status.result)
          }
        }

        const result = fn(...args)

        if (result instanceof Promise) {
          result.then(nextIteration, reject)
        }
        else {
          nextIteration(result)
        }
      }
      catch (err) {
        reject(err)
      }
    }

    return await new Promise(handler(...initialArgs))
  }
}
