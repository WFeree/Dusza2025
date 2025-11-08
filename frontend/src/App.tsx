import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import Register from "./components/Register"
import { Login } from "./components/Login"
import { NotFound } from './components/NotFound'
import { Home } from './components/Home'
import GMCardCreation  from "./components/GMCardCreation"

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
                <Home />
                <h1>Home Page</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/register" element={ <RegisterAndLogout />}/>
          <Route path="/card" element={ <GMCardCreation />}/>
          <Route path="*" element={ <NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App