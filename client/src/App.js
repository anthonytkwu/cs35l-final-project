import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Register, CreateLobby, GameLobby, StartingPromptRound, DrawingRound, DescriptionRound, GameReview, SearchHistory } from "./pages";
//import { WebSocketProvider } from './WebSocketContext'; // Import the WebSocket provider

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
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/create-lobby' element={<CreateLobby />} />
        <Route path='/game-lobby' element={<GameLobby />} />
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/starting-prompt-round' element={<StartingPromptRound />} />
        <Route path='/drawing-round' element={<DrawingRound />} />
        <Route path='/description-round' element={<DescriptionRound />} />
        <Route path='/game-review' element={<GameReview />} />
        <Route path='/search-history' element={<SearchHistory />}/>
      </Routes>
    </div>
  );
}

export default App;
