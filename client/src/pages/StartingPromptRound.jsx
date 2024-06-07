import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getGameInformation, postWaitForGameUpdates, postUserDescription } from "../api";
import { TopBar2 } from "../components";

const StartingPromptRound = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [gameInfo, setGameInfo] = useState(null);
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [hasResponded, setHasResponded] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const isFetching = useRef(false);
  const isMounted = useRef(true);
  const descriptionPosted = useRef(false);
  const fetchWaitCalled = useRef(false);
  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      isFetching.current = true;
      console.log("Fetching game information...");
      const data = await getGameInformation(localStorage.getItem("game_code"));
      console.log("Game information fetched:", data);
      setGameInfo(data);
      setCountdown(parseInt(data.desc_time));
      isFetching.current = false;
    } catch (error) {
      console.error("Error fetching game information:", error);
      setErrMsg({ message: error.message, status: "failed" });
      isFetching.current = false;
    }
  };

  const fetchWait = async () => {
    if (isFetching.current || !isMounted.current || fetchWaitCalled.current) {
      console.log("Fetch wait skipped. isFetching:", isFetching.current, "isMounted:", isMounted.current, "fetchWaitCalled:", fetchWaitCalled.current);
      return;
    }

    isFetching.current = true;
    fetchWaitCalled.current = true;
    console.log("Waiting for game updates...");

    try {
      const data = await postWaitForGameUpdates({});
      console.log("Game updates response:", data);
      if (data && isMounted.current) {
        localStorage.setItem("game_code", data.game_code);
        localStorage.setItem("game_data", JSON.stringify(data));
        if (data.round > 0) {
          //console.log("game data is this right now: " + data.chains);
          localStorage.setItem("current_round", data.round);
          navigate("/drawing-round");
        } else {
          console.log("No new round, retrying fetchWait in 5 seconds");
          setTimeout(fetchWait, 5000); // retry every 5 seconds if no new round
        }
      } else {
        throw new Error(data.message || "Failed to wait for game updates");
      }
    } catch (error) {
      console.error("Error waiting for game updates:", error);
      if (isMounted.current) {
        // Retry after 5 seconds if there's an error
        setTimeout(fetchWait, 0);
      }
    } finally {
      isFetching.current = false;
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

  useEffect(() => {
    console.log("Component mounted. Fetching initial data...");
    isMounted.current = true;
    fetchData();

    return () => {
      console.log("Component unmounted.");
      isMounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        console.log("Countdown timer cleared on unmount.");
      }
    };
  }, []);
  

  useEffect(() => {
    if (countdown !== null && timerRef.current === null) {
      console.log("Starting countdown timer:", countdown);
      timerRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          console.log("Countdown:", prevCountdown);
          if (prevCountdown <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            console.log("Countdown finished. hasResponded:", hasResponded);
            if (!descriptionPosted.current) {
              postDescription();
            }
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          console.log("Countdown timer cleared in effect cleanup.");
        }
      };
    }
  }, [countdown, hasResponded]);

  const handleInputChange = (e) => {
    console.log("Input changed:", e.target.value);
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

  return (
    <div className="w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden flex flex-col justify-center items-center">
      <TopBar2 />
      <div className="w-full flex justify-center p-5">
        <span className="text-4xl font-bold text-ascent-1">
          {" "}
          Game ID: {localStorage.getItem("game_code")}
        </span>
      </div>

      <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
        <span className="colored-subtitle-text pr-2">Type in a prompt:</span>
      </div>

      <div className="flex items-center mb-[1%] mt-[5%]">
        <input
          type="text"
          value={description}
          onChange={handleInputChange}
          placeholder="Enter text here"
          disabled={!isEditing}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 20px',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#1F1F1F',
            borderRadius: '30px',
            outline: 'none',
            marginTop: '10px',
            marginRight: '30px',
          }}
        />
        <button
          className="colored-button-style mt-2.5 w-[200px]"
          onClick={handleButtonClick}
          disabled={!isEditing}
        >
          {isEditing ? "Ready!" : "Not Ready"}
        </button>
      </div>

      <div className="w-full h-1/3 flex flex-row gap-2 mb-1 justify-center">
        <span className="text-normal text-ascent-1 ">
          {countdown} second(s) left before round ends
        </span>
      </div>
    </div>
  );
};

export default StartingPromptRound;
