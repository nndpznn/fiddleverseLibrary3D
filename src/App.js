/**
 * This React app is purely starter boilerplate. Use it to demonstrate your 3D library.
 */
import { NavLink, Route, Routes } from 'react-router-dom'

import './App.css'

import Sandbox from './Sandbox'
import PitchedScene from './PitchedScene'
import MainTest from './testPages/mainTestPage'
import TestPage3 from './testPages/testpage3'
import SphereTest from './testPages/spherePage'
import StarTest from './testPages/starPage'

const classNamePicker = ({ isActive }) => (isActive ? 'current' : null)

const Greeting = () => (
  <article>
    <h1>Into the Fiddleverse.</h1>

    <p>
      Welcome to the custom graphics repository of Nolan Nguyen, Dylan Suzuki, JD Elia, and Allen Boyce.
    </p>
  </article>
)

const App = () => {
  return (
    <article className="App">
      <nav>
        {/* <NavLink className={classNamePicker} to="/sandbox">
          Sandbox Scene
        </NavLink> */}

        <NavLink style={{ textDecoration: 'none', color: '#2980d6' }} className={classNamePicker} to="/pitched">
          Pitched Scene
        </NavLink>

        <NavLink style={{ textDecoration: 'none', color: '#2980d6' }} className={classNamePicker} to="/main">
          MAIN TEST
        </NavLink>

        <NavLink style={{ textDecoration: 'none', color: '#2980d6' }} className={classNamePicker} to="/sphere">
          SPHERE TEST
        </NavLink>

        <NavLink style={{ textDecoration: 'none', color: '#2980d6' }} className={classNamePicker} to="/testpage3">
          WING/RANDOM ASTEROID TEST
        </NavLink>

        <NavLink style={{ textDecoration: 'none', color: '#2980d6'}} className={classNamePicker} to="/star">
          STAR TEST
        </NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="" element={<Greeting />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="pitched" element={<PitchedScene />} />
          <Route path="main" element={<MainTest />} />
          <Route path="sphere" element={<SphereTest />} />
          <Route path="testpage3" element={<TestPage3 />} />
          <Route path="star" element={<StarTest />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
