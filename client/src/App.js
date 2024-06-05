import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Home, 
  Login, 
  Register, 
  TimerComponent, 
  GameLobby, 
  StartingPromptRound, 
  DrawingRound, 
  DescriptionRound, 
  GameReview, 
  GameSettings
} from "./pages";
import { WebSocketProvider } from './WebSocketContext'; // Import the WebSocket provider

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
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/timer-component' element={<TimerComponent />} />
          <Route path='/game-lobby' element={<GameLobby />} />
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/starting-prompt-round' element={<StartingPromptRound />} />
          <Route path='/drawing-round' element={<DrawingRound />} />
          <Route path='/description-round' element={<DescriptionRound />} />
          <Route path='/game-review' element={<GameReview />} />
          <Route path='/game-settings' element={<GameSettings />} />
        </Routes>
      </WebSocketProvider>
    </div>
  );
}

export default App;
