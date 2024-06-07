import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getGameInformation,
  postWaitForGameUpdates,
  postUserDescription,
} from "../api";
import { TextInput, TopBar2 } from "../components";

const StartingPromptRound = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [gameInfo, setGameInfo] = useState(null);
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [hasResponded, setHasResponded] = useState(false);
  const [countdown, setCountdown] = useState(null); // Initialize countdown

  const isFetching = useRef(false);
  const isMounted = useRef(true);

  async function fetchData() {
    try {
      isFetching.current = true;
      console.log("Fetching game information...");
      const data = await getGameInformation(localStorage.getItem("game_code"));
      setGameInfo(data); // Set gameInfo state variable with fetched data
      setCountdown(parseInt(data.desc_time));
      isFetching.current = false;
    } catch (error) {
      setErrMsg({ message: error.message, status: "failed" });
    }
  }

  async function fetchWait() {
    if (isFetching.current) {
      return; // Prevent multiple simultaneous fetches
    }

    isFetching.current = true;
    console.log("Waiting for game updates...");

    try {
      const data = await postWaitForGameUpdates({}); //call doesnt ever return
      if (data && isMounted.current) {
        localStorage.setItem("game_code", data.game_code);
        localStorage.setItem("game_data", JSON.stringify(data));
        const username = localStorage.getItem("current_user");
        if (data.round > 0) {
          //console.log("game data is this right now: " + data.chains);
          localStorage.setItem("current_round", data.round);
          navigate("/drawing-round");
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
        setTimeout(fetchWait, 0);
      }
    } finally {
      isFetching.current = false;
    }
  }

  async function postDescription() {
    try {
      console.log("Attempting to upload description");
      await postUserDescription({}, `${description}`);
      console.log(
        "Description uploaded: " + `${localStorage.getItem("current_user")}`
      );
    } catch (error) {
      setErrMsg({ message: error.message, status: "LOLOLOL" });
      //console.log(`${description} FLAG`);
      console.error(errMsg);
    }
  }

  useEffect(() => {
    isMounted.current = true; // Set to true when component mounts
  
    fetchData();
  
    return () => {
      isMounted.current = false; // Set to false when component unmounts
    };
  }, []);
  

  useEffect(() => {
    let mounted = true; // Flag to check mount status

    if (countdown !== null) {
      const timer = setInterval(() => {
        if (mounted) {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(timer);
              if (!hasResponded) {
                postDescription();
              }
              return 0;
            }
            return prevCountdown - 1;
          });
        }
      }, 1000);

      return () => {
        clearInterval(timer); // Cleanup timer on component unmount
        mounted = false; // Set flag as unmounted
      };
    }
  }, [countdown, hasResponded]);

  const handleInputChange = (e) => {
    //console.log("Input Changed: ", e.target.value); // This should log every key press
    setDescription(e.target.value);
  };

  const handleButtonClick = () => {
    setIsEditing(!isEditing);
    setHasResponded(true);
    postDescription();
    fetchWait();
  };

  return (
    <div className="w-full px-0 pb-20 2xl:px-40 bg-bgColor h-screen overflow-hidden flex flex-col justify-center items-center">
      <TopBar2 />
      {/* Display the game code at the top */}
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
          onChange={handleInputChange} // Directly use the handler here to test
          placeholder="Enter text here"
          style={{
            width: "100%", // Full width
            maxWidth: "400px", // Maximum width
            padding: "10px 20px", // Padding inside the input
            fontSize: "16px", // Text size
            color: "#ffffff", // Text color
            backgroundColor: "#1F1F1F", // Background color
            borderRadius: "30px", // Rounded corners
            outline: "none", // Removing the outline on focus
            marginTop: "10px", // Moves the input down
            marginRight: "30px", // Moves the input to the right
          }}
        />

        <button
          className="colored-button-style mt-2.5 w-[200px]"
          onClick={handleButtonClick}
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
