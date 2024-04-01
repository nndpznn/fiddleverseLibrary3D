import fiddle3D from './fiddle3D'

const deepCopyArray = (array) =>{
  return JSON.parse(JSON.stringify(array))
}

class IcosphereThing extends fiddle3D {
  constructor(gl, color) {
    // The core icosahedron coordinates.
    // Credit for icosphere generation method to: http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html and https://observablehq.com/@mourner/fast-icosphere-mesh 
    const X = 0.525731112119133606
    const Z = 0.850650808352039932

    //Base Icosahedron Vertices and Triangles
    const icosaVertices = [
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
    ]
    const icosaTriangles = [
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

    //Since we need to iterate through the original copies without messing with them, we're going to deepcopy the vertex and triangle arrays so we can start adding to them
    const icosphereVertices = deepCopyArray(icosaVertices)
    const icosphereTriangles = deepCopyArray(icosaTriangles)

    //Our first midpoint will be at index 12 in the vertices array, so start the index counter at 11 (we increment before returning)
    let vIndex = 11

    /**
     * Midpoint function that calculates the midpoint between the two given points and puts it into the array of vertices
     * 
     * returns: index of the generated midpoint in the vertices array
    */
    const getMiddlePoint = (p1, p2) => {
        //Lets first make sure we know which point is smaller
        let firstSmaller = p1 < p2
        let smallerPoint = firstSmaller ? p1: p2
        let largerPoint = firstSmaller ? p2: p1
        console.log("Generating midpoint from", p1, p2)
        //Add the points together and divide them by 2 to get the midpoint
        let mid = [(smallerPoint[0] + largerPoint[0])/2,
        (smallerPoint[1] + largerPoint[1])/2, 
        (smallerPoint[2] + largerPoint[2])/2, ]

        console.log("Midpoint is: ", mid)
        //Put new midpoint into the vertex array
        icosphereVertices.push(mid)
        //Increment vIndex so we have a reference to the new point and return it
        vIndex++
        return vIndex
    }

    //For each existing triangle in the icosahedron, we need to subdivide that triangle into 4 triangles
    for(var i = 0; i < icosaTriangles.length; i++){
      console.log("Spltting triangle: ", icosaTriangles[i])
      //Grab the vertices in the current triangle
      const v1 = icosaVertices[icosaTriangles[i][0]]
      const v2 = icosaVertices[icosaTriangles[i][1]]
      const v3 = icosaVertices[icosaTriangles[i][2]]
      //Get midpoints for each line in the triangle
      let m1 = getMiddlePoint(v1, v2)
      let m2 = getMiddlePoint(v2, v3)
      let m3 = getMiddlePoint(v3, v1)
      //Connect the old vertices to the new vertices and connect the new vertices to make the new center triangle
      icosphereTriangles.push([icosaTriangles[i][0], m1, m3])
      icosphereTriangles.push([icosaTriangles[i][1], m2, m1])
      icosphereTriangles.push([icosaTriangles[i][2], m3, m2])
      icosphereTriangles.push([m1, m2, m3])
    }
    console.log(icosphereVertices)
    console.log(icosphereTriangles)

   //So that the icosphere doesn't just become a flat subdivided icosahedron, we need to normalize the points so that they are equidistant from the center
   for (var k = 0; k < icosphereVertices.length; k++) {
      const normalizer = 1 / Math.hypot(icosphereVertices[i][0], icosphereVertices[i][1], icosphereVertices[i][2])
      icosphereVertices[i][0] *= normalizer
      icosphereVertices[i][1] *= normalizer
      icosphereVertices[i][2] *= normalizer
    }

    super(
      gl,

      icosphereVertices,

      icosphereTriangles,

      color
    )
  }
}

export default IcosphereThing