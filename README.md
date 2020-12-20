<h1 align="center">Asynchronous Recursion without Maximum Depth</h1>

## :alembic: How does it work ?

Thanks to the `setImmediate` function, the next iteration of the recursion is
scheduled on the next frame of the event-loop.

The current iteration will return, removing the function from the call stack.

The whole recursion is wrapped in a promise that will resolve to the result of
your recursive function

## :package: Installation

```
$ yarn add arecursion-js
```

## :wrench: Usage

```javascript
const recursion = require('arecursion-js')

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

const main = async () => {
    console.log(await factorial(5))
}

main()
```

Or with an asynchronous function:

```javascript
const recursion = require('arecursion-js')

const slow_sum = recursion.doAsync(async (n, acc) => {
    if (typeof acc === 'undefined') {
        acc = 0
    }

    await some_slow_task()

    if (n > 1) {
        return recursion.iterate(n - 1, acc + n)
    }
    else {
        return recursion.end(acc)
    }
})

const main = async () => {
    console.log(await slow_sum(5))
}

main()
```

## :memo: License

This package is released under the terms of the [MIT License](LICENSE.txt).
