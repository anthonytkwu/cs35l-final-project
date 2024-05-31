import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { redo, undo } from "../modules/historyIndex/slice";
import { strokesLengthSelector } from "../modules/strokes/slice";

import undoImg from "../assets/undo.png";
import redoImg from "../assets/redo.png"

export const EditPanel = () => {
  const undoLimit = useSelector(strokesLengthSelector);
  const dispatch = useDispatch();

  return (
    <div className="edit toolbar-element">
        <button
            className="undo edit-button"
            onClick={() => dispatch(undo(undoLimit))} >
            <img className="edit-images" src={undoImg}/>
        </button>

        <button 
            className="redo edit-button" 
            onClick={() => dispatch(redo())}>
            <img className="edit-images" src={redoImg}/>
        </button>
    </div>
  );
};
