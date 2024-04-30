

## The Fiddlesticks

##### https://github.com/lmu-cmsi3710-spring2024/our-own-3d-library-fiddlesticks

| Category | Feedback | Points |
| --- | --- | ---: |
| | **4×4 matrix object/library** | |
| • Identity | New matrix defaults to the identity matrix | 2/2 |
| • Multiplication | Matrix multiplication is implemented correctly | 8/8 |
| • Team matrix | Perspective (frustum) matrix is implemented correctly | 4/4 |
| • GLSL conversion | A `glForm` function is implemented, which does most of the work toward WebGL/GLSL conversion. It could have gone a little further by integrating or adding a function that also wraps it in a `Float32Array` (–1) | 2/3 |
| • Implementation | The matrix library is implemented well, including some clean file separation | 5/5 |
| | **Matrix test suite** | |
| • Identity test | Identity matrix default is explicitly tested | 1/1 |
| • Identity coverage | Identity matrix default is fully covered by tests | 1/1 |
| • Multiplication test | Matrix multiplication is explicitly tested | 4/4 |
| • Multiplication coverage | Matrix multiplication is fully covered by tests | 4/4 |
| • Team matrix test | A test described as the one for perspective projection matrices exists…but it is a copy of the orthographic projection test 🫤 (–1) | 1/2 |
| • Team matrix coverage | Because the test doesn’t actually test the perspective matrix, it doesn’t genuinely cover that code (–2) | 0/2 |
| • GLSL conversion test | `glForm` is explicitly tested…but trivially, because the test case uses the identity matrix. That matrix is symmetric across the diagonal—not the most general test case (–1) | 1/2 |
| • GLSL conversion coverage | `glForm` is fully covered | 1/1 |
| • _matrix-credits.md_ | _matrix-credits.md_ clearly lists who did what |  |
| | **Matrix use in 3D objects** | |
| • Instance transformation | An instance transform is maintained and used (the scene imposes a hardcoded translate at the top of the transform tree that should be generalized eventually, but that doesn’t detract from the existence of the general mechanism itself) | 10/10 |
| • Parent propagation | Group transform propagation is noted but has a loophole that you might consider revising: the group transform is propagated immediately through all children. However, doing this in advance interferes with _instance_ transforms that the scene might want to apply later. To avoid this, propagate the transforms _at render time_ so that all instance transforms can be set at any time, independent of the parent matrix (–2) | 13/15 |
| • Implementation | Overall implementation looks good—you just need to use it more now in order to ensure that it works well and is robust | 5/5 |
| | **Matrix use in projection** | |
| • Usage when rendering | Projection matrix is mostly implemented, but needs a little more consolidation and customizability (i.e., refactor the hardcode in `drawScene` into something that is easily set outside) (–3) | 7/10 |
| • Implementation | Overall implementation approach is looking OK, pending the consolidation and unhardcoding mentioned above | 5/5 |
| Extra credit (if any) | n/a |  |
| Code maintainability | There’s an easily fixable warning—unused variable—in the command line. Make it a habit to clean up as things get finalized (–2) | -2 |
| Code readability | No major readability issues |  |
| Version control | Decent commit granularity with sufficiently descriptive messages |  |
| Punctuality | Graded commit made on 4/3 11:20pm<br /><br /> **Graded commit:** [529261fb541553ce8b3539b17e7c81254cf078d3](https://github.com/lmu-cmsi3710-spring2024/our-own-3d-library-fiddlesticks/commit/529261fb541553ce8b3539b17e7c81254cf078d3) |  |
| | **Total** | **72/84** |
