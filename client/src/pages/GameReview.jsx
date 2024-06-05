import React, { useState, useEffect } from "react";
import { TopBar2, UserCard} from '../components';
import { getGameInformation } from "../api";

const GameReview = () => {
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [players, setPlayers] = useState([]);

    const PlayerList = ({ players }) => {
        return (
            <div className='player-list-container-style bg-[rgb(var(--color-grey))]'>
                {/* Map over the players array and render each player */}
                {players.map((player, index) => (
                    <div key={index}>
                        <UserCard _username={player}/>
                    </div>
                ))}
            </div>
        );
    };

    async function fetchData() {
        try {
            console.log("Fetching game information...");
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
            <div><TopBar2/></div>
            <div className='flex flex-row gap-[10px] justify-center m-[2%]'>
                <div className='w-1/5 h-[75vh] rounded-[5vh] bg-[rgb(var(--color-grey))]'>
                    <PlayerList players={players} />
                </div>
                <div className='w-2/5 h-[75vh] rounded-[5vh] bg-[rgb(var(--color-grey))]'>

                </div>
            </div>
        </div>
    );
}

export default GameReview;