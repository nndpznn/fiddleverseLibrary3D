## Commentary


### What aspects of defining a 3D scene are successfully handled by your library behind the scenes?
- We have aimed to make the user experience as straightforward as possible by reducing boilerplate code. Therefore, all shader code, scene setup, and processing functions are handled internally. 

### What aspects are not handled behind the scenes? (i.e., the dev user needs to write code for them)
- We only require that users initialize, position, and animate their objects, while also giving them agency to create more complex structures such as groups.

### How much code for using your library is the same at the application level, regardless of the specific scene?
- Around 80 lines of code are required to create a basic scene, which is around 40% of the total code on average. This includes initializing the Fiddleverse, creating the advanceScene animation loop, and returning the HTML script displaying the page.

### What aspects of your design would you keep, if you got a chance to do this library over?
- We would definitely maintain the extremely simple process of adding objects to a scene and creating composite groups of objects.
- We also like our decision to make the orthographic perspective matrix dependent on the desired screen width and height. Automatically setting some parts of the scene like this help create a simpler creation process for the user.

### What aspects of your design would you change?
- We would find a way to make using matrices simpler for easy scaling, translation, and rotation.
- We would also find a more intuitive way to operate the camera, and introduce different types of light.

