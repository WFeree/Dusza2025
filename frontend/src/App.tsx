import Register from "./components/Register"
import axios from 'axios'
import React from 'react'
import { Login } from './components/Login'

const App = () => {
  return (
    <>
      <Register/>
      <Login />
    </>
  )
}

export default App