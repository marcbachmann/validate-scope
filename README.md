# validate-scope

Checks whether a subset is contained in a list of scopes.
Uses code generation to reach better performance.

```js
// Check only one scope
var validate = require('validate-scope')(['user:edit'])

// pass an array
validate(['profile', 'user:edit']) // returns true
validate(['profile', 'another-scope']) // returns false

// or a string of scopes separated by whitespaces
validate('profile user:edit user:archive') // returns true

// or check multiple scopes
var validate = require('validate-scope')('user:edit AND user:archive')
validate('profile user:edit') // returns false
validate('profile user:edit user:archive') // returns true

// you can use more complex boolean expressions
var validate = require('validate-scope')('first && second && !third')
validate(['first']) // returns false
validate(['first second']) // returns true
validate(['first second third']) // returns false
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
  end ~3.51 s (3 s + 513290216 ns)
# validate(["some", "scopes", "as", "array"])
  end ~599 ms (0 s + 598547467 ns)
# traditional string split & array indexOf
  end ~8.58 s (8 s + 583230771 ns)
# traditional for loop & array indexOf
  end ~694 ms (0 s + 693684995 ns)

# total ~13 s (13 s + 388753449 ns)

# ok
```
