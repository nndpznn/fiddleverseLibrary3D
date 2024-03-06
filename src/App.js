/**
 * This React app is purely starter boilerplate. Use it to demonstrate your 3D library.
 */
import { NavLink, Route, Routes } from 'react-router-dom'

import './App.css'

import Sandbox from './Sandbox'
import PitchedScene from './PitchedScene'

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
      </nav>

      <main>
        <Routes>
          <Route path="" element={<Greeting />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="pitched" element={<PitchedScene />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
