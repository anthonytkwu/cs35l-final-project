import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar2, CustomButton } from "../components";
import { apiUrl } from "../config.js";
import { handleGameDataAndNavigate } from "../utils.js";
import { intercept } from "../hooks/Intercept.js";

const CreateLobby = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [isHost, setIsHost] = useState(true);
  const [output, setOutput] = useState("");
  const [draw_time, setDrawingTime] = useState(60);
  const [desc_time, setWritingTime] = useState(30);

  function createLobbyCall() {
    const access = localStorage.getItem("access");
    if (!access) {
      setErrMsg({
        message: "Authentication token is missing",
        status: "failed",
      });
      return;
    }
    setOutput(
      "created with draw time: " + draw_time + " and desc time: " + desc_time
    );

    const data = {
      desc_time: desc_time,
      draw_time: draw_time,
    };

    intercept("/api/session/create/", "POST", data, navigate)
      .then((data) => {
        handleGameDataAndNavigate(data, navigate);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }

  const handleLeaveLobby = () => {
    navigate("/home");
  };

  const handleCreateLobby = () => {
    createLobbyCall();
  };

  return (
    <div className="game-lobby w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <TopBar2 />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        <div className="player-list hidden w-1/3 lg:w-1/4 h-full md:flex felx-col gap-6 overflow auto"></div>
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex ">
          <div className="settings w-full flex flex-col gap-2 items-center mb-1 justify-center ">
            {isHost && (
              <>
                <div className="w-full flex gap-2 items-center mb-1 justify-center ">
                  <span className="colored-subtitle-text">
                    Choose Length of Drawing Round
                  </span>
                </div>

                <div className="w-full flex gap-2 items-center mb-10 justify-center ">
                  <select
                    value={draw_time}
                    onChange={(e) => setDrawingTime(e.target.value)}
                  >
                    <option value={30}>30s</option>
                    <option value={45}>45s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>

                <div className="w-full flex gap-2 items-center mb-1 justify-center ">
                  <span className="colored-subtitle-text">
                    Choose Length of Prompt Round
                  </span>
                </div>

                <div className="w-full flex gap-2 items-center mb-10 justify-center ">
                  <select
                    value={desc_time}
                    onChange={(e) => setWritingTime(e.target.value)}
                  >
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={45}>45s</option>
                  </select>
                </div>

                <CustomButton
                  onClick={handleCreateLobby}
                  containerStyles={"colored-button-style"}
                  title="Confirm Settings"
                />
                <CustomButton
                  onClick={handleLeaveLobby}
                  containerStyles={"colored-button-style"}
                  title="Return Home"
                />
              </>
            )}
            {!isHost && (
              <div>
                Drawing Time: {draw_time}s, Writing Time: {desc_time}s
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLobby;
