import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, TopBar2 } from '../components';
import { getGameInformation, postWaitForGameUpdates, interceptSVG, postUserDescription } from "../api";
import { intercept } from "../hooks/Intercept.js";

const DescriptionRound = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [countdown, setCountdown] = useState(null); // Initialize countdown
    const [img, setImg] = useState("");
    const isFetching = useRef(false);
    const isMounted = useRef(true);
    const [hasResponded, setHasResponded] = useState(false);
    const descriptionPosted = useRef(false);

    const handleInputChange = (e) => {
        setDescription(e.target.value);
    };

    const handleButtonClick = () => {
        console.log("Button clicked. hasResponded:", hasResponded);
        if (!descriptionPosted.current) {
          setIsEditing(false);
          postDescription();
        } else {
          console.log("Button click ignored because already responded");
        }
      };

    const postDescription = async () => {
        if (descriptionPosted.current) {
          console.log("Skipping postDescription because already responded");
          return;
        }
    
        try {
          descriptionPosted.current = true;
          console.log("Attempting to upload description:", description);
          await postUserDescription({}, description);
          console.log("Description uploaded:", description, "User:", localStorage.getItem("current_user"));
          setHasResponded(true);
          fetchWait();
        } catch (error) {
          console.error("Error uploading description:", error);
          setErrMsg({ message: error.message, status: "failed" });
        }
      };

    async function fetchData() {
        try {
            console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            setGameInfo(data); // Set gameInfo state variable with fetched data
            setCountdown(parseInt(data.desc_time));
            getImage(data);
            console.log(data);
            fetchWait();
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    const fetchWait = async () => {
        if (isFetching.current || !isMounted.current) return;
        isFetching.current = true;

        try {
            const data = await postWaitForGameUpdates({});
            if (data && isMounted.current) {
                localStorage.setItem("game_data", JSON.stringify(data));
                if (data.round > localStorage.getItem('current_round')) {
                    localStorage.setItem('current_round', data.round);
                    navigate("/drawing-round");
                }
                if (isMounted.current) {
                    setTimeout(fetchWait, 500); // Only set timeout if still mounted
                }
            }
        } catch (error) {
            if (isMounted.current) {
                console.error("Error waiting for game updates:", error);
                setTimeout(fetchWait, 500);
            }
        } finally {
            isFetching.current = false;
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchData();
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (countdown !== null) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);
                        // Handle end of drawing round here, e.g., navigate to another page or show a message
                        console.log("Description round ended");
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        }
    }, [countdown]);

    const getImage = async (gameData) => {
        const username = localStorage.getItem('current_user');
        const url = `/api/session/${gameData.game_code}/${gameData.round - 1}/${gameData.chains[username]}/getDraw/`;
        
        try {
            const response = await intercept(url, 'GET', null, navigate);
            const svgResponse = await interceptSVG(`${response.drawing}/`, 'GET', null, navigate);
            setImg(`data:image/svg+xml;base64,${btoa(svgResponse)}`);  
        } catch (error) {
            console.error('Error occurred while fetching image:', error);
        }
    };

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
                <div className='w-[900px] h-[400px] flex m-4 bg-white'>
                    <img src={img} alt='Drawing'/>
                </div>
                <div className='flex items-center mb-[1%] gap-3'>
                    <TextInput
                        placeholder='...an elephant eating a pineapple'
                        type='text'
                        value={description}
                        styles="w-[400px] rounded-full"
                        onChange={(e) => setDescription(e.target.value)}

                        disabled={!isEditing} />

                    {isEditing && 
                        <button className='colored-button-style mt-2.5' onClick={handleButtonClick}>SUBMIT</button>}
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
