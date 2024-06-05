import { TopBar2 } from '../components';
import "./GameReview.css"

const GameReview = () => {
    return (
        <div className="flex flex-col justify-start h-screen bg-bgColor">
            <div><TopBar2/></div>
            <div className='flex flex-row gap-[10px] justify-center m-[2%]'>
                <div className='w-1/5 h-[75vh] rounded-[5%] bg-[rgb(var(--color-grey))]'>
                    {/* user list */}
                </div>
                <div className='w-2/5 h-[75vh] rounded-[5%] bg-[rgb(var(--color-grey))]'>

                </div>
            </div>
        </div>
    );
}

export default GameReview;