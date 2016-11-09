# validate-scope

Checks whether a subset is contained in a list of scopes.
Uses code generation to reach better performance.

```js
// Check only one scope
var validate = require('validate-scope')(['user:edit'])

// pass an array
validate(['profile', 'user:edit', 'user:archive']) // returns true
validate(['profile', 'another-scope']) // returns false

// or a string of scopes separated by whitespaces
validate('profile user:edit user:archive') // returns true

// or check multiple scopes
var validate = require('validate-scope')(['user:edit', 'user:archive'])
validate('profile user:edit') // returns false
validate('profile user:edit user:archive') // returns true

```

# Api

```js
var validate = require('validate-scope')(array|string)
validate(array|string) // returns boolean
```

I suggest you to save your scopes as array and also pass that to this validation method. String operations are quite slow.


# Benchmark

100000000 iterations each
```bash
NANOBENCH version 1

# validate("some space separate scopes")
  end ~4.34 s (4 s + 343145562 ns)
# validate(["some", "scopes", "as", "array"])
  end ~743 ms (0 s + 743110911 ns)
# traditional string split & array indexOf
  end ~11 s (11 s + 198361893 ns)
# traditional for loop & array indexOf
  end ~946 ms (0 s + 946043059 ns)

# total ~17 s (17 s + 230661425 ns)

# ok
```
