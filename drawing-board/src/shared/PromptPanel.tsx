import { useDispatch } from "react-redux";

export const PromptPanel = () => {
    const dispatch = useDispatch();

    return (
        <div className="prompt-panel">
          <div className="title-bar">
            <div className="title-bar-text">Time To Draw!</div>
          </div>
            <div className="prompt-text">A tiger</div>
        </div>
      );
}