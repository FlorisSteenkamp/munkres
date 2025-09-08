Munkres implementation for Javascript
---------------------------------

[![NPM Downloads](https://img.shields.io/npm/dm/munkres.svg?style=flat)](https://npmjs.org/package/munkres)

## Installation

```
npm i munkres
```

## Prelude
**Note**: This is a modernized version (TypeScript + ESM modules + functional) of the Munkres algorithm FORKED
from [this repo](https://github.com/addaleax/munkres-js).

**Note**: It only supports square matrices. Use negative values for a profit matrix (as opposed to cost). For
missing entries use a value larger than the largest expected cost value but that is as small as possible to
prevent floating point round-off issues (do *not* use `Number.MAX_SAFE_INTEGER/2`)

(I use this package to match two sets of point clouds to each other - with distance between
centroids as the cost function).

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
and can be used in `Node.js` (or in a browser when bundled using e.g. Webpack).

Additionally, self-contained `ECMAScript Module` (ESM) files `munkres.js` and
`munkres.min.js` in the `./browser` folder are provided.

## Introduction

The Munkres module provides an O(n³) implementation of the Munkres algorithm
(also called the Hungarian algorithm or the Kuhn-Munkres algorithm).
The algorithm models an assignment problem as an N×M cost matrix, where
each element represents the cost of assigning the ith worker to the jth
job, and it figures out the least-cost solution, choosing a single item
from each row and column in the matrix, such that no row and no column are
used more than once.

[Hungarian algorithm]: https://en.wikipedia.org/wiki/Hungarian_algorithm

## Usage

```ts
import { munkres } from 'munkres';

const M = [
    [400, 150, 400],
    [400, 450, 600],
    [300, 225, 300]
];  // => [1,0,2]

const colIdxs = munkres(M);

const total = calcTotalCost(M, colIdxs);  // => 850
```

Returns the list of column indices (one per row in order) corresponding to the
optimal assignment.

## Meta

This module is a translation of a Python implementation by
[Brian Clapper](https://github.com/bmc/munkres).

The original implementation is based on
<http://csclab.murraystate.edu/~bob.pilgrim/445/munkres.html>.

## Copyright

&copy; 2014 Anna Henningsen (Conversion to JS)

&copy; 2008 Brian M. Clapper

## License

Apache License 2.0. See accompanying LICENSE file.
