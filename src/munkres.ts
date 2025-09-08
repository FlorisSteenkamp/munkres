
/** Munkres working data state */
interface State {
    readonly n: number;
    readonly C: number[][];
    readonly row_covered: boolean[];
    readonly col_covered: boolean[];
    readonly marked: number[][];
    readonly path: number[][];
    Z0_r: number;
    Z0_c: number;
}


type Step = 1|2|3|4|5|6|7;


/**
 * Calculates the Munkres (also known as the Hungarian algorithm) solution
 * to the classical assignment problem.
 * 
 * Compute the indices for the lowest-cost pairings between rows and columns.
 * Returns a list of (row, column) tuples that can be used to traverse the matrix.
 *
 * @param cost_matrix the nxn cost matrix
 */

function munkres(
        cost_matrix: number[][]) {

    const C = structuredClone(cost_matrix);
    const n = C.length;

    const row_covered = new Array(n).fill(false);
    const col_covered = new Array(n).fill(false);

    const path = zeroMatrix(n*2);
    const marked = zeroMatrix(n);

    const state: State = {
        n, C, row_covered, col_covered, marked, path,
        Z0_c: 0, Z0_r: 0
    };

    const steps: ((state: State) => Step)[] = [
        undefined!, step1, step2, step3, step4, step5, step6
    ];

    let step: Step = 1;  // step 7 means done
    while (true) {
        if (step === 7) { break; }

        const func: (state: State) => Step = steps[step];

        step = func(state);
    }

    const results: number[] = [];
    for (let i=0; i<n; i++) {
        for (let j=0; j<n; j++) {
            if (marked[i][j] === 1) {
                results.push(j);
            }
        }
    }

    return results;
};


/**
 * For each row of the matrix, find the smallest element and
 * subtract it from every element in its row.
 * 
 * * modifies `C`
 */
function step1(state: State): Step {
    const { n, C } = state;

    for (let i=0; i<n; i++) {
        const minval = Math.min(...C[i]);

        for (let j=0; j<n; j++) {
            C[i][j] -= minval;
        }
    }

    return 2;
}


/**
 * Find a zero (Z) in the resulting matrix. If there is no starred
 * zero in its row or column, star Z. Repeat for each element in the
 * matrix. Go to Step 3.
 * 
 * * modifies `row_covered` and `col_covered` 
 */
function step2(state: State): Step {
    const { n, C, row_covered, col_covered, marked } = state;
    
    for (let i=0; i<n; i++) {
        for (let j=0; j<n; j++) {
            if (C[i][j] === 0 &&
                !col_covered[j] &&
                !row_covered[i]) {

                marked[i][j] = 1;
                col_covered[j] = true;
                row_covered[i] = true;
                break;
            }
        }
    }

    clear_covers(n, row_covered, col_covered);

    return 3;
}


/**
 * Cover each column containing a starred zero. If K columns are
 * covered, the starred zeros describe a complete set of unique
 * assignments. In this case, Go to DONE, otherwise, Go to Step 4.
 * 
 * * modifies `col_covered`
 */
function step3(state: State): Step {
    const { n, col_covered, marked } = state;

    let count = 0;

    for (let i=0; i<n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (marked[i][j] === 1 && !col_covered[j]) {
                col_covered[j] = true;
                count++;
            }
        }
    }

    return (count >= n) ? 7 : 4;
}


/**
 * Find a noncovered zero and prime it. If there is no starred zero
 * in the row containing this primed zero, Go to Step 5. Otherwise,
 * cover this row and uncover the column containing the starred
 * zero. Continue in this manner until there are no uncovered zeros
 * left. Save the smallest uncovered value and Go to Step 6.
 * 
 * * modifies `row_covered`, `col_covered`, `Z0_r` and `Z0_c`
 */
function step4(state: State): Step {
    const { n, row_covered, col_covered, marked } = state;

    let row = -1;
    let col = -1
    let star_col = -1;

    while (true) {
        [row, col] = find_a_zero(state);

        if (row < 0) {
            return 6;
        }

        marked[row][col] = 2;

        star_col = find_star_in_row(n, marked, row);
        if (star_col >= 0) {
            col = star_col;
            row_covered[row] = true;
            col_covered[col] = false;
        } else {
            state.Z0_r = row;
            state.Z0_c = col;

            return 5;
        }
    }
};


/**
 * Construct a series of alternating primed and starred zeros as
 * follows. Let Z0 represent the uncovered primed zero found in Step 4.
 * Let Z1 denote the starred zero in the column of Z0 (if any).
 * Let Z2 denote the primed zero in the row of Z1 (there will always
 * be one). Continue until the series terminates at a primed zero
 * that has no starred zero in its column. Unstar each starred zero
 * of the series, star each primed zero of the series, erase all
 * primes and uncover every line in the matrix. Return to Step 3
 * 
 * * modifies `path`, `row_covered`, `col_covered`
 */
