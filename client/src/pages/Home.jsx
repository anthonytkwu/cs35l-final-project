import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TopBar, ProfileCard, TextInput, Loading, CustomButton } from "../components";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config.js";


const Home = () => {
    const { user } = useSelector((state) => state.user);
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draw_time, setDrawingTime] = useState(60);
    const [desc_time, setWritingTime] = useState(30);
    const [output, setOutput] = useState('');
    const [showForm, setShowForm] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: errorsCreate },
        reset: resetCreate,
    } = useForm({ mode: "onChange" });

    const {
        register: registerJoin,
        handleSubmit: handleSubmitJoin,
        formState: { errors: errorsJoin },
        reset: resetJoin,
    } = useForm({ mode: "onChange" });

    function createLobbyCall(event) {
        event.preventDefault();
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
            const game_code = data.game_code;
            setIsSubmitting(true);
            setIsSubmitting(false);
            navigate(`/game-lobby`, {state: {gameId: game_code}});
            resetCreate();
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            setErrMsg({ message: 'There was a problem creating the lobby', status: 'failed' });
          });
      }
      

    const onCreateLobby = async (data) => {

    };

    const onJoinLobby = async (data) => {
        setIsSubmitting(true);
        // Simulate API call to join a lobby
        // Example: const exists = await api.joinLobby(data.lobbyCode);
        console.log("Joining lobby with code:", data.joinLobbyCode);

        setIsSubmitting(false);
        if (true /* Replace with actual check from API response */) {
            navigate(`/game-lobby`);
            {/* Same thing here. use 'game-lobby' for now */}
            //navigate(`/game-lobby/${data.joinLobbyCode}`);
        } else {
            setErrMsg({ message: "Lobby does not exist", status: "failed" });
        }
        resetJoin();
    };

    return (
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden'>
            <TopBar />

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                {/* LEFT */}
                <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                    <ProfileCard user={user} />
                </div>

                {/* CENTER */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
                    <div className='w-full flex gap-2 items-center mb-1 justify-center'>
                        <span className='colored-subtitle-text'>
                            Create New Lobby
                        </span> 
                    </div>
                    {/* Create Lobby Form */}
                    <form className='lobby-input-style' onSubmit={createLobbyCall}>
                        <TextInput
                            name='createLobbyCode'
                            placeholder='123456'
                            label='Enter Six Digit Code'
                            type='text'
                            register={registerCreate("createLobbyCode", {
                                required: "Lobby code is required",
                                minLength: {
                                    value: 6,
                                    message: "Lobby code must be 6 digits"
                                },
                                 maxLength: {
                                     value: 6,
                                     message: "Lobby code must be 6 digits"
                                 }
                            })}
                            styles='w-full rounded-full'
                            error={errorsCreate.createLobbyCode ? errorsCreate.createLobbyCode.message : ""}/>

                        {isSubmitting ? <Loading /> : <CustomButton
                                    type='submit'
                                    containerStyles={'colored-button-style'}
                                    title='Create'/>
                        }
                    </form>

                    <div className='w-full flex gap-2 items-center mb-1 justify-center'>
                        <span className='colored-subtitle-text'>
                            Join Existing Lobby
                        </span> 
                    </div>

                    {/* Join Lobby Form */}
                    <form className='lobby-input-style' onSubmit={handleSubmitJoin(onJoinLobby)}>
                        <TextInput
                            name='joinLobbyCode'
                            placeholder='123456'
                            label='Enter Six Digit Code'
                            type='text'
                            register={registerJoin("joinLobbyCode", {
                                required: "Lobby code is required",
                                minLength: {
                                    value: 6,
                                    message: "Lobby code must be 6 digits"
                                },
                                maxLength: {
                                    value: 6,
                                    message: "Lobby code must be 6 digits"
                                }
                            })}
                            styles='w-full rounded-full'
                            error={errorsJoin.joinLobbyCode ? errorsJoin.joinLobbyCode.message : ""}/>

                        {isSubmitting ? <Loading /> : <CustomButton
                            type='submit'
                            containerStyles={'colored-button-style'}
                            title='Join'/>
                        }
                        {errMsg && <span className="text-red-500">{errMsg.message}</span>}
                    </form>
                </div>

            </div>
            
            {/* RIGHT */}
        </div>
    );
};

export default Home;