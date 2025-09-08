/**
 * Calculates the Munkres (also known as the Hungarian algorithm) solution
 * to the classical assignment problem.
 *
 * Compute the indices for the lowest-cost pairings between rows and columns.
 * Returns a list of (row, column) tuples that can be used to traverse the matrix.
 *
 * @param cost_matrix the nxn cost matrix
 */
declare function munkres(cost_matrix: number[][]): number[];
/**
 * Calculates and returns the total cost based on the result of calling `munkres`.
 *
 * @param M the original matrix
 * @param cols the result of calling `munkres`
 */
declare function calcTotalCost(M: number[][], cols: number[]): number;
export { munkres, calcTotalCost };
