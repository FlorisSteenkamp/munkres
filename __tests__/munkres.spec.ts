/**
 * A Mocha unit-test for munkress-js
 * 
 * @author Erel Segal-Halevi
 * @since 2016-03
 * 
 * * modified by Floris
 */

import { munkres, calcTotalCost } from '../src/munkres.js'


test('handles singleton matrix', function() {
    const matrix = [[5]];
    expect(munkres(matrix)).toStrictEqual([0]);
});


test('handles negative singleton matrix', function() {
    const matrix = [[-5]];
    expect(munkres(matrix)).toStrictEqual([0]);
});


test('handles 2-by-2 matrix', function() {
    const matrix = [[5,3],[2,4]];
    expect(munkres(matrix)).toStrictEqual([1,0]);  // smallest cost is 3+2=5
});


test('handles 2-by-2 negative matrix', function() {
    const matrix = [[-5,-3],[-2,-4]];
    expect(munkres(matrix)).toStrictEqual([0,1]);
});


test('handles 3-by-3 matrix', function() {
    const matrix = [[5,3,1],[2,4,6],[9,9,9]];
    expect(munkres(matrix)).toStrictEqual([2,0,1]);  // smallest cost is 1+2+9=12
});


test('handles another 3-by-3 matrix', function() {
    const matrix = [
        [400, 150, 400],
        [400, 450, 600],
        [300, 225, 300]
    ];

    const r = munkres(matrix);
    const total = calcTotalCost(matrix, r);//?
    
    expect(munkres(matrix)).toStrictEqual([1,0,2]);
});


test('handles 3-by-3 matrix with both positive and negative values', function() {
    const matrix = [[5,3,-1],[2,4,-6],[9,9,-9]];
    expect(munkres(matrix)).toStrictEqual([1,0,2]);
});


test('handles all-zero 3-by-3 matrix', function() {
    const matrix = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];
    
    expect(munkres(matrix)).toStrictEqual([0,1,2]);
});


test('handles simple 3x3 matrix', function() {
    const matrix = [
        [5, 9, 1],
        [10, 3, 2],
        [8, 7, 4]
    ];

    const cols = munkres(matrix);
    let total = 0;
    for (let i=0; i<cols.length; ++i) {
        const col = cols[i];
        const value = matrix[i][col];
        total += value;
    }

    const total_ = calcTotalCost(matrix, cols)

    expect(total).toStrictEqual(12);
    expect(total).toStrictEqual(total_);
});


test('converts profit-matrix to cost-matrix', function() {
    const profitmatrix = [[5,3],[2,4]];
    const costmatrix = profitmatrix.map(r => r.map(v => -v));
    
    const r = munkres(costmatrix);//?
    expect(munkres(costmatrix)).toStrictEqual([0,1]);  // largest profit is 5+4=9
});


test('converts profit-matrix to cost-matrix', function() {
    const profitmatrix = [[2,4], [5,3]];
    const costmatrix = profitmatrix.map(r => r.map(v => -v));
    
    expect(munkres(costmatrix)).toStrictEqual([1,0]);
});


test('handles rectangular 3-by-4 matrix', function() {
    const MAX = 2048;

    const matrix = [
        [400, 150, 400, 1],
        [400, 450, 600, 2],
        [300, 225, 300, 3],
        [MAX, MAX, MAX, MAX]
    ];
    
    expect(munkres(matrix)).toStrictEqual([1,3,0,2]);
});


test('handles rectangular 4-by-3 matrix', function() {
    const MAX = 2048;

    const matrix = [
        [400, 150, 400, MAX],
        [400, 250, 600, MAX],
        [300, 225, 300, MAX],
        [510, 420, 330, MAX]
    ];

    const r = munkres(matrix);//?
    const total = calcTotalCost(matrix,r) - MAX;//?
    
    expect(r).toStrictEqual([1,3,0,2]);
});


test('handles a larger example (10x10 matrix)', function() {
    const matrix = [
        [4, 5, 4, 1, 5,   7, 1, 9, 0, 3],
        [4, 4, 6, 6, 6,   9, 2, 4, 3, 1],
        [3, 2, 3, 2, 3,   9, 1, 3, 4, 6],
        [1, 5, 2, 7, 8,   2, 3, 4, 5, 8],
        [9, 0, 3, 0, 1,   4, 2, 5, 7, 8],
        [2, 1, 1, 3, 6,   4, 2, 3, 1, 4],
        [6, 7, 8, 1, 3,   5, 7, 3, 8, 6],
        [3, 1, 5, 7, 8,   9, 9, 9, 9, 4],
        [9, 9, 1, 3, 4,   5, 6, 7, 1, 6],
        [0, 1, 3, 2, 1,   2, 4, 8, 9, 9]
    ];
    
    const r = munkres(matrix);//?
    expect(r).toStrictEqual([8,9,6,5,4,7,3,1,2,0]);

    const total = calcTotalCost(matrix, r);//?
});


test('handles a larger 7x7 permution matrix', function() {
    const matrix = [
        [1, 2, 6, 3, 7, 0, 5, 4],
        [6, 3, 2, 5, 0, 4, 7, 1],
        [2, 0, 1, 5, 4, 3, 7, 6],
        [4, 6, 1, 3, 2, 7, 0, 5],
        [2, 3, 1, 4, 7, 5, 6, 0],
        [5, 1, 7, 4, 0, 2, 6, 3],
        [7, 1, 2, 3, 4, 6, 5, 0],
        [7, 1, 4, 6, 0, 3, 2, 5]
    ];
    
    const r = munkres(matrix);
    expect(r).toStrictEqual([5,4,0,6,2,3,7,1]);

    // const total = calcTotalCost(matrix, r);//?
});


function shuffleArray(arr: number[]) {
    // Loop from the last element down to the second element
    for (let i=arr.length-1; i>0; i--) {
        // Generate a random index 'j' from 0 up to 'i' (inclusive)
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at index 'i' and index 'j'
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}
