/**
 * A Mocha unit-test for munkress-js
 * 
 * @author Erel Segal-Halevi
 * @since 2016-03
 */


import { munkres } from '../munkres.js'

test('Munkres Algorithm', function() {
    it('handles singleton matrix', function() {
        const matrix = [[5]];
        munkres(matrix).should.eql([[0,0]]);
    });
    
    it('handles negative singleton matrix', function() {
        const matrix = [[-5]];
        munkres(matrix).should.eql([[0,0]]);
    });
    
    it('handles 2-by-2 matrix', function() {
        const matrix = [[5,3],[2,4]];
        munkres(matrix).should.eql([[0,1],[1,0]]);  // smallest cost is 3+2=5
    });
    
    it('handles 2-by-2 negative matrix', function() {
        const matrix = [[-5,-3],[-2,-4]];
        munkres(matrix).should.eql([[0,0],[1,1]]);
    });
    
    it('handles 3-by-3 matrix', function() {
        const matrix = [[5,3,1],[2,4,6],[9,9,9]];
        munkres(matrix).should.eql([[0,2],[1,0],[2,1]]);  // smallest cost is 1+2+9=12
    });
    
    it('handles another 3-by-3 matrix', function() {
        const matrix = [
            [400, 150, 400],
            [400, 450, 600],
            [300, 225, 300]
        ];
        
        munkres(matrix).should.eql([[0,1],[1,0],[2,2]]);
    });
    
    it('handles 3-by-3 matrix with both positive and negative values', function() {
        const matrix = [[5,3,-1],[2,4,-6],[9,9,-9]];
        munkres(matrix).should.eql([[0,1],[1,0],[2,2]]);
    });
    
    it('handles all-zero 3-by-3 matrix', function() {
        const matrix = [
          [0,0,0],
          [0,0,0],
          [0,0,0]
        ];
        
        munkres(matrix).should.eql([[0,0],[1,1],[2,2]]);
    });
    
    it('handles rectangular 3-by-4 matrix', function() {
        const matrix = [
          [400, 150, 400, 1],
          [400, 450, 600, 2],
          [300, 225, 300, 3]
        ];
        
        munkres(matrix).should.eql([[0,1],[1,3],[2,0]]);
    });
    
    it('handles rectangular 3-by-4 matrix, shorthand-style', function() {
        const matrix = [
          [400, 150, 400, 1],
          [400, 450, 600, 2],
          [300, 225, 300, 3]
        ];
        
        munkres(matrix).should.eql([[0,1],[1,3],[2,0]]);
    });

    it('converts profit-matrix to cost-matrix', function() {
        const profitmatrix = [[5,3],[2,4]];
        const costmatrix = Munkres.make_cost_matrix(profitmatrix);
        
        munkres(costmatrix).should.eql([[0,0],[1,1]]);  // largest profit is 5+4=9
    });
});
