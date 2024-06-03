import { useDispatch } from "react-redux";
import { currentStrokeSelector, setStrokeSize } from "../modules/currentStroke/slice";
import { useSelector } from "react-redux";

export const SliderPanel = () => {
    const dispatch = useDispatch();
    const strokeSize = useSelector(currentStrokeSelector).size;

    const onSliderChange = (event) => {
        dispatch(setStrokeSize(Number(event.target.value)));
      };

    return (
        <div className="window-colors-panel">
            <div className="title-bar">
                <div className="title-bar-text">Font Size: {strokeSize}</div>
            </div>
        <input
            type="range"
            min="2"
            max="25"
            value={strokeSize}
            onChange={onSliderChange}
        />
      </div>
    );
};