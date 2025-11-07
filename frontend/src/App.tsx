import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import Register from "./components/Register"
import { Login } from "./components/Login"
import { NotFound } from './components/NotFound'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={
              <ProtectedRoute>
                {/*<Home />*/}
                <h1>Home Page</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/register" element={ <RegisterAndLogout />}/>
          <Route path="*" element={ <NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App