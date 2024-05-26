import { useDispatch } from "react-redux";
import { setStrokeColor } from "../modules/currentStroke/slice";

const COLORS = [
  "#000000",    //black
  "#808080",    //gray
  "#c0c0c0",    //light gray
  "#ffffff",    //white
  "#d42a2a",    //red
  "#d67036",    //orange
  "#d6a336",    //yellow ochre
  "#e8eb34",    //yellow
  "#abeb34",    //light green
  "#0ba133",    //green
  "#55d498",    //blue-green
  "#55d4cd",    //cyan
  "#5581d4",    //pale blue
  "#2258d6",    //blue
  "#3c46b5",    //indigo
  "#9e79db",    //lavender
  "#6126bf",    //purple
  "#9c26bf",    //magenta
  "#ebabdd",    //pale pink
];

export const ColorPanel = () => {
  const dispatch = useDispatch();
  const onColorChange = (color: string) => {
    dispatch(setStrokeColor(color));
  };

  return (
    <div className="window-colors-panel">
      <div className="title-bar">
        <div className="title-bar-text">Colors</div>
      </div>
      <div className="window-body colors">
        {COLORS.map((color: string) => (
          <div
            key={color}
            onClick={() => {
              onColorChange(color);
            }}
            className="color"
            style={{ backgroundColor: color }}></div>
        ))}
      </div>
    </div>
  );
};
