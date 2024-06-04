import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    const [apiUrl, setApiUrl] = useState("")

    function handleSubmit(event) {
            console.log("blah");
        }

    const handleLeaveLobby = () => {
        navigate('/home');
    };

    const handleStartGame = () => {
        handleSubmit()
        navigate('/starting-prompt-round');
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
                </div>

                {/* CENTER */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex '>
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