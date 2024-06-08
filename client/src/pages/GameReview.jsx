import React, { useState, useEffect } from "react";
import { TopBar2, CustomButton, UserCard } from "../components";
import { getGameInformation, interceptSVG } from "../api";
import { intercept } from "../hooks/Intercept.js";
import { useNavigate } from "react-router-dom";

const GameReview = () => {
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [userAlbum, setUserAlbum] = useState({});
    const [displayCount, setDisplayCount] = useState(1);
    const PlayerList = ({ players, selectedPlayer, onSelectPlayer }) => {
        return (
            <div className='player-list-container-style bg-[rgb(var(--color-grey))]'>
                {/* Map over the players array and render each player */}
                {players.map((player, index) => (
                    <div 
                        key={index}
                        onClick={() => onSelectPlayer(player)}>
                        <UserCard _username={player} />
                    </div>
                ))}
            </div>
        );
    };

    const addUserAlbum = (username, album) =>{
        setUserAlbum(prevState => ({
            ...prevState,
            [username]: album,
        }));
    };

    // Sample SVGs and strings
    const [svgs, setSvgs] = useState([
        '<svg width="400" height="400"><circle cx="200" cy="200" r="160" stroke="black" strokeWidth="3" fill="red" /></svg>',
        '<svg width="400" height="400"><rect width="400" height="400" style="fill:blue;stroke-width:3;stroke:black" /></svg>',
        '<svg width="400" height="400"><circle cx="200" cy="200" r="160" stroke="black" strokeWidth="3" fill="red" /></svg>',
        '<svg width="400" height="400"><rect width="400" height="400" style="fill:blue;stroke-width:3;stroke:black" /></svg>',
        '<svg width="400" height="400"><circle cx="200" cy="200" r="160" stroke="black" strokeWidth="3" fill="red" /></svg>',
        '<svg width="400" height="400"><rect width="400" height="400" style="fill:blue;stroke-width:3;stroke:black" /></svg>',
        '<svg width="400" height="400"><circle cx="200" cy="200" r="160" stroke="black" strokeWidth="3" fill="red" /></svg>',
        '<svg width="400" height="400"><rect width="400" height="400" style="fill:blue;stroke-width:3;stroke:black" /></svg>',
        '<svg width="400" height="400"><circle cx="200" cy="200" r="160" stroke="black" strokeWidth="3" fill="red" /></svg>',
        '<svg width="400" height="400"><rect width="400" height="400" style="fill:blue;stroke-width:3;stroke:black" /></svg>',

    ]);
    const [stringss, setStrings] = useState([
        'This is a red circle.',
        'This is a blue square.',
    ]);

    // Combine the arrays in the desired order
    const combinedArray = [];
    for (let i = 0; i < Math.max(svgs.length, stringss.length); i++) {
        if (i < stringss.length) combinedArray.push({ type: 'string', content: stringss[i] });
        if (i < svgs.length) combinedArray.push({ type: 'svg', content: svgs[i] });
    }

    

    const handleForward = () => {
        if (selectedPlayer == null) return;
        if (displayCount < userAlbum[selectedPlayer].length) {
            setDisplayCount(displayCount + 1);
        }
    };

    const handleBackward = () => {
        if (displayCount > 0) {
            setDisplayCount(displayCount - 1);
        }
    };

    function goToHome() {
        navigate(`/home`);
    }

    const handleSelectPlayer = (player) => {
        setSelectedPlayer(player);
        setDisplayCount(1);
    };

    async function getDescription(gameChain, roundNumber, navigate) {

        const gameCode = localStorage.getItem('game_code');
        const url = `/api/session/${gameCode}/${roundNumber}/${gameChain}/getDesc/`

        try{
            const data = await intercept(url, 'GET', null, navigate);
            return data.description;
        } catch(error){
            console.error('Error occurred', error);
                return null;
        }
    }

    async function getImage (gameChain, roundNumber) {
        const gameCode = localStorage.getItem('game_code');
        const url = `/api/session/${gameCode}/${roundNumber}/${gameChain}/getDraw/`;
        
        try {
            const response = await intercept(url, 'GET', null, navigate);
            const svgResponse = await interceptSVG(`${response.drawing}/`, 'GET', null, navigate);
            //setImg(`data:image/svg+xml;base64,${btoa(svgResponse)}`);  
            return svgResponse;
        } catch (error) {
            console.error('Error occurred while fetching image:', error);
        }
    };

    async function fetchData() {
        try {
            console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            console.log(data);

            setGameInfo(data); // Set gameInfo state variable with fetched data
            setPlayers(data.users);
            console.log(data.users[0]);
            setSelectedPlayer(data.users[0]);

            for (let i = 0;i<data.users.length;i++){
                await compileUserData(data, data.users[i]);
            }

            console.log("Selected player: " + selectedPlayer + " userAlbum " + userAlbum[selectedPlayer] + " isArray: " + Array.isArray(userAlbum[selectedPlayer]));
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    function getUserChain(gameData, user){
        const keys = Object.keys(gameData.chains);

        for (let i = 0;i < keys.length; i++){
            if (gameData.chains[keys[i]][0] == user){
                return keys[i];
            }
        }
    }

    async function compileUserData(gameData, user){
        const userChain = getUserChain(gameData, user);
        let localAlbum = [];

        if (userChain == undefined){
            throw new Error("Could not find user chain value");
        }else{
            for (let round = 0; round < gameData.users.length; round++){
                if (round % 2 == 0){
                    let descResponse = await getDescription(userChain, round, navigate);
                    localAlbum.push({ type: 'string', content: descResponse });
                }else{
                    let svgResponse = await getImage(userChain, round);
                    
                    localAlbum.push({ type: 'svg', content: `data:image/svg+xml;base64,${btoa(svgResponse)}` });
                }
            }
        }
        addUserAlbum(user, localAlbum);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col justify-start bg-bgColor">
            <div><TopBar2 /></div>
            <div className='flex flex-row gap-[10px] justify-center m-[2%]'>
                <div className='w-1/5 h-[75vh] rounded-[5vh] bg-[rgb(var(--color-grey))] cursor-pointer'>
                    <PlayerList 
                        players={players} 
                        selectedPlayer={selectedPlayer} 
                        onSelectPlayer={handleSelectPlayer} />
                </div>
                <div className='w-2/5 h-[75vh] rounded-[5vh] bg-[rgb(var(--color-grey))] p-3 overflow-y-auto'>
                    {selectedPlayer && userAlbum[selectedPlayer] && Array.isArray(userAlbum[selectedPlayer]) ? (
                        userAlbum[selectedPlayer].slice(0, displayCount).map((item, index) => (
                            <div key={index}>
                                {item && item.type === 'string' ? (
                                    <div className="review-text-style text-[rgb(var(--color-ascent1))] bg-bgColor">{item.content}</div>
                                ) : item && item.type === 'svg' ? (
                                    <div className="review-image-style bg-[rgb(var(--color-white))]"> <img src={item.content} alt="drawing"/> </div>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <div className="mt-5 ml-5 text-[rgb(var(--color-ascent1))]">No data available</div>
                    )}
                </div>
            </div>
            <div className="flex flex-row justify-center gap-[10px] pb-4">
                <CustomButton
                        onClick={goToHome}
                        containerStyles={'colored-button-style w-[170px]'}
                        title='Back to home' />
                <CustomButton
                    onClick={handleBackward}
                    containerStyles={'colored-button-style w-[170px]'}
                    title='Previous' />
                <CustomButton
                    onClick={handleForward}
                    containerStyles={'colored-button-style w-[170px]'}
                    title='Next' />
            </div>
        </div>
    );
}

export default GameReview;