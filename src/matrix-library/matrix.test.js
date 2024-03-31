import { FiddleMatrix } from '../matrix-library/matrix'

describe('Matrix library', () => {
    test('does not crash', () => {
      expect(1+2).toBe(3);
    });
  });

let testMatrix1 = new FiddleMatrix()
testMatrix1.matrix = [
    [3, 2, 3, 2],
    [4, 7, 0, 5],
    [8, 3, 4, 10],
    [8, 0, 0, 2],
]

let testMatrix2 = new FiddleMatrix()
testMatrix2.matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
]

let correctResult1 = new FiddleMatrix()
correctResult1.matrix = [
    [45, 45, 45, 45],
    [59, 65, 71, 77],
    [95, 92, 89, 86],
    [16, 22, 28, 34],
]

describe("Matrix multiply function", () => {
    it("correctly multiplies two matrices", () => {
        expect(testMatrix1.multiply(testMatrix2)).toBe(correctResult1.matrix)
    })
})