import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameInformation, postUserDrawing, postWaitForGameUpdates, interceptSVG } from "../api";
import { ColorPicker, EraseButton, FontSizeSlider, RedoButton, SaveButton, UndoButton } from '../components/DrawingComponents';
import { TopBar2 } from '../components';
import { intercept } from "../hooks/Intercept.js";


const DrawingRound = () => {
    const navigate = useNavigate();
    const [gameRound, setGameRound] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const [countdown, setCountdown] = useState(5); // Initialize countdown


    const isFetching = useRef(false);
    const isMounted = useRef(true);

    //canvas utils
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState([]);
    const [redoLines, setRedoLines] = useState([]);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);
    const [isErasing, setIsErasing] = useState(false);
    const [paths, setPaths] = useState([]); // Stores SVG paths
    const [redoPaths, setRedoPaths] = useState([]); // Stores redo SVG paths
    const [prompt, setPrompt] = useState(""); // stores game-prompt from server

    function getDescription(gameData, navigate) {

        const username = localStorage.getItem('current_user')
        //console.log("current username " + username)
    
        //    URL: api/session/<str:game_code>/<int:round>/<int:chain>/getDesc/
        //console.log(gameData)
        //console.log(gameData.chains[username])
        const url = `/api/session/${gameData.game_code}/${gameData.round - 1}/${gameData.chains[username]}/getDesc/`
        //console.log(url)
        intercept(url, 'GET', null, navigate)
            .then((data) => {
                //console.log(data)
                setPrompt(data.description); // Set the prompt from the data
                return data
            })
            .catch((error) => {
                console.error('Error occurred');
            });
    
    
    }


    const fetchWait = async () => {
        if (isFetching.current || !isMounted.current) return;
        isFetching.current = true;

        try {
            const data = await postWaitForGameUpdates({});
            if (data && isMounted.current) {
                localStorage.setItem("game_data", JSON.stringify(data));
                if (data.round > localStorage.getItem('current_round')) {
                    localStorage.setItem('current_round', data.round);
                    navigate("/description-round");
                }
                if (isMounted.current) {
                    setTimeout(fetchWait, 2500); // Only set timeout if still mounted
                }
            }
        } catch (error) {
            if (isMounted.current) {
                console.error("Error waiting for game updates:", error);
                setTimeout(fetchWait, 2500);
            }
        } finally {
            isFetching.current = false;
        }
    };

    async function fetchData(navigate) {
        try {
            console.log("Fetching game information...");
            const data = await getGameInformation(localStorage.getItem('game_code'));
            //console.log("this is the data: " + data.chains);
            setGameRound(data.round); // Set gameInfo state variable with fetched data
            setCountdown(parseInt(data.draw_time));
            getDescription(data);
            fetchWait(navigate)
            //setCountdown(10);
        } catch (error) {
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    async function postDrawing(){
        try{    
            console.log("Attempting to upload description");
            await postUserDrawing({}, "");
            console.log("SUCCESS [PD]")
        } catch (error){
            setErrMsg({ message: error.message, status: 'failed' });
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = 900 * 2; // Set canvas width
        canvas.height = 400 * 2; // Set canvas height
        canvas.style.width = '900px';
        canvas.style.height = '400px';

        context.scale(2, 2);
        context.lineCap = 'round';
        contextRef.current = context;

        fetchData(navigate);
    }, []);

    useEffect(() => {
        if (countdown !== null) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer); 
                        // Handle end of drawing round here, e.g., navigate to another page or show a message
                        console.log("Drawing round ended");
                        //postDrawing();
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        }
    }, [countdown])

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.strokeStyle = isErasing ? 'white' : color;
        contextRef.current.lineWidth = isErasing ? 30 : lineWidth; // Eraser size larger for visibility
        setIsDrawing(true);

        setPaths((prevPaths) => [
            ...prevPaths,
            { type: isErasing ? 'erase' : 'draw', color: isErasing ? 'white' : color, lineWidth: isErasing ? 30 : lineWidth, points: [{ x: offsetX, y: offsetY }] },
        ]);
    };


    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        setLines([...lines, contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
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
        if (lines.length === 0) return;
        const newLines = [...lines];
        const redoLine = newLines.pop();
        setRedoLines([...redoLines, redoLine]);
        setLines(newLines);

        contextRef.current.putImageData(newLines[newLines.length - 1] 
            || new ImageData(canvasRef.current.width, canvasRef.current.height), 0, 0);

        const newPaths = [...paths];
        const redoPath = newPaths.pop();
        setRedoPaths([...redoPaths, redoPath]);
        setPaths(newPaths);
    };


    const redo = () => {
        if (redoLines.length === 0) return;
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
        const svgPaths = paths.map((path) => {
            const pathData = path.points
                .map((point, index) => (index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`))
                .join(' ');
            return `<path d="${pathData}" stroke="${path.color}" stroke-width="${path.lineWidth}" fill="none" />`;
        }).join('');

        // Create SVG content
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
                ${svgPaths}
            </svg>`;

        // Convert SVG content to a Blob
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });

        // FormData to hold the SVG file
        const formData = new FormData();
        formData.append("drawing", blob, "drawing.svg");   
        const data = await getGameInformation(localStorage.getItem("game_code"));
        const round = localStorage.getItem('current_round');
        console.log(data)
        const userChain = data.chains[localStorage.getItem('current_user')];
        const url = `/api/session/${localStorage.getItem("game_code")}/${round}/${userChain}/draw/`
        interceptSVG(url, "POST", formData, navigate)
        
    };


    // const saveDrawing = () => {
    //     canvasRef.current.toBlob((blob) => {
    //         const file = new File([blob], "drawing.png", { type: "image/png" });
    //         uploadDrawing(file);
    //     });
    // };

    // const uploadDrawing = async (file) => {
    //     const formData = new FormData();
    //     formData.append("drawing", file);
    
    //     const data = await getGameInformation(localStorage.getItem("game_code"));
    //     const round = localStorage.getItem('current_round');
    //     console.log(data)
    //     const userChain = data.chains[localStorage.getItem('current_user')];
    //     const url = `/api/session/${localStorage.getItem("game_code")}/${round}/${userChain}/draw/`;

    //     interceptSVG(url, "POST", formData, navigate)
    // };
    

    // Upload Drawing:
    // Actions: POST
    // -H "Content-Type: multipart/form-data"
    // URL: api/session/<str:game_code>/<int:round>/<int:chain>/draw/
    // Request:
    //     {}
    // Form Data:
    //     drawing=@/path/to/your/svg/img.svg
    // Response:
    //     {}


    return (
        <div className="flex flex-col justify-start bg-bgColor">
            <div><TopBar2 /></div>
            {/* Display the game code at the top */}
            <div className='w-full flex justify-center p-5'>
                <span className='text-4xl font-bold text-ascent-1'> Game ID: {localStorage.getItem('game_code')}</span>
            </div>
            <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
                <span className='colored-subtitle-text pr-2'>Your Prompt is:</span>
                <span className='text-ascent-1 text-xl font-semibold'>{prompt}</span>
            </div>
            <div className="flex justify-between">
                {/* set canvas */}
                <div>
                    <canvas
                        ref={canvasRef}
                        className='m-5 bg-white'
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw} />
                </div>
                {/* set controls */}
                <div className="flex flex-col float-right w-1/5 m-[1%] p-[1%] gap-[10px] bg-[rgb(var(--color-grey))]">
                    <div className="flex flex-row gap-2">
                        <UndoButton onClick={undo} />
                        <RedoButton onClick={redo} />
                    </div>
                    <EraseButton isErasing={isErasing} onClick={() => setIsErasing(!isErasing)} />
                    <ColorPicker
                        color={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ height: "100px" }} />
                    <FontSizeSlider lineWidth={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
                    <SaveButton onClick={saveAsSVG} />
                </div>
            </div>
            <div className='w-full flex justify-center p-5'>
                <span className='text-normal text-ascent-1'>
                    {countdown} second(s) left before round ends
                </span>
            </div>
        </div>
    );
};


export default DrawingRound;



