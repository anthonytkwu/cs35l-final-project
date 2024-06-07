import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getGameInformation, postWaitForGameUpdates, postUserDescription } from "../api";
import { TextInput, TopBar2, CustomButton, Loading } from "../components";
import { useForm } from "react-hook-form";

const StartingPromptRound = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const [gameInfo, setGameInfo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasResponded, setHasResponded] = useState(false);
    const [countdown, setCountdown] = useState(null);

    const isFetching = useRef(false);
    const isMounted = useRef(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ mode: "onChange" });

    async function fetchData() {
        try {
            isFetching.current = true;
            console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            setGameInfo(data);
            setCountdown(parseInt(data.desc_time));
            isFetching.current = false;
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    async function fetchWait() {
        if (isFetching.current) {
            return;
        }

        isFetching.current = true;
        console.log("Waiting for game updates...");

        try {
            const data = await postWaitForGameUpdates({});
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
                setTimeout(fetchWait, 2500);
            } else {
                throw new Error(data.message || "Failed to wait for game updates");
            }
        } catch (error) {
            console.error("Error waiting for game updates: ", error);
            if (isMounted.current) {
                setTimeout(fetchWait, 2500);
            }
        } finally {
            isFetching.current = false;
        }
    }

    async function postDescription(data) {
        try {
            console.log("Attempting to upload description: " + data.description);
            await postUserDescription({}, data.description);
            console.log('Description uploaded: ' + `${localStorage.getItem('current_user')}`);
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

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

                        if (!hasResponded) handleSubmit(postDescription)();
                        fetchWait();
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countdown]);

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        setHasResponded(true);
        await postDescription(data);
        fetchWait();
        setIsSubmitting(false);
        reset();
    };

    return (
        <div className='w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden flex flex-col justify-center items-center'>
            <TopBar2 />
            <div className='w-full flex justify-center p-5'>
                <span className='text-4xl font-bold text-ascent-1'> Game ID: {localStorage.getItem('game_code')}</span>
            </div>
            <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
                <span className='colored-subtitle-text pr-2'>Type in a prompt:</span>
            </div>
            <form className='flex items-center mb-[1%] mt-[5%]' onSubmit={handleSubmit(handleFormSubmit)}>
                <TextInput
                    name='description'
                    placeholder='...a dog eating a banana'
                    type='text'
                    register={register("description", {
                        required: "Description is required",
                    })}
                    styles="w-[400px] rounded-full"
                    error={errors.description ? errors.description.message : ""} />
                {isSubmitting ? <Loading /> : (
                    <CustomButton
                        type='submit'
                        containerStyles='colored-button-style mt-2.5 w-[200px]'
                        title='Ready!'
                    />
                )}
            </form>
            <div className='w-full h-1/3 flex flex-row gap-2 mb-1 justify-center'>
                <span className='text-normal text-ascent-1 '>
                    {countdown} second(s) left before round ends
                </span>
            </div>
            {errMsg && <span className="text-red-500">{errMsg.message}</span>}
        </div>
    );
}

export default StartingPromptRound;
