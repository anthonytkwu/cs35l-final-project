import React, { useState, useEffect } from 'react';
import { TextInput, TopBar2 } from '../components';
import { getGameInformation } from "../api";
import exampleDrawing from "../assets/temp/example-drawing.png";

const DescriptionRound = () => {
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [countdown, setCountdown] = useState(null); // Initialize countdown

    const handleInputChange = (e) => {
        setDescription(e.target.value);
    };

    const handleButtonClick = () => {
        setIsEditing(!isEditing);
    };

    async function fetchData() {
        try {
            console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            setGameInfo(data); // Set gameInfo state variable with fetched data
            setCountdown(parseInt(data.desc_time));
            console.log(data);
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (countdown !== null) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);
                        // Handle end of drawing round here, e.g., navigate to another page or show a message
                        console.log("Drawing round ended");
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        }
    }, [countdown])

    return (
        <div className="flex flex-col justify-start bg-bgColor">
            <div><TopBar2 /></div>
            {/* Display the game code at the top */}
            <div className='w-full flex justify-center p-5'>
                <span className='text-4xl font-bold text-ascent-1'> Game ID: {localStorage.getItem('game_code')}</span>
            </div>
            <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
                <span className='colored-subtitle-text pr-2'>Now it's your turn to describe the scene:</span>
            </div>
            <div className='flex flex-col items-center'>
                <div className='w-[900px] h-[400px] flex m-4'>
                    <img src={exampleDrawing} alt='exampleDrawing' />
                </div>
                <div className='flex items-center mb-[1%] gap-3'>
                    <TextInput
                        placeholder='...an elephant eating a pineapple'
                        type='text'
                        value={description}
                        styles="w-[400px] rounded-full"
                        onChange={handleInputChange}
                        disabled={!isEditing} />

                    <button className='colored-button-style mt-2.5' onClick={handleButtonClick}>
                        {isEditing ? 'DONE!' : 'EDIT'}
                    </button>
                </div>
                <div className='w-full flex justify-center p-5'>
                    <span className='text-normal text-ascent-1'>
                        {countdown} second(s) left before round ends
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DescriptionRound;