import { useDispatch } from "react-redux";
import { currentStrokeSelector, setStrokeSize } from "../modules/currentStroke/slice";
import { useSelector } from "react-redux";
import React from "react";

export const SliderPanel = () => {
    const dispatch = useDispatch();
    const strokeSize = useSelector(currentStrokeSelector).size;

    const onSliderChange = (event) => {
        dispatch(setStrokeSize(Number(event.target.value)));
      };

    return (
        <div className="toolbar-element">
            <div className="font-size-slider">
                <input
                    type="range"
                    min="2"
                    max="25"
                    value={strokeSize}
                    onChange={onSliderChange}
                />
            </div>
      </div>
    );
};