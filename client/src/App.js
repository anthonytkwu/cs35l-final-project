import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Register, TimerComponent, GameLobby, StartingPromptRound, GeneralPromptRound } from "./pages";
import { WebSocketProvider } from './WebSocketContext'; // Import the WebSocket provider
import DrawingRound from "./pages/DrawingRound";

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
          <Route path='/timer-component' element={<TimerComponent />} />
          <Route path='/game-lobby' element={<GameLobby />} />
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='starting-prompt-round' element={<StartingPromptRound />} />
          <Route path='drawing-round' element={<DrawingRound />} />
          <Route path='general-prompt-round' element={<GeneralPromptRound />} />
        </Routes>
      </WebSocketProvider>
    </div>
  );
}

export default App;
