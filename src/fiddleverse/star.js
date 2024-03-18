import { BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh, Group } from './fiddle3D'

// Here’s a case where Prettier doesn’t quite do the best job so we take the responsibility of formatting
// this ourselves.
//
// prettier-ignore
const BASE_VERTICES = [
  [0, 0, 1],  // 0 middle of star for 3d
  [0, 2.5, 0], // 1 top of the star
  [-0.5, 1, 0], //2
  [-2.5, 1, 0], //3
  [-1, 0, 0], //4
  [-1.5, -2, 0], //5
  [0, -1, 0], // 6
  [1.5, -2, 0], //7
  [1, 0, 0], //8
  [0.5, 1, 0], //9
  [2.5, 1, 0] //10
]

// prettier-ignore
const BASE_COLORS = [
  [   1,    1,   0],
  [   1,    1,   0],
  [   1,    1,   0],
  [   1,    1,   0],
  [   1,    1,   0],
  [   1,    1,   0] 
]

/**
 * Creates a custom geometry out of a raw listing of vertices. Working this out on graph paper can be
 * a good first step here! Alternatively, you can write some code to generate these vertices, if the
 * shape that you have in mind can be computed in some way.
 */
const createFacetedstarGeometry = () => {
  const geometry = new BufferGeometry()

  // We build each triangle as a separate face, copying a vertex if needed. Remember, counterclockwise
  // is the “front.”
  //
  // prettier-ignore
  const vertices = new Float32Array([
    ...BASE_VERTICES[1], ...BASE_VERTICES[2], ...BASE_VERTICES[0], 
    ...BASE_VERTICES[1], ...BASE_VERTICES[0], ...BASE_VERTICES[9], 
    ...BASE_VERTICES[9], ...BASE_VERTICES[0], ...BASE_VERTICES[10], 
    ...BASE_VERTICES[0], ...BASE_VERTICES[8], ...BASE_VERTICES[10], 
    ...BASE_VERTICES[0], ...BASE_VERTICES[7], ...BASE_VERTICES[8],
    ...BASE_VERTICES[3], ...BASE_VERTICES[4], ...BASE_VERTICES[2], 
    ...BASE_VERTICES[0], ...BASE_VERTICES[6], ...BASE_VERTICES[7], 
    ...BASE_VERTICES[0], ...BASE_VERTICES[5], ...BASE_VERTICES[6], 
    ...BASE_VERTICES[0], ...BASE_VERTICES[4], ...BASE_VERTICES[5],
    ...BASE_VERTICES[0], ...BASE_VERTICES[3], ...BASE_VERTICES[4],
    ...BASE_VERTICES[0], ...BASE_VERTICES[2], ...BASE_VERTICES[3],
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  // We coordinate our colors to match the corresopnding vertex.
  //
  // prettier-ignore
  const colors = new Float32Array([
    ...BASE_COLORS[0], ...BASE_COLORS[1], ...BASE_COLORS[4],
    ...BASE_COLORS[1], ...BASE_COLORS[2], ...BASE_COLORS[4],
    ...BASE_COLORS[0], ...BASE_COLORS[5], ...BASE_COLORS[1],
    ...BASE_COLORS[1], ...BASE_COLORS[5], ...BASE_COLORS[2],
    ...BASE_COLORS[0], ...BASE_COLORS[4], ...BASE_COLORS[3],
    ...BASE_COLORS[3], ...BASE_COLORS[4], ...BASE_COLORS[2],
    ...BASE_COLORS[0], ...BASE_COLORS[3], ...BASE_COLORS[5],
    ...BASE_COLORS[2], ...BASE_COLORS[5], ...BASE_COLORS[3]
  ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // With every face having its “own” vertex (since vertices are always copied), the computed normals correspond
  // exactly to the faces’ directions, leading to a faceted look.
  geometry.computeVertexNormals()
  return geometry
}

class star {
  constructor() {
    const material = new MeshPhongMaterial({ color: 0xFFFF00 })

    const facetedGeometry = createFacetedstarGeometry()
    const facetedMesh = new Mesh(facetedGeometry, material)


    this.group = new Group()
    this.group.add(facetedMesh)
  }
}

export default star