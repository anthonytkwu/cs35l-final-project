import { saveAs } from "file-saver";
import { useCanvas } from "../CanvasContext";
import { getCanvasImage } from "../utils/canvasUtils";
import { useDispatch } from "react-redux";
import { show } from "../modules/modals/slice";

export const FilePanel = () => {
  const dispatch = useDispatch();
  const canvasRef = useCanvas();

  const exportToFile = async () => {
    const file = await getCanvasImage(canvasRef.current);
    if (!file) {
      return;
    }
    saveAs(file, "drawing.png");
  };

  return (
    <div className="window file">
      <div className="title-bar">
        <div className="title-bar-text">File</div>
      </div>
      <div className="window-body">
        <div className="field-row">
          <button className="save-button" onClick={exportToFile}>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
