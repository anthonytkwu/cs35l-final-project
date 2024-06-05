import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../WebSocketContext';
import { useForm } from "react-hook-form";
import { TopBar2, TextInput, Loading, CustomButton } from "../components";
import { apiUrl } from "../config.js";


const CreateLobby = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(true);
    const [output, setOutput] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [draw_time, setDrawingTime] = useState(60);
    const [desc_time, setWritingTime] = useState(30);
    const ws = useWebSocket();

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: errorsCreate },
        reset: resetCreate,
    } = useForm({ mode: "onChange" });


    function createLobbyCall() {
        const access = localStorage.getItem('access');
      
        if (!access) {
          setErrMsg({ message: 'Authentication token is missing', status: 'failed' });
          return;
        }
      
        setShowForm(false);
        setOutput('created with draw time: ' + draw_time + ' and desc time: ' + desc_time);
      
        const data = {
          desc_time: desc_time,
          draw_time: draw_time,
        };
      
        fetch(`${apiUrl}/api/session/create/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return response.text().then((text) => {
              console.error('Response text:', text);
              throw new Error(text);
            });
          })
          .then((data) => {
            console.log(data);
            setIsSubmitting(true);
            setIsSubmitting(false);
            navigate(`/game-lobby`);
            resetCreate();
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            setErrMsg({ message: 'There was a problem creating the lobby', status: 'failed' });
          });
      }

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
        createLobbyCall()
        //navigate('/starting-prompt-round');
        //navigate('/game-lobby');
    };

    return (
        <div className='game-lobby w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
            <TopBar2 />

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                {/* LEFT */}
                <div className='player-list hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                    {/* <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 '>
                        <div className='w-full flex items-center justify-between border-b pb-5 border-[#66666645]'>
                            {players.map((player, index) => (
                                <div key={player.id} className={player.id === user.id ? 'host' : ''}>
                                    {player.name}
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>

                {/* CENTER */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex '>
                    <div className='settings w-full flex flex-col gap-2 items-center mb-1 justify-center '>
                        {isHost && (
                            <>
                                <div className='w-full flex gap-2 items-center mb-1 justify-center '>
                                    <span className='colored-subtitle-text'>
                                        Choose Length of Drawing Round
                                    </span>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-10 justify-center '>
                                    <select value={draw_time} onChange={e => setDrawingTime(e.target.value)}>
                                        <option value={30}>30s</option>
                                        <option value={45}>45s</option>
                                        <option value={60}>60s</option>
                                    </select>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-1 justify-center '>
                                    <span className='colored-subtitle-text'>
                                        Choose Length of Prompt Round
                                    </span>
                                </div>

                                <div className='w-full flex gap-2 items-center mb-10 justify-center '>
                                    <select value={desc_time} onChange={e => setWritingTime(e.target.value)}>
                                        <option value={15}>15s</option>
                                        <option value={30}>30s</option>
                                        <option value={45}>45s</option>
                                    </select>
                                </div>
                                
                                <CustomButton
                                        onClick={handleStartGame}
                                        containerStyles={'colored-button-style'}
                                        title='Confirm Settings'/>
                                <CustomButton
                                    onClick={handleLeaveLobby}
                                    containerStyles={'colored-button-style'}
                                    title='Return Home'/>
                            </>
                        )}
                        {!isHost && (
                            <div>
                                Drawing Time: {draw_time}s, Writing Time: {desc_time}s
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLobby;