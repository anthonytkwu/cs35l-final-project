import { TopBar2 } from '../components';
import UserCard from '../components/UserCard';

const GameReview = () => {
    return (
        <div className="flex flex-col justify-start h-screen bg-bgColor">
            <div><TopBar2/></div>
            <div className='flex flex-row gap-[10px] justify-center m-[2%]'>
                <div className='flex flex-col items-center gap-0.5 w-1/5 h-[75vh] rounded-[5vh] p-2 bg-[rgb(var(--color-grey))]'>
                    <UserCard/>
                    <UserCard/>
                    <UserCard/>
                </div>
                <div className='w-2/5 h-[75vh] rounded-[5vh] bg-[rgb(var(--color-grey))]'>

                </div>
            </div>
        </div>
    );
}

export default GameReview;