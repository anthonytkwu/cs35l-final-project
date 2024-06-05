import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { TextInput, TopBar2 } from "../components";

const StartingPromptRound = (gameData) => {
    const location = useLocation();
    const {gameId} = location.state || {};
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [countdown, setCountdown] = useState(5); // Initialize countdown (5 seconds)

    console.log(gameData);

    const handleInputChange = (e) => {
        setDescription(e.target.value);
    };

    const handleButtonClick = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer); // Stop the interval when countdown is 0
                    //navigate('/drawing-round'); // Navigate when countdown is finished
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
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden flex flex-col justify-center items-center'>
            <TopBar2 />
            <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
                <span className='colored-subtitle-text pr-2'>Type in a prompt:</span>
            </div>

            <div className='flex items-center mb-[1%] mt-[5%] gap-3'>
                <TextInput
                    placeholder='...a dog eating a banana'
                    type='text'
                    value={description}
                    styles="w-[400px] rounded-full"
                    onChange={handleInputChange}
                    disabled={!isEditing}/>
                
                <button className='colored-button-style mt-2.5' onClick={handleButtonClick}>
                    {isEditing ? 'Ready!' : 'Not Ready'}
                </button>
            </div>

            <div className='w-full h-1/3 flex flex-row gap-2 mb-1 justify-center'>
                <span className='text-normal text-ascent-1 '>
                    {countdown} second(s) left before round ends
                </span>
            </div>
        </div>
    );
}


export default StartingPromptRound;