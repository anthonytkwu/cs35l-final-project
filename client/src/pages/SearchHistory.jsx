import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar2, CustomButton, TextInput, } from "../components";
import { useForm } from "react-hook-form";
import { Loading } from "../components";
import { intercept } from "../hooks/Intercept.js";
import { handleGameDataAndNavigate } from "../utils.js";
import { useEffect } from "react";
import { interceptSVG } from "../api.js";


const SearchHistory = () => {

    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [codes, setCodes] = useState([]);

    const {
        register: registerJoin,
        handleSubmit: handleSubmitJoin,
        formState: { errors: errorsJoin },
    } = useForm({ mode: "onChange" });


    function backToHome() {
        navigate(`/home`);
    }


    useEffect(() => {
        intercept("/api/past_sessions/", 'GET', null, navigate)
            .then((obj) => {
                console.log("HERE: " + JSON.stringify(obj));
                const fetchedCodes = obj.map((item) => item.game_code);
                console.log(fetchedCodes);
                setCodes(fetchedCodes);
            })
            .catch((error) => {
                console.error('Error fetching past sessions:', error);
            });
    }, [navigate]);

    /*
    for (let i = 0; i < Math.max(codes.length); i++) {
        if (i < codes.length) combinedArray.push({ type: 'string', content: codes[i] });
    }
    */


    const FindGame = async (data) => {
        // console.log("Attempting to find game...");

        const access = localStorage.getItem('access');
        if (!access) {
            setErrMsg({ message: 'Authentication token is missing', status: 'failed' });
            return;
        }

        const gameData = {
            game_id: data.findGameCode,
        };

        intercept(`/api/session/${gameData.game_id}/info/`, 'GET', null, navigate)
        .then((data) => {
            localStorage.setItem("game_code", data.game_code);
            // console.log(localStorage.getItem("game_code"));
            navigate("/game-review");
            setIsSubmitting(true);
            setIsSubmitting(false);            
        })
        .catch((error) => {
            console.error('Error occurred:', error);
        });

    };

    return (
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden'>
            <TopBar2 />

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                {/* LEFT */}
                <div className='hidden w-1/8 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                    <div className='flex items-center justify-center'>
                        <form className='lobby-input-style'>
                        </form>
                    </div>
                </div>
                <div className='w-1/4 max-h-3/4 overflow-y-scroll border border-gray-300 p-4 rounded-[5vh] bg-[rgb(var(--color-grey))]'>
                    {codes.map((item, index) => (
                        <div key={index} className="py-2">
                            <p className="flex justify-center mb-2" >{item.content}</p>
                        </div>
                    ))}
                </div>

                {/* CENTER */}
                <div className='w-full lg:w-1/3 h-full p-10 2xl:px-20 flex flex-col justify-center '>
                    <div className='w-full flex gap-2 items-center mb-1 justify-center'>
                        <span className='colored-subtitle-text'>
                            Search Old Game
                        </span>
                    </div>

                    {/* Game Search Form */}
                    <form className='lobby-input-style' onSubmit={handleSubmitJoin(FindGame)}>
                        <TextInput
                            name='findGameCode'
                            placeholder='123456'
                            label='Enter Six Digit Code'
                            type='text'
                            register={registerJoin("findGameCode", {
                                required: "Lobby code is required",
                                minLength: {
                                    value: 6,
                                    message: "Lobby code must be 6 digits"
                                },
                                maxLength: {
                                    value: 6,
                                    message: "Lobby code must be 6 digits"
                                }
                            })}
                            styles='w-full rounded-full'
                            error={errorsJoin.findGameCode ? errorsJoin.findGameCode.message : ""} />

                        {isSubmitting ? <Loading /> : <CustomButton
                            type='submit'
                            containerStyles={'colored-button-style'}
                            title='Join' />
                        }
                        {errMsg && <span className="text-red-500">{errMsg.message}</span>}
                    </form>

                    <CustomButton
                            onClick={backToHome}
                            containerStyles={'colored-button-style'}
                            title='Return Home' />
                </div>

            </div>

        </div>
    );
};

export default SearchHistory