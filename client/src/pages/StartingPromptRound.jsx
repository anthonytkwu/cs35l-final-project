import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { getGameInformation, postWaitForGameUpdates, postUserDescription } from "../api";
import { TextInput, TopBar2 } from "../components";

const StartingPromptRound = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [hasResponded, setHasResponded] = useState(false);
    const [countdown, setCountdown] = useState(null); // Initialize countdown

    const isFetching = useRef(false);
    const isMounted = useRef(true);

    async function fetchData() {
        try {
            isFetching.current = true;
            console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            setGameInfo(data); // Set gameInfo state variable with fetched data
            setCountdown(parseInt(data.desc_time));
            isFetching.current = false;
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    async function fetchWait() {
        if (isFetching.current) {
            return; // Prevent multiple simultaneous fetches
        }

        isFetching.current = true;
        console.log("Waiting for game updates...");

        try {
            const data = await postWaitForGameUpdates({});          //call doesnt ever return 
            if (data && isMounted.current) {
                localStorage.setItem('game_code', data.game_code);
                localStorage.setItem('game_data', JSON.stringify(data));

                if (data.round > 0) {
                    for (let element of data.chains) {
                        if (element[localStorage.getItem('current_user')]) {
                            localStorage.setItem('current_user_chain', element[localStorage.getItem('current_user')]);
                        }
                    }
                    navigate('/drawing-round');
                }
                // Delay the next fetch call by 5 seconds
                setTimeout(fetchWait, 0);
            } else {
                throw new Error(data.message || "Failed to wait for game updates");
            }
        } catch (error) {
            console.error("Error waiting for game updates: ", error);
            if (isMounted.current) {
                // Retry after 5 seconds if there's an error
                setTimeout(fetchWait, 2500);
            }
        } finally {
            isFetching.current = false;
        }
    }

    async function postDescription() {
        try {
            console.log("Attempting to upload description");
            await postUserDescription({}, description);
            console.log('Description uploaded: ' + `${localStorage.getItem('current_user')}`);
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    useEffect(() => {
        isMounted.current = true;
        fetchData();
    }, []);

    useEffect(() => {

        if (countdown !== null) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);

                        if (!hasResponded) postDescription();
                        fetchWait();
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        }
    }, [countdown, navigate]); // Run this effect when countdown changes

    const handleInputChange = (e) => {
        setDescription(e.target.value);
    };

    const handleButtonClick = () => {
        setIsEditing(!isEditing);
        setHasResponded(true);
        postDescription();
        fetchWait();
    };

    return (
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden flex flex-col justify-center items-center'>
            <TopBar2 />
            {/* Display the game code at the top */}
            <div className='w-full flex justify-center p-5'>
                <span className='text-4xl font-bold text-ascent-1'> Game ID: {localStorage.getItem('game_code')}</span>
            </div>

            <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
                <span className='colored-subtitle-text pr-2'>Type in a prompt:</span>
            </div>

            <div className='flex items-center mb-[1%] mt-[5%]'>
                <TextInput
                    placeholder='...a dog eating a banana'
                    type='text'
                    value={description}
                    styles="w-[400px] rounded-full"
                    onChange={handleInputChange}
                    disabled={!isEditing} />

                <button className='colored-button-style mt-2.5 w-[200px]' onClick={handleButtonClick}>
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