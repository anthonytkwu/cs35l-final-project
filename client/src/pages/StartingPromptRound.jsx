import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TextInput, TopBar2 } from "../components";

const StartingPromptRound = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(15); // Initialize countdown (5 seconds)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer); // Stop the interval when countdown is 0
                    navigate('/game-lobby'); // Navigate when countdown is finished
                    return 0;
                }
                return prevCountdown - 1; // Decrement the countdown by 1
            });
        }, 1000); // Update every second

        return () => clearInterval(timer); // Cleanup the interval on component unmount
    }, [navigate]);

    const [isReady, setIsReady] = useState(false);    // Tracks whether the player is ready

    const toggleReady = () => {
        setIsReady(!isReady);               // Toggle readiness state
        if (!isReady) {
            // Perform server communication here, signaling the player is ready
            console.log('Player is ready!');  // Placeholder for server interaction
        } else {
            // Optionally handle the case when the player toggles off ready
            console.log('Player is not ready!');
        }
    };


    return (
        <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
            <TopBar2 />

            <div className='w-full h-1/3 flex flex-row gap-2 mb-1 justify-center'>
                <span className='text-2xl text-[#065ad8] font-semibold '>
                    {countdown} second(s) left before round ends
                </span>
            </div>

            <div className='w-full flex flex-row gap-2 mb-1 justify-center'>
                <span className='text-2xl text-[#065ad8] font-semibold '>
                    Type in a prompt
                </span>
            </div>

            <form className='pb-20 flex flex-col gap-5' >
                <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
                    <TextInput
                        name='Prompt'
                        placeholder='A dog is eating a banana.'
                        label='Sentence'
                        type='text'
                        styles='w-full'
                        disabled={isReady}
                    />
                </div>
            </form>

            <div>
                <button
                    className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'
                    onClick={toggleReady}
                    style={{
                        backgroundColor: isReady ? 'green' : 'red', // Conditional styling
                        color: 'white'
                    }}
                >
                    {isReady ? 'Ready' : 'Not Ready'}
                </button>
            </div>

        </div>
    );
}


export default StartingPromptRound;