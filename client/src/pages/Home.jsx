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

    function createLobbyCall() {
        navigate(`/create-lobby`);
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
        <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
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