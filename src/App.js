/**
 * This React app is purely starter boilerplate. Use it to demonstrate your 3D library.
 */
import { NavLink, Route, Routes } from 'react-router-dom'

import './App.css'

import Sandbox from './Sandbox'
import PitchedScene from './PitchedScene'
import IsocahedronTest from './isocahedronTestPage'
import TestPage3 from './testpage3'
import SphereTest from './wingTestPage'

const classNamePicker = ({ isActive }) => (isActive ? 'current' : null)

const Greeting = () => (
  <article>
    <h1>This is starter code only!</h1>

    <p>
      Make sure to take this apart and put it back with a better design once you’ve gotten the hang of WebGL and GLSL.
    </p>
  </article>
)

const App = () => {
  return (
    <article className="App">
      <nav>
        <NavLink className={classNamePicker} to="/sandbox">
          Sandbox Scene
        </NavLink>

        <NavLink className={classNamePicker} to="/pitched">
          Pitched Scene
        </NavLink>

        <NavLink className={classNamePicker} to="/isocahedron">
          Isocahedron Test Page
        </NavLink>

        <NavLink className={classNamePicker} to="/sphere">
          Sphere Test Page
        </NavLink>

        <NavLink className={classNamePicker} to="/testpage3">
          Wing and Asteroid Page
        </NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="" element={<Greeting />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="pitched" element={<PitchedScene />} />
          <Route path="isocahedron" element={<IsocahedronTest />} />
          <Route path="sphere" element={<SphereTest />} />
          <Route path="testpage3" element={<TestPage3 />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