function step5(state: State): Step {
    const { n, row_covered, col_covered, marked, path } = state;

    let count = 0;

    path[count][0] = state.Z0_r;
    path[count][1] = state.Z0_c;
    let done = false;

    while (!done) {
        const row = find_star_in_col(n, marked, path[count][1]);
        if (row >= 0) {
            count++;
            path[count][0] = row;
            path[count][1] = path[count-1][1];
        } else {
            done = true;
        }

        if (!done) {
            const col = find_prime_in_row(n, marked, path[count][0]);
            count++;
            path[count][0] = path[count-1][0];
            path[count][1] = col;
        }
    }

    convert_path(marked, path, count);
    clear_covers(n, row_covered, col_covered);
    erase_primes(n, marked);

    return 3;
};


/**
 * Add the value found in Step 4 to every element of each covered
 * row, and subtract it from every element of each uncovered column.
 * Return to Step 4 without altering any stars, primes, or covered
 * lines.
 * 
 * * modifies `C`
 */
function step6(state: State): Step {
    const { n, row_covered, col_covered, C } = state;

    const minval = find_smallest(n, row_covered, col_covered, C);

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (row_covered[i])
                C[i][j] += minval;
            if (!col_covered[j])
                C[i][j] -= minval;
        }
    }

    return 4;
};


/**
 * Returns the smallest uncovered value in the matrix,
 * or 
 *  if no value was found.
 */
function find_smallest(
        n: number,
        row_covered: boolean[],
        col_covered: boolean[],
        C: number[][]) {

    let minval = Number.POSITIVE_INFINITY;

    for (let i=0; i<n; i++) {
        for (let j=0; j<n; j++) {
            if (!row_covered[i] && !col_covered[j]) {
                if (minval > C[i][j]) {
                    minval = C[i][j];
                }
            }
        }
    }

    return minval;
};


/**
 * Find the first uncovered element with value 0 and returns the indices
 * of the found element or [-1, -1] if not found.
 */
function find_a_zero(state: State) {
    const { n, row_covered, col_covered, C } = state;

    for (let i=0; i<n; ++i) {
        for (let j=0; j<n; ++j) {
            if (C[i][j] === 0 &&
                !row_covered[i] &&
                !col_covered[j]) {

                return [i, j];
            }
        }
    }

    return [-1, -1];
}


/**
 * Find the first starred element in the specified row. Returns
 * the column index, or -1 if no starred element was found.
 *
 * @param row the index of the row to search
 */

function find_star_in_row(
        n: number,
        marked: number[][],
        row: number) {

    for (let j=0; j<n; j++) {
        if (marked[row][j] === 1) {
            return j;
        }
    }

    return -1;
};


/**
 * Find the first starred element in the specified column and
 * returns he row index, or -1 if no starred element was found.
 */
function find_star_in_col(
        n: number,
        marked: number[][],
        col: number) {

    for (let i = 0; i < n; i++) {
        if (marked[i][col] === 1) {
            return i;
        }
    }

    return -1;
};


/**
 * Find the first prime element in the specified row and returns the
 * column index, or -1 if no prime element was found.
 */
function find_prime_in_row(
        n: number,
        marked: number[][],
        row: number) {

    for (let j=0; j<n; j++) {
        if (marked[row][j] === 2) {
            return j;
        }
    }

    return -1;
}


function convert_path(
        marked: number[][],
        path: number[][],
        count: number) {

    for (let i=0; i <= count; i++) {
        marked[path[i][0]][path[i][1]] =
            (marked[path[i][0]][path[i][1]] === 1) ? 0 : 1;
    }
};


/**
 * Erase all prime markings
 * 
 * * modifies `marked`
 */
function erase_primes(
        n: number,
        marked: number[][]) {

    for (let i=0; i<n; i++) {
        for (let j=0; j<n; j++) {
            if (marked[i][j] === 2) {
                marked[i][j] = 0;
            }
        }
    }
};


/**
 * Clear all covered matrix cells.
 * 
 * * modifies `row_covered` and `col_covered`
 */
function clear_covers(
        n: number,
        row_covered: boolean[],
        col_covered: boolean[]) {

    for (let i=0; i<n; i++) {
        row_covered[i] = false;
        col_covered[i] = false;
    }
}


/**
 * Returns an n×n zero matrix.
 *
 * @param n matrix dimensions
 */
function zeroMatrix(n: number) {
    const M: number[][] = [];
    for (let i=0; i<n; i++) {
        let row: number[] = [];
        for (let j=0; j<n; j++) {
            row.push(0);
        }
        M.push(row);
    }

    return M;
}


/**
 * Calculates and returns the total cost based on the result of calling `munkres`.
 * 
 * @param M the original matrix
 * @param cols the result of calling `munkres`
 */
function calcTotalCost(
    M: number[][],
    cols: number[]) {

    let total = 0;
    for (let i=0; i<cols.length; ++i) {
        const col = cols[i];
        const value = M[i][col];
        total += value;
    }

    return total;
}


export { munkres, calcTotalCost }
