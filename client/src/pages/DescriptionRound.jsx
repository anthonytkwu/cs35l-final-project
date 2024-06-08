import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, TopBar2 } from "../components";
import {
  getGameInformation,
  postWaitForGameUpdates,
  interceptSVG,
  postUserDescription,
} from "../api";
import { intercept } from "../hooks/Intercept.js";

const DescriptionRound = () => {
  // Hooks to manage state and refs
  const navigate = useNavigate(); // Hook to navigate between routes
  const [errMsg, setErrMsg] = useState(""); // State to store error messages
  const [gameInfo, setGameInfo] = useState(null); // State to store game information
  const [description, setDescription] = useState(""); // State to store user input description
  const [isEditing, setIsEditing] = useState(true); // State to control if the user can edit the description
  const [countdown, setCountdown] = useState(null); // State to store countdown timer
  const [img, setImg] = useState(""); // State to store the image data

  // Refs to control component state outside of the render cycle
  const isFetching = useRef(false); // Ref to indicate if fetching is in progress
  const isMounted = useRef(true); // Ref to check if the component is mounted
  const descriptionPosted = useRef(false); // Ref to check if the description has been posted
  const fetchWaitCalled = useRef(false); // Ref to check if fetchWait has been called
  const timerRef = useRef(null); // Ref to store the countdown timer

  // Get current round from localStorage
  const currentRound = parseInt(localStorage.getItem("current_round"), 10);

  // Handler for input change in description
  const handleInputChange = (e) => {
    setDescription(e.target.value);
  };

  // Handler for submit button click
  const handleButtonClick = () => {
    if (!descriptionPosted.current) {
      setIsEditing(false);
      postDescription();
    }
  };

  // Function to post the user's description
  const postDescription = async () => {
    if (descriptionPosted.current) {
      return;
    }

    try {
      descriptionPosted.current = true; // Mark the description as posted
      await postUserDescription({}, description); // Post the description to the server
      fetchWait(); // Start waiting for game updates
    } catch (error) {
      console.error("Error uploading description:", error);
      setErrMsg({ message: error.message, status: "failed" }); // Set error message if posting fails
    }
  };

  // Function to fetch initial game data
  async function fetchData() {
    try {
      const data = await getGameInformation(localStorage.getItem("game_code")); // Fetch game information
      setGameInfo(data); // Store game information in state
      setCountdown(parseInt(data.desc_time)); // Set countdown timer
      getImage(data); // Fetch the image for the current round
    } catch (error) {
      setErrMsg({ message: error.message, status: "failed" }); // Set error message if fetching fails
    }
  }

  // Function to continuously wait for game updates
  const fetchWait = async () => {
    if (isFetching.current || !isMounted.current || fetchWaitCalled.current)
      return;
    isFetching.current = true;
    fetchWaitCalled.current = true;

    try {
      const data = await postWaitForGameUpdates({}); // Post request to wait for game updates
      if (data && isMounted.current) {
        localStorage.setItem("game_data", JSON.stringify(data)); // Store game data in localStorage
        if (data.round > currentRound) {
          localStorage.setItem("current_round", data.round.toString()); // Update current round in localStorage
          navigate("/drawing-round"); // Navigate to drawing round
        } else if (data.round == -2) {
          navigate("/game-review"); // Navigate to game review if round is -2
        } else {
          setTimeout(fetchWait, 500); // Retry after 500ms if no new round
        }
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Error waiting for game updates:", error);
        setTimeout(fetchWait, 500); // Retry after 500ms if an error occurs
      }
    } finally {
      isFetching.current = false;
      fetchWaitCalled.current = false;
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // useEffect to handle countdown timer
  useEffect(() => {
    if (countdown !== null && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
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
        }
      };
    }
  }, [countdown]);

  // Function to fetch the image for the current round
  const getImage = async (gameData) => {
    const username = localStorage.getItem("current_user");
    const url = `/api/session/${gameData.game_code}/${gameData.round - 1}/${
      gameData.chains[username]
    }/getDraw/`;

    try {
      const response = await intercept(url, "GET", null, navigate);
      const svgResponse = await interceptSVG(
        `${response.drawing}/`,
        "GET",
        null,
        navigate
      );
      setImg(`data:image/svg+xml;base64,${btoa(svgResponse)}`); // Set image data
    } catch (error) {
      console.error("Error occurred while fetching image:", error);
    }
  };

  return (
    <div className="flex flex-col justify-start bg-bgColor">
      <div>
        <TopBar2 />
      </div>
      {/* Display the game code at the top */}
      <div className="w-full flex justify-center p-5">
        <span className="text-4xl font-bold text-ascent-1">
          {" "}
          Game ID: {localStorage.getItem("game_code")}
        </span>
      </div>
      <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
        <span className="colored-subtitle-text pr-2">
          Now it's your turn to describe the scene:
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-[900px] h-[400px] flex m-4 bg-white">
          <img src={img} alt="Drawing" />
        </div>
        <div className="flex items-center mb-[1%] gap-3">
          <TextInput
            placeholder="...an elephant eating a pineapple"
            type="text"
            value={description}
            styles="w-[400px] rounded-full"
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <button
            className="colored-button-style mt-2.5"
            onClick={handleButtonClick}
            disabled={!isEditing}
          >
            {isEditing ? "Not Submitted" : "Submitted!"}
          </button>
        </div>
        <div className="w-full flex justify-center p-5">
          <span className="text-normal text-ascent-1">
            {countdown} second(s) left before round ends
          </span>
        </div>
      </div>
    </div>
  );
};

export default DescriptionRound;
