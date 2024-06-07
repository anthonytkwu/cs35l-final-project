import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TopBar, ProfileCard, TextInput, Loading, CustomButton, UserCard } from "../components";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config.js";
import { handleGameDataAndNavigate } from '../utils'; // Import the utility function
import { intercept } from "../hooks/Intercept.js";

const Home = () => {
    //const { user } = useSelector((state) => state.user);
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState('');
    const [showForm, setShowForm] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = localStorage.getItem('current_user');

    const {
        register: registerJoin,
        handleSubmit: handleSubmitJoin,
        formState: { errors: errorsJoin },
        reset: resetJoin,
    } = useForm({ mode: "onChange" });

    function createLobbyCall() {
        navigate(`/create-lobby`);
    }

    function goToHistory() {
        navigate(`/search-history`);
    }

    const onJoinLobby = async (data) => {
        console.log("Attempting to join game...");

        const access = localStorage.getItem('access');
        if (!access) {
            setErrMsg({ message: 'Authentication token is missing', status: 'failed' });
            return;
        }

        setShowForm(false);
        setOutput('joining game');

        const gameData = {
            game_id: data.joinLobbyCode, // Using the game_id from the form directly
        };


        intercept(`/api/session/${gameData.game_id}/join/`, 'GET', null, navigate)
        .then((data) => {
            console.log(data);
            handleGameDataAndNavigate(data, navigate);
            setIsSubmitting(true);
            setIsSubmitting(false);
            resetJoin();
        })
        .catch((error) => {
            console.error('Error occurred:', error);
        });

    };

    return (
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden'>
            <TopBar />

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                {/* LEFT */}
                <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                    {/* <ProfileCard user={user} /> */}
                    {/* <UserCard _username={currentUser} /> */}
                    
                    <div className='flex flex-col items-center justify-center'>
                        <UserCard _username={currentUser} />
                        <form className='lobby-input-style' onSubmit={goToHistory}>
                            <CustomButton
                                type='submit'
                                containerStyles={'colored-button-style'}
                                title='Search Game History' />
                        </form>
                    </div>
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
                        <CustomButton
                            type='submit'
                            containerStyles={'colored-button-style'}
                            title='Create' />
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
                            error={errorsJoin.joinLobbyCode ? errorsJoin.joinLobbyCode.message : ""} />

                        {isSubmitting ? <Loading /> : <CustomButton
                            type='submit'
                            containerStyles={'colored-button-style'}
                            title='Join' />
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