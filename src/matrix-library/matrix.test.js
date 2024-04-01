import { FiddleMatrix } from '../matrix-library/matrix'

describe('Matrix library', () => {
    test('does not crash', () => {
      expect(1+2).toBe(3)
    })
})

let testMatrix1 = new FiddleMatrix()

let correctResult1 = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]

describe("Matrix", () => {
    it("correctly defaults to the identity 4x4 matrix", () => {
        expect(testMatrix1.matrix).toStrictEqual(correctResult1)
    })
})



let testMatrix2 = new FiddleMatrix()
testMatrix2.matrix = [
    [3, 2, 3, 2],
    [4, 7, 0, 5],
    [8, 3, 4, 10],
    [8, 0, 0, 2],
]

let testMatrix3 = new FiddleMatrix()
testMatrix3.matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
]

let correctResult2 = new FiddleMatrix()
correctResult2.matrix = [
    [45, 45, 45, 45],
    [59, 65, 71, 77],
    [95, 92, 89, 86],
    [16, 22, 28, 34],
]

describe("Matrix multiply function", () => {
    it("correctly multiplies two matrices, even up to double digits", () => {
        expect(testMatrix2.multiply(testMatrix3).matrix).toStrictEqual(correctResult2.matrix)
    })
})