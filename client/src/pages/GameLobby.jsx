import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getGameInformation, postWaitForGameUpdates } from "../api";
import { TopBar2, CustomButton, UserCard } from "../components";
import { apiUrl } from "../config.js";

const GameLobby = () => {
    const navigate = useNavigate();
    const [gameInfo, setGameInfo] = useState(null);
    const [game_code, setGameCode] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const [players, setPlayers] = useState([]);
    const [drawingTime, setDrawingTime] = useState("...");
    const [writingTime, setWritingTime] = useState("...");

    const isMounted = useRef(true);
    const isFetching = useRef(false);

    const PlayerList = ({ players }) => {
        return (
            <div className="player-list-container-style bg-[rgb(var(--color-grey))]">
                {players.map((player, index) => (
                    <div key={index}>
                        <UserCard _username={player} />
                    </div>
                ))}
            </div>
        );
    };

    async function fetchWait() {
        if (isFetching.current) {
            return; // Prevent multiple simultaneous fetches
        }

        isFetching.current = true;
        console.log("Waiting for game updates...");

        try {
            const data = await postWaitForGameUpdates({});
            if (data && isMounted.current) {
                setGameInfo(data);
                setDrawingTime(data.draw_time);
                setWritingTime(data.desc_time);
                setGameCode(data.game_code);
                setPlayers(data.users);
                localStorage.setItem('game_code', data.game_code);
                localStorage.setItem('game_data', JSON.stringify(data))

                if (data.round != -1) {
                    localStorage.setItem('current_user_chain', data.chains[localStorage.getItem('username')]);
                    console.log(localStorage.getItem('current_user_chain'));
                    console.log('Leaving game lobby: ' + `${localStorage.getItem('game_code')}`);
                    navigate('/starting-prompt-round');
                }
                // Delay the next fetch call by 5 seconds
                setTimeout(fetchWait, 2500);
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

    async function fetchData() {
        console.log("Fetching game information...");

        try {
            const data = await getGameInformation(localStorage.getItem("game_code"));
            if (data) {
                setGameInfo(data);
                setDrawingTime(data.draw_time);
                setWritingTime(data.desc_time);
                setGameCode(data.game_code);
                setPlayers(data.users);
                fetchWait(); // Initiate long polling after successful fetch
            } else {
                throw new Error(data.message || "Failed to fetch game information");
            }
        } catch (error) {
            setErrMsg({ message: error.message, status: "failed" });
            console.error("Error fetching game information: ", error);
            setTimeout(fetchData, 1000); // Retry after 5 seconds
        }
    }

    useEffect(() => {
        isMounted.current = true;
        fetchData(); // Fetch data initially

        return () => {
            isMounted.current = false; // Clean up the flag on component unmount
            console.log("Cleaning up game lobby...");
        };
    }, []);

    const handleLeaveLobby = () => {
        navigate("/home");
    };

    const handleStartGame = () => {
        const access = localStorage.getItem('access');
        fetch(`${apiUrl}/api/session/${game_code}/start/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return response.text().then((text) => {
                    console.error("Response text:", text);
                    throw new Error(text);
                });
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
                setErrMsg({
                    message: "There was a problem creating the lobby",
                    status: "failed",
                });
            });
    };

    return (
        <div className="game-lobby w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden">
            <TopBar2 />

            <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
                {/* LEFT */}
                <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col ml-[2%]">
                    <span className="colored-subtitle-text ml-1">Player(s): </span>
                    <PlayerList players={players} />
                </div>

                {/* CENTER */}
                <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex ">
                    <div className="settings w-full flex flex-col gap-2 items-center mb-1">
                        <div className="flex items-center mb-1 pr-6 pl-6 pb-2 rounded-[5vh] justify-center bg-[rgb(var(--color-grey))]">
                            <span className="text-[72px] text-[rgb(var(--color-ascent1))]">
                                {game_code}
                            </span>
                        </div>
                        <div className="info-text-wrapper">
                            <span className="text-[18px] text-[rgb(var(--color-ascent1))]">
                                Players in Lobby: {players.length}
                            </span>
                        </div>

                        <div className="info-text-wrapper">
                            <span className="text-[18px] text-[rgb(var(--color-ascent1))]">
                                Drawing Round: {drawingTime}s
                            </span>
                        </div>

                        <div className="info-text-wrapper mb-[10vh]">
                            <span className="text-[18px] text-[rgb(var(--color-ascent1))]">
                                Prompt Round: {writingTime}s
                            </span>
                        </div>

                        <div className="flex flex-row gap-2">
                            <CustomButton
                                onClick={handleStartGame}
                                containerStyles={"colored-button-style"}
                                title="Start Game"
                            />
                            {/* <CustomButton
                                onClick={handleLeaveLobby}
                                containerStyles={"colored-button-style"}
                                title="Leave Lobby"
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameLobby;
