/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */

/**
 * Returns the vertices and faces for a small icosahedron.
 *
 * Let’s call the resulting data structure a “proto-geometry” because it has
 * the beginnings of a geometry but nothing close to what three.js has (yet).
 */
const icosahedron = () => {
    // The core icosahedron coordinates.
    const X = 0.525731112119133606
    const Z = 0.850650808352039932
  
    return {
      vertices: [
        [-X, 0.0, Z],
        [X, 0.0, Z],
        [-X, 0.0, -Z],
        [X, 0.0, -Z],
        [0.0, Z, X],
        [0.0, Z, -X],
        [0.0, -Z, X],
        [0.0, -Z, -X],
        [Z, X, 0.0],
        [-Z, X, 0.0],
        [Z, -X, 0.0],
        [-Z, -X, 0.0]
      ],
  
      facesByIndex: [
        [1, 4, 0],
        [4, 9, 0],
        [4, 5, 9],
        [8, 5, 4],
        [1, 8, 4],
        [1, 10, 8],
        [10, 3, 8],
        [8, 3, 5],
        [3, 2, 5],
        [3, 7, 2],
        [3, 10, 7],
        [10, 6, 7],
        [6, 11, 7],
        [6, 0, 11],
        [6, 1, 0],
        [10, 1, 6],
        [11, 0, 9],
        [2, 11, 9],
        [5, 2, 9],
        [11, 2, 7]
      ]
    }
  }
  
  /**
   * Utility function for turning our nascent geometry object into a “raw” coordinate array
   * arranged as triangles.
   */
  const toRawTriangleArray = protoGeometry => {
    const result = []
  
    protoGeometry.facesByIndex.forEach(face => {
      face.forEach(vertexIndex => {
        result.push(...protoGeometry.vertices[vertexIndex])
      })
    })
  
    return result
  }
  
  /*
   * Utility function for turning indexed vertices into a “raw” coordinate array
   * arranged as line segments.
   */
  const toRawLineArray = protoGeometry => {
    const result = []
  
    protoGeometry.facesByIndex.forEach(face => {
      // Oddly enough, the inner loop here is clearer as a `for` loop because we
      // need to access the current vertex index and the one after that (wrapping
      // around once we get to the end).
      for (let i = 0, maxI = face.length; i < maxI; i += 1) {
        // “Connect the dots.”
        result.push(
          ...protoGeometry.vertices[face[i]],
          ...protoGeometry.vertices[face[(i + 1) % maxI]] // Lets us wrap around to 0.
        )
      }
    })
  
    return result
  }
  
  export { icosahedron, toRawTriangleArray, toRawLineArray }
  