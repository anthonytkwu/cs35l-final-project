import React from "react";
import { useSelector } from "react-redux";
import {currentGameSelector} from "../modules/currentGame/slice"

export const PromptPanel = () => {
    const currentGame = useSelector(currentGameSelector);

    return (
        <div className="prompt-panel">
            <div>
                <div>Time To Draw!</div>
                <div >{currentGame.prompt}</div>
            </div>
            <div className="round-count">
                {currentGame.round}/{currentGame.totalRounds}
            </div>
        </div>
      );
}