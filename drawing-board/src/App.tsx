import { clearCanvas, drawStroke } from "./utils/canvasUtils";
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { beginStroke, updateStroke } from "./modules/currentStroke/slice";
import { endStroke } from "./modules/sharedActions";
import { strokesSelector } from "./modules/strokes/slice";
import { currentStrokeSelector } from "./modules/currentStroke/slice";
import { historyIndexSelector } from "./modules/historyIndex/slice";
import { ColorPanel } from "./shared/ColorPanel";
import { EditPanel } from "./shared/EditPanel";
import { useCanvas } from "./CanvasContext";
import { FilePanel } from "./shared/FilePanel";
import { ModalLayer } from "./ModalLayer";
import { SliderPanel } from "./shared/SliderPanel";
import { PromptPanel } from "./shared/PromptPanel";
import { currentGameSelector } from "./modules/currentGame/slice";

function App() {
  const canvasRef = useCanvas();

  const getCanvasWithContext = (canvas = canvasRef.current) => {
    return { canvas, context: canvas?.getContext("2d") };
  };

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();
    if (!canvas || !context) {
      return;
    }
    //Set canvas size to fill screen
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    //Scaling gives better on-screen resolution
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.getContext("2d")?.scale(2, 2);

    //Initial pen attributes
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = 10;
    context.strokeStyle = "black";

    clearCanvas(canvas);
  }, []);

  const currentStroke = useSelector(currentStrokeSelector);

  const isDrawing = !!currentStroke.points.length;
  const dispatch = useDispatch();

  useEffect(() => {
    const { context } = getCanvasWithContext();
    if (!context) {
      return;
    }
    requestAnimationFrame(() =>
      drawStroke(context, currentStroke.points, currentStroke.color, currentStroke.size)
    );
  }, [currentStroke]);

  // Canvas Events
  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;

    dispatch(beginStroke({ x: offsetX, y: offsetY }));
  };
  const endDrawing = () => {
    if (isDrawing) {
      dispatch(endStroke({ historyIndex, stroke: currentStroke }));
    }
  };
  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;

    dispatch(updateStroke({ x: offsetX, y: offsetY }));
  };

  const historyIndex = useSelector(historyIndexSelector);
  const strokes = useSelector(strokesSelector);

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();
    if (!context || !canvas) {
      return;
    }
    requestAnimationFrame(() => {
      clearCanvas(canvas);

      strokes.slice(0, strokes.length - historyIndex).forEach((stroke) => {
        drawStroke(context, stroke.points, stroke.color, stroke.size);
      });
    });
  }, [historyIndex]);

  return (
    <div className="window">
        <div className="info-panel">
            <PromptPanel/>
        </div>
        <div className="drawing-panel">
            <div className="canvas-panel">
                <canvas
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                /> 
            </div>
            <div className="tools-panel">
                <ColorPanel/>
                <EditPanel />
                <SliderPanel/>
                <FilePanel />
            </div>
        </div>
    </div>
  );
}

export default App;
