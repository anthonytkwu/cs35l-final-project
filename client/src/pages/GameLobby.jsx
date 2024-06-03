import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../WebSocketContext';
import { useForm } from "react-hook-form";
import { TopBar2, TextInput, Loading, CustomButton } from "../components";

//import { useDispatch } from "react-redux";


const GameLobby = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(true);
    const [drawingTime, setDrawingTime] = useState(60);
    const [writingTime, setWritingTime] = useState(30);
    const ws = useWebSocket();

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'update-players':
                        setPlayers(data.players);
                        break;
                    case 'update-host':
                        setIsHost(user.id === data.hostId);
                        break;
                    case 'start-game':
                        navigate('/game');
                        break;
                }
            };

            // Send a message when the component mounts
            ws.send(JSON.stringify({ type: 'join-lobby', userId: user.id }));
        }

        return () => {
            ws.send(JSON.stringify({ type: 'leave-lobby', userId: user.id }));
        };
    }, [ws, user.id, navigate]);

    const handleLeaveLobby = () => {
        ws.send(JSON.stringify({ type: 'leave-lobby', userId: user.id }));
        navigate('/home');
    };

    const handleStartGame = () => {
        if (isHost) {
            ws.send(JSON.stringify({ type: 'start-game' }));
        }
        navigate('/home');
    };

    return (
        <div className='game-lobby w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
            <TopBar2 />

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                {/* LEFT */}
                <div className='player-list hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                    <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 '>
                        <div className='w-full flex items-center justify-between border-b pb-5 border-[#66666645]'>
                            {players.map((player, index) => (
                                <div key={player.id} className={player.id === user.id ? 'host' : ''}>
                                    {player.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* {players.map((player, index) => (
                        <div key={player.id} className={player.id === user.id ? 'host' : ''}>
                            {player.name}
                        </div>
                    ))} */}
                </div>

                {/* CENTER */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex '>
                    {/* <div className='w-full flex gap-2 items-center mb-1 justify-center '>
                        <span className='text-2xl text-[#065ad8] font-semibold '>
                            Create New Lobby
                        </span>
                    </div> */}

                    <div className='settings w-full flex flex-col gap-2 items-center mb-1 justify-center '>
                        {isHost && (
                            <>

                                <div className='w-full flex gap-2 items-center mb-1 justify-center '>
                                    <span className='text-2xl text-[#065ad8] font-semibold '>
                                        Choose Length of Drawing Round
                                    </span>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-10 justify-center '>
                                    <select value={drawingTime} onChange={e => setDrawingTime(e.target.value)}>
                                        <option value={30}>30s</option>
                                        <option value={60}>60s</option>
                                        <option value={90}>90s</option>
                                    </select>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-1 justify-center '>
                                    <span className='text-2xl text-[#065ad8] font-semibold '>
                                        Choose Length of Prompt Round
                                    </span>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-10 justify-center '>
                                    <select value={writingTime} onChange={e => setWritingTime(e.target.value)}>
                                        <option value={15}>15s</option>
                                        <option value={30}>30s</option>
                                        <option value={45}>45s</option>
                                    </select>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-5 justify-center '>
                                    <CustomButton
                                        onClick={handleStartGame}
                                        containerStyles={'inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none'}
                                        title='Start Game'
                                    />
                                </div>

                                <CustomButton
                                    onClick={handleLeaveLobby}
                                    containerStyles={'inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none'}
                                    title='Leave Lobby'
                                />
                            </>
                        )}
                        {!isHost && (
                            <div>
                                Drawing Time: {drawingTime}s, Writing Time: {writingTime}s
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameLobby;

// import React, { useEffect } from 'react';
// import { useWebSocket } from '../WebSocketContext';

// function GameLobby() {
//     const ws = useWebSocket();

//     useEffect(() => {
//         if (ws) {
//             ws.onmessage = (event) => {
//                 console.log("Message from server ", event.data);
//             };

//             // Example send message
//             ws.send(JSON.stringify({ message: "Hello from Home!" }));
//         }
//     }, [ws]);

//     return (
//         <div>
//             <h1>Home Page</h1>
//             {/* Render data received via WebSocket here */}
//         </div>
//     );
// }

// export default GameLobby;