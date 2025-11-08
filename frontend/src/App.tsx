import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import Register from "./components/Register"
import { Login } from "./components/Login"
import { NotFound } from './components/NotFound'
import { Home } from './components/Home'
import GMCardCreation  from "./components/GMCardCreation"
import GMDungeonCreation from "./components/GMDungeonCreation"
import DungeonCardSelector from "./components/DungeonCardSelector"
import GMCardList  from "./components/GMCardList"
import GameEnvironment from './components/GameEnvironment'

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
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/register" element={ <RegisterAndLogout />}/>
          <Route path="/card" element={<ProtectedRoute><GMCardCreation/></ProtectedRoute> }/>
          <Route path="/dungeon" element={ <GMDungeonCreation />}/>
          <Route path="/cardselector" element={ <DungeonCardSelector />}/>
          <Route path="/cardlist" element={ <GMCardList />}/>
          <Route path="/gameenvironment" element={ <GameEnvironment />}/>
          <Route path="*" element={ <NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App