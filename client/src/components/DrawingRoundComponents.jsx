import React from 'react';
import undoImg from "../assets/drawingBoard/undo.png";
import redoImg from "../assets/drawingBoard/redo.png";

export const UndoButton = ({ onClick }) => (
  <button onClick={onClick}>
    <img src={undoImg} alt="Undo" />
  </button>
);

export const RedoButton = ({ onClick }) => (
  <button onClick={onClick}>
    <img src={redoImg} alt="Redo" />
  </button>
);

export const EraseButton = ({ isErasing, onClick }) => (
  <button onClick={onClick}>
    {isErasing ? 'Stop Erasing' : 'Erase'}
  </button>
);

export const SaveButton = ({ onClick }) => (
  <button onClick={onClick}>
    SUBMIT
  </button>
);

export const ColorPicker = ({ color, onChange }) => (
  <input 
    type="color" 
    value={color} onChange={onChange} 
    style={{width: '100%', height: '50px', padding: '1px'}}/>
);

export const FontSizeSlider = ({ lineWidth, onChange }) => (
  <input
    type="range"
    min="1"
    max="20"
    value={lineWidth}
    onChange={onChange}
  />
);