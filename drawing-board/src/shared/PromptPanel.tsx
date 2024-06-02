import React from "react";
import { useSelector } from "react-redux";
import {currentGameSelector} from "../modules/currentGame/slice"

export const PromptPanel = () => {
    const currentGame = useSelector(currentGameSelector);

    return (
        <div className="prompt-panel">
          <div className="title-bar">
            <div className="title-bar-text">Time To Draw!</div>
          </div>
            <div className="prompt-text">{currentGame.prompt}</div>
        </div>
      );
}