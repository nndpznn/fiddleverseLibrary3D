import { FiddleMatrix } from '../matrix-library/matrix'
import OrthoMatrix from './orthographicMatrix'
import ScaleMatrix from './scaleMatrix'
import TranslationMatrix from './translationMatrix'

describe('Matrix library', () => {
    test('does not crash', () => {
      expect(1+2).toBe(3)
    })
})

// IDENTITY TEST
let identityTest1 = new FiddleMatrix()

let correctIdentity = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]

describe("Matrix", () => {
    it("correctly defaults to the identity 4x4 matrix", () => {
        expect(identityTest1.matrix).toStrictEqual(correctIdentity)
    })
})

// MULTIPLICATION TEST
let multiTest1 = new FiddleMatrix()
multiTest1.matrix = [
    [3, 2, 3, 2],
    [4, 7, 0, 5],
    [8, 3, 4, 10],
    [8, 0, 0, 2],
]

let multiTest2 = new FiddleMatrix()
multiTest2.matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
]

let correctMulti = new FiddleMatrix()
correctMulti.matrix = [
    [45, 45, 45, 45],
    [59, 65, 71, 77],
    [95, 92, 89, 86],
    [16, 22, 28, 34],
]

describe("Matrix multiply function", () => {
    it("correctly multiplies two matrices, even up to double digits", () => {
        expect(multiTest1.multiply(multiTest2).matrix).toStrictEqual(correctMulti.matrix)
    })
})

// TRANSLATION TEST
let translationTest = new TranslationMatrix(0.5, 1, 0.75)
let correctTranslation = [
    [1, 0, 0, 0.5],
    [0, 1, 0, 1],
    [0, 0, 1, 0.75],
    [0, 0, 0, 1]
]

describe("Translation Matrix", () => {
    it("correctly takes translation inputs and creates a corresponding matrix", () =>{
        expect(translationTest.matrix).toStrictEqual(correctTranslation)
    })
})

// SCALE TEST
let scaleTest = new ScaleMatrix(0.5, 2, 3)
let correctScale = [
    [0.5, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 3, 0],
    [0, 0, 0, 1]
]

describe("Scale Matrix", () => {
    it("correctly takes scalar inputs and creates a corresponding matrix", () =>{
        expect(scaleTest.matrix).toStrictEqual(correctScale)
    })
})

// ROTATION TEST

// ORTHOGRAPHIC TEST
// let orthoTest1 = new FiddleMatrix()
// orthoTest1.matrix = [
//     [3, 2, 1, 0],
//     [4, 5, 6, 0],
//     [9, 8, 7, 0],
//     [0, 0, 0, 1],
// ]

// let orthoTest2 = new OrthoMatrix("y")

// let orthoTest3 = orthoTest2.multiply(orthoTest1)

// let correctOrtho = [
//     [3, 2, 1, 0],
//     [0, 0, 0, 0],
//     [9, 8, 7, 0],
//     [0, 0, 0, 1],
// ]

// describe("Orthographic projection matrix", () => {
//     it("correctly removes a certain dimension of a matrix", () => {
//         expect(orthoTest3.matrix).toStrictEqual(correctOrtho)
//     })
// })

// PROJECTION TEST

// WEBGL/GLSL CONVERSION TEST