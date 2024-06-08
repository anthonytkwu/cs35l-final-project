import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getGameInformation,
  postWaitForGameUpdates,
  interceptSVG,
} from "../api";
import {
  ColorPicker,
  EraseButton,
  FontSizeSlider,
  RedoButton,
  SaveButton,
  UndoButton,
} from "../components/DrawingComponents";
import { TopBar2 } from "../components";
import { intercept } from "../hooks/Intercept.js";
import { apiUrl } from "../config.js";

const DrawingRound = () => {
  const navigate = useNavigate();
  const [gameRound, setGameRound] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [countdown, setCountdown] = useState(5); // Initialize countdown
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isFetching = useRef(false);
  const isMounted = useRef(true);
  const hasSaved = useRef(false); // New flag to check if saveAsSVG has been called

  // canvas utils
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [paths, setPaths] = useState([]); // Stores SVG paths
  const [redoPaths, setRedoPaths] = useState([]); // Stores redo SVG paths
  const [prompt, setPrompt] = useState(""); // stores game-prompt from server

  const fetchWait = async () => {
    if (isFetching.current || !isMounted.current) return;
    isFetching.current = true;

    try {
      const data = await postWaitForGameUpdates({});
      if (data && isMounted.current) {
        localStorage.setItem("game_data", JSON.stringify(data));
        const currentRound = parseInt(
          localStorage.getItem("current_round"),
          10
        );
        if (data.round > currentRound) {
          localStorage.setItem("current_round", data.round.toString());
          navigate("/description-round");
        } else {
          setTimeout(fetchWait, 500); // Only set timeout if still mounted
        }
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Error waiting for game updates:", error);
        setTimeout(fetchWait, 500);
      }
    } finally {
      isFetching.current = false;
    }
  };

  const getDescription = async (gameData) => {
    const username = localStorage.getItem("current_user");
    const url = `/api/session/${gameData.game_code}/${gameData.round - 1}/${
      gameData.chains[username]
    }/getDesc/`;
    try {
      const data = await intercept(url, "GET", null, navigate);
      setPrompt(data.description);
    } catch (error) {
      console.error("Error occurred while fetching description:", error);
    }
  };

  const fetchData = async () => {
    try {
      console.log("Fetching game information...");
      const data = await getGameInformation(localStorage.getItem("game_code"));
      setGameRound(data.round); // Set gameInfo state variable with fetched data
      setCountdown(parseInt(data.draw_time));
      getDescription(data);
    } catch (error) {
      setErrMsg({ message: error.message, status: "failed" });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = 900 * 2; // Set canvas width
    canvas.height = 400 * 2; // Set canvas height
    canvas.style.width = "900px";
    canvas.style.height = "400px";

    context.scale(2, 2);
    context.lineCap = "round";
    contextRef.current = context;

    fetchData();
  }, []);

  useEffect(() => {
    if (countdown !== null) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            if (!hasSaved.current) {
              // Check if saveAsSVG has already been called
              saveAndNavigate();
              hasSaved.current = true; // Set the flag to true
            }
            console.log("Drawing round ended");
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on component unmount
    }
  }, [countdown]);

  const saveAndNavigate = async () => {
    await saveAsSVG();
    fetchWait(); // Call fetchWait after successful upload
  };

  const startDrawing = ({ nativeEvent }) => {
    if (isSubmitted) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = isErasing ? "white" : color;
    contextRef.current.lineWidth = isErasing ? 30 : lineWidth; // Eraser size larger for visibility
    setIsDrawing(true);

    setPaths((prevPaths) => [
      ...prevPaths,
      {
        type: isErasing ? "erase" : "draw",
        color: isErasing ? "white" : color,
        lineWidth: isErasing ? 30 : lineWidth,
        points: [{ x: offsetX, y: offsetY }],
      },
    ]);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    setLines([
      ...lines,
      contextRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      ),
    ]);
    setRedoLines([]);
    setRedoPaths([]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    setPaths((prevPaths) => {
      const newPaths = [...prevPaths];
      const currentPath = newPaths[newPaths.length - 1];
      currentPath.points.push({ x: offsetX, y: offsetY });
      return newPaths;
    });
  };

  const undo = () => {
    if (lines.length === 0 || isSubmitted) return;
    const newLines = [...lines];
    const redoLine = newLines.pop();
    setRedoLines([...redoLines, redoLine]);
    setLines(newLines);

    contextRef.current.putImageData(
      newLines[newLines.length - 1] ||
        new ImageData(canvasRef.current.width, canvasRef.current.height),
      0,
      0
    );

    const newPaths = [...paths];
    const redoPath = newPaths.pop();
    setRedoPaths([...redoPaths, redoPath]);
    setPaths(newPaths);
  };

  const redo = () => {
    if (redoLines.length === 0 || isSubmitted) return;
    const newRedoLines = [...redoLines];
    const line = newRedoLines.pop();
    setRedoLines(newRedoLines);
    setLines([...lines, line]);

    contextRef.current.putImageData(line, 0, 0);

    const newRedoPaths = [...redoPaths];
    const path = newRedoPaths.pop();
    setRedoPaths(newRedoPaths);
    setPaths([...paths, path]);
  };

  const saveAsSVG = async () => {
    // Generate SVG paths
    const svgPaths = paths
      .map((path) => {
        const pathData = path.points
          .map((point, index) =>
            index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`
          )
          .join(" ");
        return `<path d="${pathData}" stroke="${path.color}" stroke-width="${path.lineWidth}" fill="none" />`;
      })
      .join("");

    // Create SVG content
    const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
                ${svgPaths}
            </svg>`;

    // Convert SVG content to a Blob
    const blob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });

    // FormData to hold the SVG file
    const formData = new FormData();
    formData.append("drawing", blob, "drawing.svg");

    const data = await getGameInformation(localStorage.getItem("game_code"));
    const round = localStorage.getItem("current_round");
    const userChain = data.chains[localStorage.getItem("current_user")];
    const url = `${apiUrl}/api/session/${localStorage.getItem(
      "game_code"
    )}/${round}/${userChain}/draw/`;

    try {
      await interceptSVG(url, "POST", formData, navigate);
      setIsSubmitted(true); // Set isSubmitted to true after successful upload
    } catch (error) {
      console.error("Error uploading SVG:", error);
      setErrMsg({ message: error.message, status: "failed" });
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
        <span className="colored-subtitle-text pr-2">Your Prompt is:</span>
        <span className="text-ascent-1 text-xl font-semibold">{prompt}</span>
      </div>
      <div className="flex justify-between">
        {/* set canvas */}
        <div>
          <canvas
            ref={canvasRef}
            className="m-5 bg-white"
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
          />
        </div>
        {/* set controls */}
        <div className="flex flex-col float-right w-1/5 m-[1%] p-[1%] gap-[10px] bg-[rgb(var(--color-grey))]">
          <div className="flex flex-row gap-2">
            <UndoButton onClick={undo} />
            <RedoButton onClick={redo} />
          </div>
          <EraseButton
            isErasing={isErasing}
            onClick={() => setIsErasing(!isErasing)}
          />
          <ColorPicker
            color={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ height: "100px" }}
          />
          <FontSizeSlider
            lineWidth={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
          />
          {!isSubmitted && <SaveButton onClick={saveAsSVG} />}
        </div>
      </div>
      <div className="w-full flex justify-center p-5">
        <span className="text-normal text-ascent-1">
          {countdown} second(s) left before round ends
        </span>
      </div>
    </div>
  );
};

export default DrawingRound;
