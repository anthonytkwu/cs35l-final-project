import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword, TimerComponent, GameLobby } from "./pages";
import { WebSocketProvider, useWebSocket } from './WebSocketContext'; // Import the WebSocket provider

// function Layout() {
//   const { user } = useSelector((state) => state.user);
//   const location = useLocation();

//   return user?.token ? (
//     <Outlet />
//   ) : (
//     <Navigate to='/login' state={{ from: location }} replace />
//   );
// }

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <WebSocketProvider> {/* Wrap Routes in WebSocketProvider */}
        <Routes>
          {/* <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/profile/:id?' element={<Profile />} />
          </Route> */}

          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/timer-component' element={<TimerComponent />} />
          <Route path='/game-lobby' element={<GameLobby />} />
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </WebSocketProvider>
    </div>
  );
}

export default App;