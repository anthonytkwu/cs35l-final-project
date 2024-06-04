import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, NotFound, Register, TimerComponent, GameLobby, StartingPromptRound } from "./pages";
import DrawingRound from "./pages/DrawingRound";
//import ProtectedRoute from "./components/ProtectedRoute"

// function Logout() {
//   localStorage.clear()
//   return <Navigate to="/login" />
// }

// function RegisterAndLogout() {
//   localStorage.clear()
//   return <Register /> 
// }

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
        <Routes>
          {/* <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/profile/:id?' element={<Profile />} />
          </Route> */}

          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/timer-component' element={<TimerComponent />} />
          <Route path='/game-lobby' element={<GameLobby />} />
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home /> } />
          <Route path='starting-prompt-round' element={<StartingPromptRound />} />
          <Route path='drawing-round' element={<DrawingRound />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
