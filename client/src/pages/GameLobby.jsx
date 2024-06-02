import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../WebSocketContext';

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
                switch(data.type) {
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
        navigate('/');
    };

    const handleStartGame = () => {
        if (isHost) {
            ws.send(JSON.stringify({ type: 'start-game' }));
        }
    };

    return (
        <div className="game-lobby">
            <div className="player-list">
                {players.map((player, index) => (
                    <div key={player.id} className={player.id === user.id ? 'host' : ''}>
                        {player.name}
                    </div>
                ))}
            </div>
            <button onClick={handleLeaveLobby} className="leave-button">Leave Lobby</button>
            <div className="settings">
                {isHost && (
                    <>
                        <select value={drawingTime} onChange={e => setDrawingTime(e.target.value)}>
                            <option value={30}>30s</option>
                            <option value={60}>60s</option>
                            <option value={90}>90s</option>
                        </select>
                        <select value={writingTime} onChange={e => setWritingTime(e.target.value)}>
                            <option value={15}>15s</option>
                            <option value={30}>30s</option>
                            <option value={45}>45s</option>
                        </select>
                        <button onClick={handleStartGame}>Start Game</button>
                    </>
                )}
                {!isHost && (
                    <div>
                        Drawing Time: {drawingTime}s, Writing Time: {writingTime}s
                    </div>
                )}
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