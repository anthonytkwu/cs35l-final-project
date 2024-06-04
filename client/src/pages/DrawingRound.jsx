import React, { useRef, useState, useEffect } from 'react';
import { ColorPicker, EraseButton, FontSizeSlider, RedoButton, SaveButton, UndoButton } from '../components/DrawingComponents';
import { TopBar2 } from '../components';

const DrawingRound = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [paths, setPaths] = useState([]); // Stores SVG paths

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 900 * 2; // Adjust canvas width
    canvas.height = 400 * 2; // Adjust canvas height
    canvas.style.width = '900px';
    canvas.style.height = '400px';
    
    context.scale(2, 2);
    context.lineCap = 'round';
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = isErasing ? 'white' : color;
    contextRef.current.lineWidth = isErasing ? 30 : lineWidth; // Eraser size larger for visibility
    setIsDrawing(true);

    setPaths((prevPaths) => [
      ...prevPaths,
      { type: isErasing ? 'erase' : 'draw', color, lineWidth, points: [{ x: offsetX, y: offsetY }] },
    ]);
  };
  

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    setLines([...lines, contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    setRedoLines([]);
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

    contextRef.current.putImageData(newLines[newLines.length - 1] || new ImageData(canvasRef.current.width, canvasRef.current.height), 0, 0);

    setPaths((prevPaths) => prevPaths.slice(0, -1));
  };

  const redo = () => {
    if (redoLines.length === 0) return;
    const newRedoLines = [...redoLines];
    const line = newRedoLines.pop();
    setRedoLines(newRedoLines);
    setLines([...lines, line]);

    contextRef.current.putImageData(line, 0, 0);
  };

  const saveAsSVG = () => {
    const svgPaths = paths.map((path) => {
      const pathData = path.points
        .map((point, index) => (index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`))
        .join(' ');
      return `<path d="${pathData}" stroke="${path.color}" stroke-width="${path.lineWidth}" fill="none" />`;
    }).join('');

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        ${svgPaths}
      </svg>
    `;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drawing.svg';
    link.click();    
  };

  return (
    <div className="flex flex-col justify-start bg-bgColor">
        <div><TopBar2/></div>
        <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
            <span className='colored-subtitle-text pr-2'>Your Prompt is:</span>
            <span className='text-ascent-1 text-xl font-semibold'>_PROMPT GOES HERE_</span>
        </div>
        <div className="flex justify-between">
            {/* set canvas */}
            <div>
                <canvas
                    ref={canvasRef}
                    className='m-5 bg-white'
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}/>
            </div>
            {/* set controls */}
            <div className="flex flex-col float-right w-1/5 m-[1%] p-[1%] gap-[10px] bg-[rgb(var(--color-grey))]">
                <div className="flex flex-row gap-2">
                    <UndoButton onClick={undo}/>
                    <RedoButton onClick={redo}/>
                </div>
                <EraseButton isErasing={isErasing} onClick={() => setIsErasing(!isErasing)}/>
                <ColorPicker 
                    color={color} 
                    onChange={(e) => setColor(e.target.value)}
                    style={{height: "100px"}}  />
                <FontSizeSlider lineWidth={lineWidth} onChange={(e) => setLineWidth(e.target.value)}/>
                <SaveButton onClick={saveAsSVG}/>
            </div>
        </div>
    </div>
  );
};

export default DrawingRound;