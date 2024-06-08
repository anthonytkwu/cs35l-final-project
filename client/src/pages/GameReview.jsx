import React, { useState, useEffect } from "react";
import { TopBar2, CustomButton, UserCard } from "../components";
import { getGameInformation } from "../api";
import { useNavigate } from "react-router-dom";

const GameReview = () => {
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const PlayerList = ({ players }) => {
        return (
            <div className='player-list-container-style bg-[rgb(var(--color-grey))]'>
                {/* Map over the players array and render each player */}
                {players.map((player, index) => (
                    <div key={index}>
                        <UserCard _username={player} />
                    </div>
                ))}
            </div>
        );
    };

    function goToHome() {
        navigate(`/home`);
    }

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
    const [strings, setStrings] = useState([
        'This is a red circle.',
        'This is a blue square.',
    ]);

    // Combine the arrays in the desired order
    const combinedArray = [];
    for (let i = 0; i < Math.max(svgs.length, strings.length); i++) {
        if (i < strings.length) combinedArray.push({ type: 'string', content: strings[i] });
        if (i < svgs.length) combinedArray.push({ type: 'svg', content: svgs[i] });
    }

    const [displayCount, setDisplayCount] = useState(0);

    const handleForward = () => {
        if (displayCount < combinedArray.length) {
            setDisplayCount(displayCount + 1);
        }
    };

    const handleBackward = () => {
        if (displayCount > 0) {
            setDisplayCount(displayCount - 1);
        }
    };

    async function fetchData() {
        try {
            // console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            setGameInfo(data); // Set gameInfo state variable with fetched data
            setPlayers(data.users);
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col justify-start h-screen bg-bgColor">
            <div><TopBar2 /></div>
            <div className='flex flex-col gap-[10px] overflow-y-scroll justify-center m-[2%] items-center'>
            <div className='w-full flex gap-2 items-center mb-1 justify-center'>
                        <span className='colored-subtitle-text'>
                            Gallery
                        </span>
                    </div>
                <div className='w-4/5 max-h-3/4 overflow-y-scroll border border-gray-300 p-4 rounded-[5vh] bg-[rgb(var(--color-grey))]'>
                    {combinedArray.slice(0, displayCount).map((item, index) => (
                        <div key={index} className="py-7">
                            {item.type === 'svg' ? (
                                <div
                                    className="flex justify-center mb-2"
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            ) : (
                                <p
                                    className="flex justify-center mb-2"
                                >{item.content}</p>
                            )}
                        </div>
                    ))}
                </div>
                <div
                    className='flex flex-row gap-10'
                >
                    <CustomButton
                        onClick={handleBackward}
                        containerStyles={'colored-button-style w-24 h-12'}
                        title='Previous' />
                    <CustomButton
                        onClick={handleForward}
                        containerStyles={'colored-button-style w-24 h-12'}
                        title='Next' />

                </div>
                <CustomButton
                        onClick={goToHome}
                        containerStyles={'colored-button-style'}
                        title='Back to home' />
            </div>
        </div>
    );
}

export default GameReview;