import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameInformation, postWaitForGameUpdates } from "../api";
import { TopBar2, CustomButton, TextInput, } from "../components";
import { apiUrl } from "../config.js";

const SearchHistory = () => {

    const navigate = useNavigate();
    const [gameID, setGameID] = useState("");

    function backToHome() {
        navigate(`/home`);
    }

    return (
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden'>
            <TopBar2 />

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                {/* LEFT */}
                <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                    <div className='flex items-center justify-center'>
                        <form className='lobby-input-style'>

                        </form>
                    </div>
                </div>

                {/* CENTER */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
                    <div className='w-full flex gap-2 items-center mb-1 justify-center'>
                        <span className='colored-subtitle-text'>
                            Search Old Game
                        </span>
                    </div>

                    {/* Join Lobby Form */}
                    <form className='lobby-input-style' >
                        <TextInput
                            name='joinLobbyCode'
                            placeholder='123456'
                            label='Enter Six Digit Code'
                            type='text'
                            styles='w-full rounded-full'
                        />

                        <CustomButton
                            type='submit'
                            containerStyles={'colored-button-style'}
                            title='Join' />
                    </form>

                    <CustomButton
                            onClick={backToHome}
                            containerStyles={'colored-button-style'}
                            title='Return Home' />
                </div>

            </div>

        </div>
    )
}

export default SearchHistory