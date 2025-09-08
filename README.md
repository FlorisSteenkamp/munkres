Munkres implementation for Javascript
---------------------------------

[![NPM Downloads](https://img.shields.io/npm/dm/munkres.svg?style=flat)](https://npmjs.org/package/munkres)

## Introduction

Note: This is a modernized version (TypeScript + ESM modules) of the Munkres algorithm FORKED
from [this repo](https://github.com/addaleax/munkres-js)

The Munkres module provides an O(n³) implementation of the Munkres algorithm
(also called the [Hungarian algorithm][] or the Kuhn-Munkres algorithm).
The algorithm models an assignment problem as an N×M cost matrix, where
each element represents the cost of assigning the ith worker to the jth
job, and it figures out the least-cost solution, choosing a single item
from each row and column in the matrix, such that no row and no column are
used more than once.

[Hungarian algorithm]: https://en.wikipedia.org/wiki/Hungarian_algorithm

## Usage

```ts
import { munkres } from 'munkres';

munkres([
  [400, 150, 400],
  [400, 450, 600],
  [300, 225, 300]
])
// => [ [ 0, 1 ], [ 1, 0 ], [ 2, 2 ] ]
```

Returns the list of matrix indices corresponding to the optimal assignment.

When used in the browser, the global `computeMunkres` function is exposed.

See the docs in munkres.js for more details.

## Meta

This module is a translation of a Python implementation by
[Brian Clapper](https://github.com/bmc/munkres).

The original implementation is based on
<http://csclab.murraystate.edu/~bob.pilgrim/445/munkres.html>.

It is available via `bower` and `npm` as `munkres-js`.

## Copyright

&copy; 2014 Anna Henningsen (Conversion to JS)

&copy; 2008 Brian M. Clapper

## License

Apache License 2.0. See accompanying LICENSE file.
