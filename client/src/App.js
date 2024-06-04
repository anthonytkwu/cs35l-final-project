import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Register, ProtectedRoute, TimerComponent, GameLobby, StartingPromptRound } from "./pages";
import DrawingRound from "./pages/DrawingRound";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
        <Routes>
          <Route path='/register' element={<RegisterAndLogout />} />
          <Route path='/login' element={<Login />} />
          <Route path='/timer-component' element={<TimerComponent />} />
          <Route path='/game-lobby' element={<GameLobby />} />
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='starting-prompt-round' element={<StartingPromptRound />} />
          <Route path='drawing-round' element={<DrawingRound />} />
        </Routes>
    </div>
  );
}

export default App;
