import React, { useState } from 'react';
import { TextInput, TopBar2 } from '../components';
import exampleDrawing from "../assets/temp/example-drawing.png";

const DescriptionRound = () => {
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(true);

    const handleInputChange = (e) => {
        setDescription(e.target.value);
    };

    const handleButtonClick = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="flex flex-col justify-start bg-bgColor">
            <div><TopBar2/></div>
            <div className="w-full flex justify-center p-5 bg-[rgb(var(--color-grey))]">
                <span className='colored-subtitle-text pr-2'>Now it's your turn to describe the scene:</span>
            </div>
            <div className='flex flex-col items-center'>
                <div className='w-[900px] h-[400px] flex m-4'> 
                    <img src={exampleDrawing} alt='exampleDrawing'/>
                </div>
                <div className='flex items-center mb-[1%] gap-3'>
                    <TextInput
                        placeholder='...an elephant eating a pineapple'
                        type='text'
                        value={description}
                        styles="w-[400px] rounded-full"
                        onChange={handleInputChange}
                        disabled={!isEditing}/>
                    
                    <button className='colored-button-style mt-2.5' onClick={handleButtonClick}>
                        {isEditing ? 'DONE!' : 'EDIT'}
                    </button>
                </div>
                <div>
                
                </div>
            </div>
        </div>  
    );
}

export default DescriptionRound;