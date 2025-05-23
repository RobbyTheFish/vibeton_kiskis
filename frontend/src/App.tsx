import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Game from './pages/Game'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-player" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/:gameId" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App 