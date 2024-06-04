import React, { useRef, useState, useEffect } from 'react';
import './DrawingRound.css';

import undoImg from "../assets/drawingBoard/undo.png";
import redoImg from "../assets/drawingBoard/redo.png"
import { ColorPicker, EraseButton, FontSizeSlider, RedoButton, SaveButton, UndoButton } from '../components/DrawingRoundComponents';

const DrawingRound = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);

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
  };

  const undo = () => {
    if (lines.length === 0) return;
    const newLines = [...lines];
    const redoLine = newLines.pop();
    setRedoLines([...redoLines, redoLine]);
    setLines(newLines);

    contextRef.current.putImageData(newLines[newLines.length - 1] || new ImageData(canvasRef.current.width, canvasRef.current.height), 0, 0);
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <foreignObject width="100%" height="100%">
          <canvas xmlns="http://www.w3.org/1999/xhtml" width="${canvas.width}" height="${canvas.height}">
            ${ctx.getImageData(0, 0, canvas.width, canvas.height)}
          </canvas>
        </foreignObject>
      </svg>
    `;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drawing.svg';
    link.click();
  };

  return (
    <div className="DrawingRound">
      <div className="prompt-box">
        <span>Prompt: </span>
        <input type="text" placeholder="Enter your prompt here" />
      </div>
      <div className="canvas-and-controls">
        {/* set canvas */}
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}/>
        </div>
        {/* set controls */}
        <div className="controls">
            <div className="undo-redo">
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