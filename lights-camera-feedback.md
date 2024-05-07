

## The Fiddlesticks

##### https://github.com/lmu-cmsi3710-spring2024/our-own-3d-library-fiddlesticks

| Category | Feedback | Points |
| --- | --- | ---: |
| | **Normal vectors** | |
| • Computation | Normal vectors are computed correctly | 10/10 |
| • Faceted and smooth looks | Faceted and smooth normals are computed correctly—though ngl the sphere smooth normals look a little odd. I suspect that there is a subtle bug lurking in there but it’s small enough to avoid deduction | 5/5 |
| • Storage | Normals are appropriately stored within 3D objects | 9/9 |
| • GLSL | Normal vectors are passed into GLSL correctly | 6/6 |
| | **Lighting** | |
| • Modeling | Light model is a single uniform variable—in some scenes. The shaders really should be consolidated at this point so that each scene has access to a uniform set of capabilities (–3) | 7/10 |
| • GLSL | Light settings are passed correctly to GLSL as a uniform variables (again, in some scenes; but this has been pointed out and deducted already above) | 10/10 |
| • Computation | Lighting computations are done correctly | 20/20 |
| | **Camera** | |
| • Look-at | The look-at camera matrix is computed correctly | 10/10 |
| • Modeling | The camera object is modeled sufficiently well. | 7/7 |
| • Shader | The camera matrix is successfully passed into and used by the shader code | 3/3 |
| | **Usage in Scene** | |
| | The various test scenes demonstrate lighting and camera capabilities but strictly remain as sandbox/tech demos…we’d like to have seen some movement toward your final scene at this point (–2) | 8/10 |
| Texture mapping (if any) | n/a |  |
| Code maintainability | There are easily fixable warnings—unused variables, need for error object, etc.—in the command line. Make it a habit to clean up as things get finalized (–2) | -2 |
| Code readability | Looks like some of you still don’t have Prettier autoformatting activated? (case in point: _mainTestPage.js_) (–2) | -2 |
| Version control | Decent commit granularity with _really_ descriptive messages, sometimes with big (all-caps) drama 😁 (+1) | 1 |
| Punctuality | Graded commit made on 4/21 3:28pm<br /><br /> **Graded commit:** [5677293732e385de809c3ff71e04aa1d702d48d3](https://github.com/lmu-cmsi3710-spring2024/our-own-3d-library-fiddlesticks/commit/5677293732e385de809c3ff71e04aa1d702d48d3) |  |
| | **Total** | **92/100** |
